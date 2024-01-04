import React, { useState, useEffect, useRef} from 'react'
import Itinerary from '../../components/Itinerary/Itinerary'
import { prisma } from '../../server/db/client'
import { type GetServerSideProps } from 'next'
import axios from 'axios'
import { useAuth } from '@clerk/nextjs'
import { buildClerkProps } from "@clerk/nextjs/server";
import MapGL from '../../components/MapGL'
import { IItineraryPage } from '../../types/itinerary'
import { useSetAtom } from 'jotai'
import { activityCoordinatesAtom } from '../../atomStore'
import TripLayout from '../../components/Trips/TripLayout'

const TripPage = ({ itin, activityCoordinates }: IItineraryPage) => {
  const [viewState, setViewState] = useState(false)
  const { isSignedIn } = useAuth()
  const setActivityCoordinates = useSetAtom(activityCoordinatesAtom)

  useEffect(() => {
    const connectItineraryToProfile = async () => {
      await axios.put('/api/itinerary/connect', {
        itineraryId: itin.id
      })
    }

    if (!itin.profileId && isSignedIn) {
      connectItineraryToProfile()
    }

  }, [isSignedIn])

  useEffect(() => {
    setActivityCoordinates(activityCoordinates)
  }, [])


  return (
    <>
      <TripLayout 
        viewState={viewState}
        setViewState={setViewState}
        itineraryChild={<Itinerary itin={itin} />}
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


  if (!itineraryData) {
    return {
      redirect: {
        destination: '/trips',
        permanent: false,
      }
    }
  }
  
  let activityCoordinates = []
  
  for (const tripDay of itineraryData.tripDays) {
    for (const activity of tripDay.activities) {
      // In case activity does not have coordinates
      if (activity.longitude) {
        activityCoordinates.push([activity.longitude, activity.latitude])
      }
    }
  }

  return {  
    props: { ...buildClerkProps(ctx.req), itin: JSON.parse(JSON.stringify(itineraryData)), activityCoordinates: activityCoordinates }
  }
  
}