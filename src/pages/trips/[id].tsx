import React, { useState, useEffect } from 'react'
import Itinerary from '../../components/Itinerary/Itinerary'
import { prisma } from '../../server/db/client'
import { type GetServerSideProps } from 'next'
import axios from 'axios'
import { useAuth } from '@clerk/nextjs'
import { buildClerkProps } from "@clerk/nextjs/server";
import MapGL from '../../components/MapGL'
import { IItineraryPage } from '../../types/itinerary'
import { useSetAtom } from 'jotai'
import { itineraryAtom, activityCoordinatesAtom, tripDaysAtom, activitiesAtom } from '../../atomStore'
import TripLayout from '../../components/Trips/TripLayout'
import { Activity, TripDay } from '../../types/itinerary'
import { ActivityCoordinates } from '../../types/map'

const TripPage = ({ itinerary, tripDays, activities, activityCoordinates }: IItineraryPage) => {
  const [viewState, setViewState] = useState(false)
  const { isSignedIn } = useAuth()
  const setItinerary = useSetAtom(itineraryAtom)
  const setTripDays = useSetAtom(tripDaysAtom)
  const setActivities = useSetAtom(activitiesAtom)
  const setActivityCoordinates = useSetAtom(activityCoordinatesAtom)


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
    setItinerary({ ...itinerary })
    setTripDays({ ...tripDays })
    setActivities({ ...activities })
    setActivityCoordinates(activityCoordinates)
  }, [])

  return (
    <>
      <TripLayout 
        viewState={viewState}
        setViewState={setViewState}
        // itineraryChild={<Itinerary itin={itin} />}
        itineraryChild={<Itinerary />}
        mapChild={<MapGL />}
      />
    </>
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
   * especially when using state management libraries like Jotai.
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
   * Example of data input structure:
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
   * // normalized.itineraries, normalized.tripDays, normalized.activities
   * // will now have structured data separated by entity type.
   */
  const normalizeData = (data) => {
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

    itinerary.tripDays = data.tripDays.map(day => day.id)

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
  

  
  // for (const tripDay of itineraryData.tripDays) {
  //   for (const activity of tripDay.activities) {
  //     // In case activity does not have coordinates
  //     if (activity.longitude) {
  //       activityCoordinates.push([activity.longitude, activity.latitude])
  //     }
  //   }
  // }

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