import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import { users, itineraries, tripDays,} from './seedData'


async function main() {
    await Promise.all(users.map( async (user, i) => {
        return prisma.profile.create({
            data: {
                clerkId: `${i}`,
                bio: 'I love to travel to far away places. Check out my trips to learn about awesome places you can visit for cheap!',
                distanceUnits: 'MILES',
                dateFormat: 'MONTH',
                timeFormat: 'TWELVE',
                commentsNotification: true,
                remindersNotification: true,
                collaboratorJoinedNotification: true,
            }
        })
    })) 

    await Promise.all(itineraries.map( async (itin, i) => {
        return prisma.itinerary.create({
            data: {
                name: itin.name,
                startDate: itin.startDate,
                endDate: itin.endDate,
                likes: itin.likes,
                public: itin.public,
                destinations: itin.destinations,
                coverPhoto: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/BlankMap-World.svg',
                profile: {
                    connect: { clerkId: `${i}`}
                },
                tripDays: {
                    create: tripDays.map(trip => ({
                        date: trip.date,
                        activities: {
                            createMany: {
                                data: [
                                    {
                                        name: 'Empire State Building',
                                        startTime: new Date(),
                                        endTime: new Date(),
                                        contactInfo: '925-925-9259',
                                        note: 'Cool place',
                                        address: '20 W 34th St., New York, NY 10001',
                                        longitude: 73.9857,
                                        latitude: 40.7484
                                    },
                                    {
                                        name: 'Salesforce Tower',
                                        startTime: new Date(),
                                        endTime: new Date(),
                                        contactInfo: '925-925-9259',
                                        note: 'Very cozy',
                                        address: '415 Mission St, San Francisco, CA 94105',
                                        longitude: 122.3972,
                                        latitude: 37.7897
                                    },
                                ]
                            }
                        }
                    }))
                },

                comments: {
                    createMany: {
                        data: [
                            {
                                profileId: `${i}`,
                                text: 'This is amazing, thank you for creating this! Looks like a great trip'
                            },
                            {
                                profileId: `${i}`,
                                text: 'Very cool'
                            },
                            {
                                profileId: `${i}`,
                                text: 'This trip sucks bro'
                            },
                            {
                                profileId: `${i}`,
                                text: 'Man this is so terrible. Stay away from any of these places.'
                            }
                        ]
                    }
                }
            }
        })
    }))
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })