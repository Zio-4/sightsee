import { NextApiRequest, NextApiResponse } from "next";
import { validateRoute } from "../../lib/auth";
import { prisma } from '../../server/db/client'

export default async function (
    req: NextApiRequest,
    res: NextApiResponse,
  ): Promise<void> {
  
    switch (req.method) {
      case 'POST':
        try {
            const data = await prisma.activity.create({
                data: {
                    name: req.body.name,
                    contactInfo: req.body.contactInfo,
                    note: req.body.note,
                    address: req.body.address,
                    longitude: req.body.longitude,
                    latitude: req.body.latitude,
                    tripDay: {
                        connect: { id: req.body.tripDayId }
                    },
                    cost: req.body.cost
                },
            })

            res.status(201).json(data)
        } catch(e) {
            console.log(e)
            res.status(500).json({ error: 'An error occured while creating the data.'})
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
