import { prisma } from "../../../server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios'
import requestIp from 'request-ip'
import { getAuth } from "@clerk/nextjs/server";
import OpenAI from "openai";

interface Destination {
  location: string;
  days: number;
}

interface ItineraryPostBody {
    itineraryName: string;
    startDate: Date;
    endDate: Date;
    days: Date[];
    destinations: Destination[];
    isPublic: boolean;
    useAI: boolean;
    numTravelers: number;
    travelCompanion: string;
    interests: string;
}


const openai = new OpenAI({
    organization: process.env.OPENAI_ORGANIZATION,
    project: process.env.OPENAI_PROJECT,
});

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

          // let query

          // const comma = destinations.indexOf(',')

          // if (comma !== -1) {
          //   query = destinations.substring(0, comma)
          // } else {
          //   query = destinations
          // }

          // let unsplashPic 
          
          // try {
          //   const data = await axios.get(`https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}&count=1`)
          //   unsplashPic =  data.data[0].urls.full
          // } catch (error) {
          //   console.error(error)
          //   unsplashPic = 'https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81QpJ5K1BrL._AC_UF894,1000_QL80_.jpg'
          // }

          let completion;
          // Prompt for AI
          if (useAI) {
            try {
              completion = await openai.chat.completions.create({
                messages: [
                    {"role": "system", "content": "You are an experienced travel planner who has traveled all around the world. You know all the best spots and where the hottest trends are. Provide recommendations for activities based on the given locations, amount of days, how many people are traveling, and who is traveling (Ex. solo, family, friends). Provide activities for every time of day: Morning, noon, and evening/night. Each activity should include the name, time, and latitude and longitude of the location if possible. Format the response as a JSON object with the following structure: {\"locations\": [{\"name\": \"locationName\",\"activities\": [{\"time\": \"dateTime\",\"activityName\": \"activityName\",\"activityDescription\": \"activityDescription\",\"lat\": \"latitude\",\"long\": \"longitude\"}]}]}"},
                    {"role": "user", "content": 
                      `${destinations.map(d => `I am traveling to ${d.location} for ${d.days} days. `).join(' ')} 
                      I am traveling with ${numTravelers} people.
                      ${travelCompanion ? `I am traveling with ${travelCompanion}.` : ''}
                      ${interests ? `My interests are ${interests}.` : ''}
                      Provide a detailed itinerary for my trip. 
                      Provide activities for every time of day: Morning, noon, and evening/night.
                      All activities should include the name, time, and lattitude and longitude of the location.
                      `
                    }
                  ],
                model: "gpt-4o-mini",
              });
            
              console.log('GPT Response: ', completion);
            } catch (error) {
              console.error('Error generating AI itinerary:', error);
              // Handle the error appropriately, e.g., set a flag or return an error response
              res.status(500).json({
                error: {
                  code: 'server_error',
                  message: `An error occurred while generating the itinerary: ${error}.`,
                },
              });
              return;
            }
          }
          
          // parse the completetion response
          const parsedCompletion = JSON.parse(completion.choices[0].message.content)



          try {
            const baseData = {
              name: itineraryName,
              startDate: startDate,
              endDate: endDate,
              likes: 0,
              public: isPublic,
              collaborationId: null,
            };

            let data;

            if (userId) {
              data = await prisma.itinerary.create({
                data: {
                  ...baseData,
                  profile: {
                    connect: { clerkId: userId },
                  },
                  destinations: {
                    create: destinations.map((d: Destination) => ({
                      name: d.location,
                      tripDays: {
                        create: Array.from({ length: d.days }, (_, i) => ({
                          date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
                        })),
                      },
                      activities: {
                        create: parsedCompletion.locations.map((location: any) => location.activities.map((activity: any) => ({
                          name: activity.activityName,
                          description: activity.activityDescription,
                          time: activity.time,
                          lat: activity.lat,
                          long: activity.long,
                        })))
                      },
                    })),
                  },
                },
              });
            } else {
              data = await prisma.itinerary.create({
                data: {
                  ...baseData,
                  ipAddress: requestIp.getClientIp(req),
                  destinations: {
                    create: destinations.map((d: Destination) => ({
                      name: d.location,
                      tripDays: {
                        create: Array.from({ length: d.days }, (_, i) => ({
                          date: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
                        })),
                      },
                    })),
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
