import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Plane } from 'lucide-react'
import Activity from '../Itinerary/Activity'
import dynamic from 'next/dynamic'
import useItineraryStore from '../../hooks/useItineraryStore'
import { format } from "date-fns"

const ActivityForm = dynamic(() => import('../Itinerary/ActivityForm'), { ssr: false })

interface ItineraryListProps {
  destinations: any
}

export default function ItineraryList({ destinations }: ItineraryListProps) {
  const tripDays = useItineraryStore(state => state.tripDays)

  return (
    <div className="space-y-6">
      {Object.values(destinations).map((destination: any) => (
        <div key={destination.id}>
          <h2 className="text-xl font-semibold mb-4 text-pastel-purple flex items-center">
            <Plane className="h-5 w-5 mr-2" />
            {destination.name}
          </h2>
          {destination.tripDays.map((dayId: number) => {
            const day = tripDays[dayId];
            return (
              <div key={dayId} className="mb-6">
                <h3 className="text-lg font-semibold mb-2 text-pastel-blue">
                  {format(new Date(day.date), 'MMM do, yyyy')}
                </h3>
                <Droppable droppableId={`${destination.id}-${dayId}`}>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                      {day.activities.map((activityId: number, index: number) => (
                        <Draggable key={activityId} draggableId={activityId.toString()} index={index}>
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Activity
                                activityId={activityId}
                                tripDayId={dayId}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
                <ActivityForm tripDayId={day.id} destination={destination.name} />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  )
}
