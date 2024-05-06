import React, { useState, useEffect, } from 'react'
import Itinerary from '../../components/Itinerary/Itinerary'
import { prisma } from '../../server/db/client'
import { type GetServerSideProps } from 'next'
import axios from 'axios'
import { useAuth } from '@clerk/nextjs'
import { buildClerkProps } from "@clerk/nextjs/server";
import MapGL from '../../components/MapGL'
import { IItineraryPage } from '../../types/itinerary'
import TripLayout from '../../components/Trips/TripLayout'
import { Activity, TripDay } from '../../types/itinerary'
import { ActivityCoordinates } from '../../types/map'
import pusherInstance from '../../lib/pusher'
import { handlePusherMessage } from '../../lib/handlePusherMessage'
import { useItineraryContext } from '../../hooks/useItineraryContext'

const TripPage = ({ itinerary, tripDays, activities, activityCoordinates }: IItineraryPage) => {
  const [viewState, setViewState] = useState(false)
  const { isSignedIn } = useAuth()
  const { dispatch } = useItineraryContext()


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
    dispatch({
      type: 'SET_ITINERARY',
      payload: {
        itinerary,
        tripDays,
        activities,
        activityCoordinates
      }
    })
  }, [])

  useEffect(() => {
    // check if itinerary is a collaboration
    // TODO: use itinerary atom to access property?
    let channel: any

    // This is handling messages sent from the server
    // i.e. other users updating the itinerary
    if (itinerary.collaborationId) {
      const channelName = `itinerary-${itinerary.id}`      
      channel = pusherInstance.subscribe(channelName);

      console.log('subscribed to channel:', channelName)

      channel.bind('itinerary-event-name', function(msg: any) {
        // If it's the same user, we don't need to do anything
        console.log('received message: ', msg)
        
        if (msg.userId === itinerary.profileId) return
        
        handlePusherMessage(msg)
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
  // const { userId } = getAuth(ctx.req);

  // Check that itinerary profileId matches the user id
  // OR that ip address matches
 
  let itineraryData;

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