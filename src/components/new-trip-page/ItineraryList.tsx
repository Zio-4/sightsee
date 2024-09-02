import { Droppable, Draggable } from 'react-beautiful-dnd'
import { Plane } from 'lucide-react'
import Activity from '../Itinerary/Activity'

interface ItineraryListProps {
  itinerary: any[]
}

export default function ItineraryList({ itinerary }: ItineraryListProps) {
  return (
    <div className="space-y-6">
      {itinerary.map((destination, destIndex) => (
        <div key={destination.destination}>
          <h2 className="text-xl font-semibold mb-4 text-pastel-purple flex items-center">
            <Plane className="h-5 w-5 mr-2" />
            {destination.destination}
          </h2>
          {destination.days.map((day, dayIndex) => (
            <div key={day.date} className="mb-6">
              <h3 className="text-lg font-semibold mb-2 text-pastel-blue">{day.date}</h3>
              <Droppable droppableId={`${destIndex}-${dayIndex}`}>
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
                              destIndex={destIndex}
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
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
