import { prisma } from "../../../server/db/client";
import type { NextApiRequest, NextApiResponse } from "next";
import axios from 'axios'
import requestIp from 'request-ip'
import { getAuth } from "@clerk/nextjs/server";
import OpenAI from "openai";

interface ItineraryPostBody {
    itineraryName: string;
    startDate: Date;
    endDate: Date;
    days: Date[];
    destinations: string;
    isPublic: boolean;
    useAI: boolean;
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
          const { itineraryName, startDate, endDate, days, destinations, isPublic, useAI } = req.body as ItineraryPostBody

          const { userId } = getAuth(req)

          let query

          const comma = destinations.indexOf(',')

          if (comma !== -1) {
            query = destinations.substring(0, comma)
          } else {
            query = destinations
          }

          let unsplashPic 
          
          try {
            const data = await axios.get(`https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${process.env.UNSPLASH_ACCESS_KEY}&count=1`)
            unsplashPic =  data.data[0].urls.full
          } catch (error) {
            console.error(error)
            unsplashPic = 'https://m.media-amazon.com/images/W/IMAGERENDERING_521856-T1/images/I/81QpJ5K1BrL._AC_UF894,1000_QL80_.jpg'
          }

          // Prompt for AI
          if (useAI) {
            const completion = await openai.chat.completions.create({
              messages: [
                  {"role": "system", "content": "You are an experienced travel planner who has traveled all around the world. You know all the best spots and where the hottest trends are. Provide recommendations for based on the given locations, amount of days, how many people are traveling, and who is traveling (Ex. solo, family, friends). Provide activities for every time of day: Morning, noon, and evening/night."},
                  {"role": "user", "content": 
                    `I am traveling to ${destinations} for ${days.length} days. 
                    I am traveling with ${people} people. 
                    Provide a detailed itinerary for my trip. 
                    Provide activities for every time of day: Morning, noon, and evening/night.
                    All activities should include the name, time, and lattitude and longitude of the location.
                    `
                  }
                ],
              model: "gpt-4o-mini",
            });
          
            console.log('GPT Response: ', completion.choices[0]);
          }
          
          try {
            const baseData = {
              name: itineraryName,
              startDate: startDate,
              endDate: endDate,
              destinations: destinations,
              likes: 0,
              coverPhoto: unsplashPic,
              tripDays: {
                create: days.map((d: Date) => ({
                  date: d
                }))
              },
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
                  }
                }
              });
            } else {
              data = await prisma.itinerary.create({
                data: {
                  ...baseData,
                  ipAddress: requestIp.getClientIp(req),
                }
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
