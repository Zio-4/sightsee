import React, { useState, useEffect } from 'react'
import ViewItinerary from '../../components/View/ViewItinerary'
import { prisma } from '../../server/db/client'
import { type GetServerSideProps } from 'next'
import { buildClerkProps } from "@clerk/nextjs/server";
import { IItineraryPage } from '../../types/itinerary'
import { useSetAtom } from 'jotai'
import { activityCoordinatesAtom } from '../../atomStore'
import MapGL from '../../components/MapGL'
import TripLayout from '../../components/Trips/TripLayout'

const ItineraryPage = ({ itin, activityCoordinates }: IItineraryPage) => {
    const [viewState, setViewState] = useState(false)
    const setActivityCoordinates = useSetAtom(activityCoordinatesAtom)

    useEffect(() => {
      setActivityCoordinates(activityCoordinates)
    }, [])

    return (
      <TripLayout 
        viewState={viewState}
        setViewState={setViewState}
        itineraryChild={<ViewItinerary itin={itin} />}
        mapChild={<MapGL />}
      />
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