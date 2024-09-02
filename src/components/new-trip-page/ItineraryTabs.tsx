import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Plane } from 'lucide-react'
import Activity from "../Itinerary/Activity"

interface ItineraryTabsProps {
  allDays: any[]
  activeDay: string
  setActiveDay: (day: string) => void
  itinerary: any[]
}

export default function ItineraryTabs({ allDays, activeDay, setActiveDay, itinerary }: ItineraryTabsProps) {
  return (
    <Tabs defaultValue={activeDay} onValueChange={setActiveDay}>
      <TabsList className="grid w-full grid-cols-3">
        {allDays.map((day) => (
          <TabsTrigger key={day.date} value={day.date} className="data-[state=active]:bg-gray-300 data-[state=active]:text-black">
            {day.date}
          </TabsTrigger>
        ))}
      </TabsList>
      {allDays.map((day, dayIndex) => (
        <TabsContent key={day.date} value={day.date}>
          <div className="mb-4">
            <Badge variant="outline" className="bg-pastel-purple bg-opacity-10 text-pastel-purple">
              <Plane className="h-4 w-4 mr-2" />
              {itinerary.find(dest => dest.days.some(d => d.date === day.date))?.destination}
            </Badge>
          </div>
          <Droppable droppableId={`${itinerary.findIndex(dest => dest.days.some(d => d.date === day.date))}-${dayIndex}`}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {day.activities.map((activity, activityIndex) => (
                  <Draggable key={activity.id} draggableId={activity.id} index={activityIndex}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <Activity
                          activity={activity}
                          destIndex={itinerary.findIndex(dest => dest.days.some(d => d.date === day.date))}
                          dayIndex={dayIndex}
                          activityIndex={activityIndex}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </TabsContent>
      ))}
    </Tabs>
  )
}
