import { ChevronLeft, ChevronRight, List, Grid, } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { DragDropContext } from 'react-beautiful-dnd'
import ItineraryTabs from '@/components/new-trip-page/ItineraryTabs'
import ItineraryList from '@/components/new-trip-page/ItineraryList'
import TripMap from '@/components/new-trip-page/TripMap'
import MobileViewToggle from '@/components/new-trip-page/MobileViewToggle'

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

export default function TripPage(
  { 
    itinerary, 
    destinations, 
    tripDays, 
    activities, 
    activityCoordinates 
  }:{ 
    itinerary: any, 
    destinations: any, 
    tripDays: any, 
    activities: any, 
    activityCoordinates: any 
  }) {
  const [activeDay, setActiveDay] = useState('Aug 22nd')
  const [viewMode, setViewMode] = useState('daily')

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


  const allDays = itinerary.flatMap(dest => dest.days)

  const onDragEnd = (result) => {
    if (!result.destination) return

    const [destIndex, dayIndex] = result.source.droppableId.split('-').map(Number)
    
    const newItinerary = [...itinerary]
    const [reorderedItem] = newItinerary[destIndex].days[dayIndex].activities.splice(result.source.index, 1)
    newItinerary[destIndex].days[dayIndex].activities.splice(result.destination.index, 0, reorderedItem)

    setItinerary(newItinerary)
    // Here you would typically call an API to update the database
    // updateActivitiesOrderInDatabase(dayId, newItinerary[destIndex].days[dayIndex].activities.map(a => a.id))
  }

  const [isMapVisible, setIsMapVisible] = useState(false)

  return (
    <div className="container mx-auto p-4 min-h-screen border-2 border-white rounded-2xl">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Trip to Thailand</h1>
        <div className="text-sm text-white">Aug 22, 2024 - Aug 24, 2024</div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-white">
          <CardHeader className="flex flex-row items-center justify-between bg-pastel-blue bg-opacity-10">
            <CardTitle className="text-pastel-blue">Itinerary</CardTitle>
            <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value)}>
              <ToggleGroupItem value="daily" aria-label="Daily view" className="data-[state=on]:bg-gray-200 data-[state=on]:text-black">
                <Grid className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="list" aria-label="List view" className="data-[state=on]:bg-gray-200 data-[state=on]:text-black">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={onDragEnd}>
              {viewMode === 'daily' ? (
                <ItineraryTabs allDays={allDays} activeDay={activeDay} setActiveDay={setActiveDay} itinerary={itinerary} />
              ) : (
                <ItineraryList itinerary={itinerary} />
              )}
            </DragDropContext>
          </CardContent>
        </Card>

        <TripMap isVisible={isMapVisible} />
      </div>

      {viewMode === 'daily' && (
        <div className="mt-6 flex justify-between">
          <Button variant="outline" className="bg-white text-pastel-purple border-pastel-purple hover:bg-pastel-purple hover:text-white">
            <ChevronLeft className="mr-2" size={16} />Previous Day
          </Button>
          <Button variant="outline" className="bg-white text-pastel-purple border-pastel-purple hover:bg-pastel-purple hover:text-white">
            Next Day<ChevronRight className="ml-2" size={16} />
          </Button>
        </div>
      )}

      <MobileViewToggle isMapVisible={isMapVisible} setIsMapVisible={setIsMapVisible} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  let itineraryData;

  try {           
    const data = await prisma.itinerary.findUnique({
      where: {
        id: Number(ctx.query.id),
      },
      include: {
        destinations: {
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
   * containing the itinerary, destinations, trip days, and activities, and normalizes it into
   * separate objects. This normalization is useful for state management in React,
   * where updating nested state is difficult.
   * 
   * The function creates four separate objects: itinerary, destinations, tripDays, and activities.
   * Each of these objects is a map, where the key is the entity's ID, and the value
   * is the entity's data.
   * 
   * @param {Object} data - The nested data structure to normalize. It is expected to
   * have a specific format, with an itinerary object that contains destinations, each of
   * which contains tripDays, each of which contains activities.
   * 
   * @returns {Object} An object containing four properties: itinerary, destinations, tripDays,
   * and activities. Each is a normalized map of its respective entities.
   * 
   * @example
   * Input:
   * const data = {
   *   id: 1,
   *   name: 'Sample Itinerary',
   *   destinations: [
   *     {
   *       id: 101,
   *       name: 'Destination 1',
   *       tripDays: [
   *         {
   *           id: 201,
   *           date: '2021-01-01',
   *           activities: [
   *             { id: 301, name: 'Activity 1', longitude: 100.0, latitude: 13.0 },
   *             { id: 302, name: 'Activity 2', longitude: 101.0, latitude: 14.0 }
   *           ]
   *         }
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
   *       destinations: [ 101 ],
   *   },
   *   destinations: {
   *     101: {
   *       id: 101,
   *       name: 'Destination 1',
   *       tripDays: [ 201 ]
   *     }
   *   },
   *   tripDays: {
   *     201: {
   *       id: 201,
   *       date: '2021-01-01',
   *       activities: [ 301, 302 ]
   *     }
   *   },
   *   activities: {
   *     301: {
   *       id: 301,
   *       name: 'Activity 1',
   *       longitude: 100.0,
   *       latitude: 13.0
   *     },
   *     302: {
   *       id: 302,
   *       name: 'Activity 2',
   *       longitude: 101.0,
   *       latitude: 14.0
   *     }
   *   }
   * }
   */
  function normalizeData(data: any) {
    const itinerary = data;
    const destinations: { [key: number]: any } = {};
    const tripDays: { [key: number]: any } = {};
    const activities: { [key: number]: any } = {};

    data.destinations.forEach((destination: any) => {
      destination.tripDays.forEach((day: TripDay) => {
        day.activities.forEach((activity: Activity) => {
          if (activity.longitude) {
            activityCoordinates.push([activity.longitude, activity.latitude] as [number, number]);
          }
          activities[activity.id] = { ...activity };
        });
        tripDays[day.id] = { ...day, activities: day.activities.map(activity => activity.id) };
      });
      destinations[destination.id] = { ...destination, tripDays: destination.tripDays.map((day: TripDay) => day.id) };
    });

    itinerary.destinations = data.destinations.map((destination: any) => destination.id);

    return { itinerary, destinations, tripDays, activities };
  }

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
      itinerary: JSON.parse(JSON.stringify(normalizedData.itinerary)),
      destinations: JSON.parse(JSON.stringify(normalizedData.destinations)),
      tripDays: JSON.parse(JSON.stringify(normalizedData.tripDays)),
      activities: JSON.parse(JSON.stringify(normalizedData.activities)),
      activityCoordinates: activityCoordinates
    }
  }
}
