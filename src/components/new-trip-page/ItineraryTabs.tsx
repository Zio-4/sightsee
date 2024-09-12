import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Plane } from 'lucide-react'
import Activity from "../Itinerary/Activity"
import useItineraryStore from '../../hooks/useItineraryStore'
import { format } from "date-fns"
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
const ActivityForm = dynamic(() => import('../Itinerary/ActivityForm'), { ssr: false })

interface ItineraryTabsProps {
  allDays: any[]
  activeDay: string
  setActiveDay: (day: string) => void
  destinations: any
}

export default function ItineraryTabs({ allDays, activeDay, setActiveDay, destinations }: ItineraryTabsProps) {
  const tripDays = useItineraryStore(state => state.tripDays)

  // console.log('tripDays:', tripDays)
  // console.log('destinations:', destinations)

  useEffect(() => {
    if (allDays.length > 0) {
      setActiveDay(allDays[0].date)
    }
  }, [])

  return (
    <Tabs value={activeDay} onValueChange={setActiveDay}>
      <TabsList className="grid w-full grid-cols-3">
        {allDays.map((day) => (
          <TabsTrigger key={day.id} value={day.date} className="data-[state=active]:bg-gray-300 data-[state=active]:text-black">
            {format(new Date(day.date), 'MMM do')}
          </TabsTrigger>
        ))}
      </TabsList>
      {allDays.map((day) => (
        <TabsContent key={day.id} value={day.date}>
          <div className="mb-4">
            <Badge variant="outline" className="bg-pastel-purple bg-opacity-10 text-pastel-purple">
              <Plane className="h-4 w-4 mr-2" />
              {destinations[day.destinationId]?.name}
            </Badge>
          </div>
          <Droppable droppableId={`${day.destinationId}-${day.id}`}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {tripDays[day.id]?.activities.map((activityId: string, index: number) => (
                  <Draggable key={activityId} draggableId={activityId.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Activity
                          activityId={parseInt(activityId)}
                          tripDayId={day.id}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <ActivityForm tripDayId={day.id} />
        </TabsContent>
      ))}
    </Tabs>
  )
}
