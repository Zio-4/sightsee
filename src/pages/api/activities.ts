import { NextApiRequest, NextApiResponse } from "next";
import { validateRoute } from "../../lib/auth";
import { prisma } from '../../server/db/client'
import OpenAI from "openai";
import { type ChatCompletion } from "openai/resources/chat/completions";
import requestIp from 'request-ip'
import { getAuth } from "@clerk/nextjs/server";

const openai = new OpenAI({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY,
});

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
            name: "activity",
            schema: {
              type: "object",
              properties: {
                name: { type: "string" },
                startTime: { type: "string" },
                endTime: { type: "string" },
                contactInfo: { type: "string" },
                description: { type: "string" },
                address: { type: "string" },
                longitude: { type: "number" },
                latitude: { type: "number" },
                cost: { type: "number" }
              },
              required: ["name", "startTime", "endTime", "contactInfo", "description", "address", "longitude", "latitude", "cost"]
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
        const { 
          name, 
          startTime, 
          endTime, 
          contactInfo, 
          note, 
          address, 
          tripDayId, 
          longitude, 
          latitude, 
          useAI, 
          aiDescription, 
          destination,
          userCredits,
          destinationId
        } = req.body

        const { userId } = getAuth(req);

        if (useAI) {
          if (userCredits < 1) {
            res.status(400).json({ error: 'Not enough credits to generate AI activity.' });
            return;
          }

          let existingActivities = '';
          try {
            const activities = await prisma.activity.findMany({
              where: {
                tripDay: {
                  destinationId: destinationId
                }
              }
            });
            if (activities.length > 0) {
              existingActivities = activities.map(activity => activity.name).join(', ');
            }
          } catch (error) {
            console.error('Error fetching existing activities:', error);
          }

          let aiGeneratedActivity;
          try {
            const messages = [
              {"role": "system", "content": "You are an expert travel planner. You have traveled all over the world and have extensive knowledge of activities to do in different locations. Create an activity for this trip based on the following information: description, destination, existingActivities, and any additional notes."},
              {"role": "user", "content": `Create a detailed activity based on the following information:
                Destination: ${destination}
                Description: ${aiDescription}
                Existing Activities: ${existingActivities}
                Please provide the following details:
                - A descriptive name for the activity
                - A start time (in HH:MM format)
                - An end time (in HH:MM format)
                - A brief description of the activity, no more than 2 sentences.
                - Estimated cost in USD (as a number)
                - Contact information (if applicable)
                - Longitude and latitude of the activity location
                Format the response as a JSON object.`
              }
            ];

            const completion = await callChatGPT(messages, userId, requestIp.getClientIp(req));
            console.log('AI activity completion:', completion)

            const content = completion.choices[0]?.message?.content;
            if (!content) {
              throw new Error('No content received from OpenAI');
            }

            aiGeneratedActivity = JSON.parse(content);
            console.log('AI generated activity:', aiGeneratedActivity)
          } catch (error) {
            console.error('Error generating AI activity:', error);
            res.status(500).json({ error: 'An error occurred while generating the AI activity.' });
            return;
          }

          try {
            // Use a transaction to ensure atomicity
            const result = await prisma.$transaction(async (prisma) => {
              const activity = await prisma.activity.create({
                data: {
                  name: aiGeneratedActivity.name || name,
                  startTime: aiGeneratedActivity.startTime ? new Date(`1970-01-01T${aiGeneratedActivity.startTime}:00`) : startTime,
                  endTime: aiGeneratedActivity.endTime ? new Date(`1970-01-01T${aiGeneratedActivity.endTime}:00`) : endTime,
                  contactInfo: aiGeneratedActivity.contactInfo || contactInfo,
                  note: aiGeneratedActivity.description || note,
                  address: aiGeneratedActivity.address || address,
                  longitude: aiGeneratedActivity.longitude || longitude,
                  latitude: aiGeneratedActivity.latitude || latitude,
                  tripDay: {
                    connect: { id: tripDayId }
                  },
                  cost: aiGeneratedActivity.cost || 0,
                  isAiGenerated: true,
                  creditUsages: {
                    create: {
                      profileId: userId || '',
                      amount: 1
                    }
                  }
                },
              });

              await prisma.profile.update({
                where: {
                  clerkId: userId || ''
                },
                data: {
                  credits: {
                    decrement: 1
                  }
                }
              });

              return activity;
            });

            res.status(201).json(result);
          } catch (error) {
            console.error('Error creating activity and updating credits:', error);
            res.status(500).json({ error: 'An error occurred while creating the activity and updating credits.' });
          }
        } else {
          try {
            const data = await prisma.activity.create({
                data: {
                    name: name,
                    startTime: startTime,
                    endTime: endTime,
                    contactInfo: contactInfo,
                    note: note,
                    address: address,
                    longitude: longitude,
                    latitude: latitude,
                    tripDay: {
                        connect: { id: tripDayId }
                    },
                    cost: 0,
                    isAiGenerated: false
                },
            })

            res.status(201).json(data)
          } catch(e) {
            console.log(e)
            res.status(500).json({ error: 'An error occurred while creating the data.'})
          }
        }
        break
      case 'PUT':
        try {       
            const data = await prisma.activity.update({
                where: { id: req.body.activityId },
                data: { 
                    name: req.body.name,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    contactInfo: req.body.contactInfo,
                    note: req.body.note,
                    address: req.body.address,
                    longitude: req.body.longitude,
                    latitude: req.body.latitude,
                    cost: req.body.cost
                 },
            })

            res.status(200).json(data)
        } catch (error) {
            console.error(error)
            res.status(304).json({ error: 'The resource was not modified, try again.' })
        }
        break
      case 'DELETE':
        try {
            await prisma.activity.delete({
                where: { id: req.body.activityId },
            })

            res.status(200).json({ message: 'Successfully deleted resource'})
        } catch (error) {
            console.error(error)
            res.status(400).json({ error: 'There was a problem deleting the resource' })
        }
        break
      default:
        return res.status(501).json({
          error: {
            code: 'method_unknown',
            message: 'This endpoint only responds to POST, PUT, and DELETE',
          },
        });
    }
  }
