import React, { useState, useEffect } from 'react'
import ViewItinerary from '../../components/View/ViewItinerary'
import { prisma } from '../../server/db/client'
import { type GetServerSideProps } from 'next'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { SlNote } from 'react-icons/sl'
import { buildClerkProps } from "@clerk/nextjs/server";
import { IItineraryPage } from '../../types/itinerary'
import { useSetAtom } from 'jotai'
import { activityCoordinatesAtom } from '../../atomStore'
import MapGL from '../../components/MapGL'

const ItineraryPage = ({ itin, activityCoordinates }: IItineraryPage) => {
    const [viewState, setViewState] = useState(false)
    const setActivityCoordinates = useSetAtom(activityCoordinatesAtom)

    useEffect(() => {
      setActivityCoordinates(activityCoordinates)
    }, [])

    return (
      <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'>
        <div className={`${viewState && 'hidden'} lg:block 2xl:col-start-1 2xl:col-end-1 shadow-lg shadow-gray-600 z-[999]`}>
          <ViewItinerary itin={itin} />
        </div>
        <div className={`${!viewState && 'hidden'} lg:block 2xl:col-start-2 2xl:col-end-4`}>
          {/* Map goes here */}
          <MapGL />
        </div>
  
        <button onClick={() => setViewState((prev) => !prev)} className='lg:hidden z-[1000] fixed bottom-4 right-4 p-3 text-sm transition-colors duration-300 rounded-full shadow-xl text-violet-100 bg-violet-500 hover:bg-violet-600 shadow-violet-500'>{viewState ? <SlNote size={27}/> : <FaMapMarkedAlt size={27} />}</button>
      </div>
    )
}

export default ItineraryPage

export const getServerSideProps: GetServerSideProps = async (ctx) => {
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
          }
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

    // return { 
    //   props: JSON.parse(JSON.stringify(itineraryData))
    // }

  }