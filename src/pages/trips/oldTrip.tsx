import React, { useState, useEffect, useContext } from 'react'
import Itinerary from '../../components/Itinerary/Itinerary'
import { prisma } from '../../server/db/client'
import { type GetServerSideProps } from 'next'
import axios from 'axios'
import { useAuth } from '@clerk/nextjs'
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import MapGL from '../../components/MapGL'
import { IItineraryPage } from '../../types/itinerary'
import TripLayout from '../../components/Trips/TripLayout'
import { Activity, TripDay } from '../../types/itinerary'
import { ActivityCoordinates } from '../../types/map'
import pusherInstance from '../../lib/pusher'
import { handlePusherMessage } from '../../lib/handlePusherMessage'
import useItineraryStore from '../../hooks/useItineraryStore'
import { type Channel } from 'pusher-js'
import useInviteStore from '../../hooks/useInviteStore'
import toast from 'react-hot-toast'

const TripPage = ({ itinerary, tripDays, activities, activityCoordinates }: IItineraryPage) => {
  const [viewState, setViewState] = useState(false)
  const { isSignedIn, userId } = useAuth()

  const setItinerary = useItineraryStore(state => state.setItinerary)
  const setTripDays = useItineraryStore(state => state.setTripDays)
  const setActivities = useItineraryStore(state => state.setActivities)
  const addActivity = useItineraryStore(state => state.addActivity)
  const updateActivity = useItineraryStore(state => state.updateActivity)
  const deleteActivity = useItineraryStore(state => state.deleteActivity)
  const joinedTrip = useInviteStore(state => state.joinedTrip)
  const setJoinedTrip = useInviteStore(state => state.setJoinedTrip)

  setItinerary(itinerary)
  setTripDays(tripDays)
  setActivities(activities)

  useEffect(() => {
    if (joinedTrip) {
      toast.success('You have joined the trip!', {
        duration: 3000,
        position: 'top-right',
        icon: '🎉',
        id: 'joinedTrip'
      })
    }

    return () => {
      setJoinedTrip(false)
    }
  }, [joinedTrip])

  useEffect(() => {
    const connectItineraryToProfile = async () => {
      await axios.put('/api/itinerary/connect', {
        itineraryId: itinerary.id
      })
    }

    if (!itinerary.profileId && isSignedIn) {
      connectItineraryToProfile()
    }

  }, [isSignedIn])


  useEffect(() => {
    // check if itinerary is a collaboration
    let channel: Channel
    // This is handling messages sent from the server
    // i.e. other users updating the itinerary
    if (itinerary.collaborationId) {
      const channelName = `itinerary-${itinerary.id}`      
      channel = pusherInstance.subscribe(channelName);

      console.log('subscribed to channel:', channelName)

      channel.bind('itinerary-event-name', function(msg: any) {
        // If it's the same user that sent the message, we don't need to do anything
        if (msg.userId === userId) return
        // Update the UI for collaborators with the new data
        handlePusherMessage({msg, addActivity, updateActivity, deleteActivity})
      });
    }

    return () => {
      if (channel) {
        channel.unbind_all();
        channel.unsubscribe();
      }
    };
  }, [])


  return (
      <TripLayout 
        viewState={viewState}
        setViewState={setViewState}
        itineraryChild={<Itinerary />}
        mapChild={<MapGL />}
      />
  )
}

TripPage.tripPage = true

export default TripPage


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  // Check that itinerary profileId matches the user id
  // OR that ip address matches
 
  let itineraryData;

  // TODO: Rewrite this to use the new Destination model
  // Check if the current user created the itinerary or is a collaborator. If not, then use guest view.
  try {           
    const data = await prisma.itinerary.findUnique({
      where: {
        id: Number(ctx.query.id),
      },
      include: {
        tripDays: {
          include: {
            activities: {
              orderBy: {
                startTime: 'asc'
              }
            }
          }
        },
      }
    });

    itineraryData = data;

  } catch (e) {
    console.error(e);
  }

  // if (itineraryData?.id === 9 && userId) {
  //   // create collaboration for itinerary
  //   const res = await prisma.collaboration.create({
  //     data: {
  //       itinerary: {
  //         connect: { id: itineraryData.id }
  //       },
  //       profile: {
  //         connect: { clerkId: userId }
  //       }
  //     }
  //   })

  //   console.log('collaboration created:', res)
  // }

  // if (userId === "user_2TjSbqnncruvYerUH6m42cyviQv") {
  //   // link user to collaboration
  //   const res = await prisma.collaboration.update({
  //     where: {
  //       itineraryId: itineraryData?.id
  //     },
  //     data: {
  //       profile: {
  //         connect: { clerkId: userId }
  //       }
  //     }
  //   })

  //   console.log('collaboration linked:', res)
  // }


  let activityCoordinates: ActivityCoordinates[] = []


  /**
   * Normalizes nested itinerary data into separate entities.
   * 
   * This function takes the nested data structure fetched from the server,
   * containing the itinerary, trip days, and activities, and normalizes it into
   * separate objects. This normalization is useful for state management in React,
   * where updating nested state is difficult.
   * 
   * The function creates three separate objects: itineraries, tripDays, and activities.
   * Each of these objects is a map, where the key is the entity's ID, and the value
   * is the entity's data.
   * 
   * @param {Object} data - The nested data structure to normalize. It is expected to
   * have a specific format, with an itinerary object that contains tripDays, each of
   * which contains activities.
   * 
   * @returns {Object} An object containing three properties: itinerary, tripDays,
   * and activities. Each is a normalized map of its respective entities.
   * 
   * @example
   * Input:
   * const data = {
   *   id: 1,
   *   name: 'Sample Itinerary',
   *   tripDays: [
   *     {
   *       id: 101,
   *       date: '2021-01-01',
   *       activities: [
   *         { id: 201, name: 'Activity 1',  ... other activity properties  },
   *         { id: 202, name: 'Activity 2', ... other activity properties }
   *       ]
   *     }
   *   ]
   * };
   * 
   * const normalized = normalizeData(data);
   * 
   * Output:
   * {
   *   itinerary: {
   *       id: 1,
   *       name: 'Sample Itinerary',
   *       tripDays: [ 101, 102, 103, ... ],
   *   },
   *   tripDays: {
   *     101: {
   *       id: 101,
   *       date: '2021-01-01',
   *       activities: [ 201, 202, 203, ... ]
   *     }
   *   },
   *   activities: {
   *     201: {
   *       id: 201,
   *       name: 'Activity 1',
   *       ... other activity properties
   *     },
   *     202: {
   *       id: 202,
   *       name: 'Activity 2',
   *       ... other activity properties
   *     }
   *   }
   * }
   */

  // TODO: Rethink how to group tripdays with their destinations
  const normalizeData = (data: any) => {
    const itinerary = data;
    const tripDays = {};
    const activities = {};

    data.tripDays.forEach((day: TripDay) => {
      day.activities.forEach((activity: Activity) => {
        if (activity.longitude) {
          //@ts-ignore
          activityCoordinates.push([activity.longitude, activity.latitude])
        }
        // @ts-ignore
        activities[activity.id] = { ...activity };
      });  
      
      // @ts-ignore
      tripDays[day.id] = { ...day, activities: day.activities.map(activity => activity.id) };
    });

    itinerary.tripDays = data.tripDays.map((day: TripDay) => day.id)

    return { itinerary, tripDays, activities };
  };

  const normalizedData = normalizeData(itineraryData);


  if (!itineraryData) {
    return {
      redirect: {
        destination: '/trips',
        permanent: false,
      }
    }
  }


  return {  
    props: { 
      ...buildClerkProps(ctx.req), 
      // itin: JSON.parse(JSON.stringify(itineraryData)), 
      itinerary: JSON.parse(JSON.stringify(normalizedData.itinerary)),
      tripDays: JSON.parse(JSON.stringify(normalizedData.tripDays)),
      activities: JSON.parse(JSON.stringify(normalizedData.activities)),
      activityCoordinates: activityCoordinates
    }
  }
  
}