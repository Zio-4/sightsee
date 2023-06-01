import React, { useState, useEffect, useRef} from 'react'
import Itinerary from '../../components/Itinerary/Itinerary'
import { prisma } from '../../server/db/client'
import { type GetServerSideProps } from 'next'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { SlNote } from 'react-icons/sl'
import axios from 'axios'
import { useAuth } from '@clerk/nextjs'
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import MapGL from '../../components/MapGL'
import { IItineraryPage } from '../../types/itinerary'
import { useSetAtom } from 'jotai'
import { activityCoordinatesAtom } from '../../atomStore'

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
    <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'>
      <div className={`${viewState && 'hidden'} lg:block 2xl:col-start-1 2xl:col-end-1 shadow-lg shadow-gray-600 z-[998]`}>
        <Itinerary itin={itin} />
      </div>
      <div className={`${!viewState && 'hidden'} lg:block 2xl:col-start-2 2xl:col-end-4`}>
        <MapGL />
      </div>

      <button onClick={() => setViewState((prev) => !prev)} className='lg:hidden z-[1000] fixed bottom-4 right-4 p-3 text-sm transition-colors duration-300 rounded-full shadow-xl text-violet-100 bg-violet-500 hover:bg-violet-600 shadow-violet-500'>{viewState ? <SlNote size={27}/> : <FaMapMarkedAlt size={27} />}</button>
    </div>
    </>
  )
}

TripPage.tripPage = true

export default TripPage


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  // Check that itinerary profileId matches the user id
  // OR that ip address matches
 
  let itineraryData;

  console.log('ctx query id: ', ctx.query.id)

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