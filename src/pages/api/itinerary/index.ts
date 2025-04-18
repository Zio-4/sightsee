import { prisma } from "../../../server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios'
import requestIp from 'request-ip'
import { getAuth } from "@clerk/nextjs/server";
import OpenAI from "openai";
import { type ChatCompletion } from "openai/resources/chat/completions";
import { compareTwoStrings } from 'string-similarity'


interface Destination {
  location: string;
  days: number;
}

interface ItineraryPostBody {
    itineraryName: string;
    startDate: string;
    endDate: string;
    days: string[];
    destinations: Destination[];
    isPublic: boolean;
    useAI: boolean;
    numTravelers: number;
    travelCompanion: string;
    interests: string;
}

const openai = new OpenAI({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});

const normalizeString = (str: string) => {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

interface Location {
  location: string;
  activitiesByDay: Activity[][];
}

interface Activity {
  activityName: string;
  activityDescription: string;
  time: string;
  lat: string;
  long: string;
  address: string;
  cost: string;
}

// Helper function to find the best matching location
const findBestMatchingLocation = (inputLocation: string, availableLocations: Location[]): Location | null => {
  const normalizedInput = normalizeString(inputLocation);
  
  let bestMatch: Location | null = null;
  let highestSimilarity = 0;

  availableLocations.forEach(location => {
    const normalizedLocation = normalizeString(location.location);
    
    // Compare both the full string and individual parts
    const fullStringSimilarity = compareTwoStrings(normalizedInput, normalizedLocation);
    const partsSimilarity = compareTwoStrings(
      normalizedInput.split('').sort().join(''),
      normalizedLocation.split('').sort().join('')
    );

    const overallSimilarity = (fullStringSimilarity + partsSimilarity) / 2;

    if (overallSimilarity > highestSimilarity) {
      highestSimilarity = overallSimilarity;
      bestMatch = location;
    }
  });

  return highestSimilarity > 0.6 ? bestMatch : null; // Adjust threshold as needed
};

const createActivities = (inputLocation: string, parsedCompletion: { locations: Location[] }) => {
  const matchingLocation = findBestMatchingLocation(inputLocation, parsedCompletion.locations);

  if (matchingLocation) {
    return matchingLocation.activitiesByDay.map(day => 
      day.map((activity: Activity) => ({
        name: activity.activityName,
        startTime: new Date(`1970-01-01T${activity.time}:00`),
        endTime: null, 
        contactInfo: null,
        note: activity.activityDescription,
        address: activity.address,
        photo: null,
        longitude: parseFloat(activity.long) || 0,
        latitude: parseFloat(activity.lat) || 0,
        cost: parseFloat(activity.cost) || 0,
      }))
    );
  }

  return [];
};

const callChatGPT = async (messages: any[], userId: string | null, clientIp: string | null): Promise<ChatCompletion> => {
  const maxRetries = 3;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      const completion = await openai.chat.completions.create({
        messages: messages,
        model: "gpt-4o-mini",
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "itinerary",
            schema: {
              type: "object",
              properties: {
                locations: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      location: { type: "string" },
                      activitiesByDay: {
                        type: "array",
                        items: {
                          type: "array",
                          items: {
                            type: "object",
                            properties: {
                              time: { type: "string" },
                              activityName: { type: "string" },
                              activityDescription: { type: "string" },
                              address: { type: "string" },
                              cost: { type: "number" },
                              lat: { type: "number" },
                              long: { type: "number" }
                            },
                            required: ["time", "activityName", "activityDescription", "lat", "long"],
                            additionalProperties: false
                          }
                        }
                      }
                    },
                    required: ["location", "activitiesByDay"],
                    additionalProperties: false
                  }
                }
              },
              required: ["locations"],
              additionalProperties: false
            }
          }
        },
        user: userId || clientIp || undefined
      });
      return completion;
    } catch (error) {
      console.error(`Error calling ChatGPT (attempt ${retries + 1}):`, error);
      retries++;
      if (retries === maxRetries) {
        throw error;
      }
      // Wait for a short time before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error("Failed to call ChatGPT after maximum retries");
};

export default async function (
  req: NextApiRequest,
  res: NextApiResponse,
): Promise<void> {
    switch (req.method) {
        case 'POST':
          // Note: Use Zod or similar library to validate req body
          const { 
            itineraryName, 
            startDate, 
            endDate, 
            days, 
            destinations, 
            isPublic, 
            useAI,
            numTravelers,
            travelCompanion,
            interests
          } = req.body as ItineraryPostBody

          const { userId } = getAuth(req)

          let completion: ChatCompletion | null = null;
          // Prompt for AI
          if (useAI) {
            try {
              const messages = [
                {"role": "system", "content": "You are an experienced travel planner who has traveled all around the world. You know all the best spots and where the hottest trends are. Provide recommendations for activities based on the given locations, amount of days, how many people are traveling, and who is traveling (Ex. solo, family, friends). Provide activities for every time of day: Morning, noon, and evening/night. Each day should have different activities. Each activity should include the name, time, estimated cost in USD, and latitude and longitude of the location if possible. Time should be in 24 hour format: HH:MM. Cost should be in decimal format, without the dollar sign like so: 10.00."},
                { "role": "user", 
                  "content": `${destinations.map(d => `I am traveling to ${d.location} for ${d.days} days. `).join(' ')} 
                    I am traveling with ${numTravelers} people.
                    ${travelCompanion === 'Solo' ? `I am traveling solo.` : `I am traveling with ${travelCompanion}.`}
                    ${interests ? `My interests are ${interests}.` : ''}
                    Provide a detailed itinerary for my trip. 
                    All activities should include the name, time, and latitude and longitude of the location.
                    Group activities by day for each location.
                    If there are not enough activities to fill the itinerary, add more activities to the days that have less than 3 activities.
                    If that still doesn't fill the itinerary, add activites that are near the surrounding locations.
                  `
                }
              ];

              console.log('User prompt:', messages[1]?.content);
              
              completion = await callChatGPT(messages, userId, requestIp.getClientIp(req));
              // log total amount of tokens used
              console.log('Total tokens used: ', completion?.usage);
            
            } catch (error) {
              console.error('Error generating AI itinerary:', error);
              res.status(500).json({
                error: {
                  code: 'server_error',
                  message: `An error occurred while generating the itinerary: ${error}.`,
                },
              });
              return;
            }
          }

          try {
            const baseData = {
              name: itineraryName,
              startDate: startDate,
              endDate: endDate,
              likes: 0,
              public: isPublic,
              collaborationId: null,
            };

            let destinationsData;

            if (useAI && completion) {
              const parsedCompletion = completion?.choices[0]?.message?.content
              ? JSON.parse(completion.choices[0].message.content)
              : {};

              destinationsData = destinations.map((d: Destination) => ({
                name: d.location,
                tripDays: {
                  create: createActivities(d.location, parsedCompletion).map((activities, index) => ({
                    date: new Date(new Date(startDate).getTime() + index * 24 * 60 * 60 * 1000),
                    activities: {
                      create: activities
                    }
                  })),
                },
              }));
            } else {
              destinationsData = destinations.map((d: Destination) => ({
                name: d.location,
                tripDays: {
                  create: Array.from({ length: d.days }, (_, index) => ({
                    date: new Date(new Date(startDate).getTime() + index * 24 * 60 * 60 * 1000),
                    activities: {
                      create: [] // Empty activities for non-AI itineraries
                    }
                  })),
                },
              }));
            }

            let data;

            if (userId) {
              data = await prisma.itinerary.create({
                data: {
                  ...baseData,
                  profile: {
                    connect: { clerkId: userId },
                  },
                  destinations: {
                    create: destinationsData,
                  },
                },
              });
            } else {
              data = await prisma.itinerary.create({
                data: {
                  ...baseData,
                  ipAddress: requestIp.getClientIp(req),
                  destinations: {
                    create: destinationsData,
                  },
                },
              });
            }
            
            res.status(201).json(data);
          } catch (e) {
            console.error(e);
            res.status(500).json({
              error: {
                code: 'server_error',
                message: 'An error occurred while posting data.',
              },
            });
          }
          break;
        default:
          res.status(501).json({
            error: {
              code: 'method_unknown',
              message: 'This endpoint only responds to POST',
            },
          });
          break;
      }
} 
