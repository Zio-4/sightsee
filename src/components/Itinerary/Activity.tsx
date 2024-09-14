import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios'
import { BsTrashFill } from 'react-icons/bs'
import { format, isValid, parse } from 'date-fns'
import useDebounce from '../../hooks/useDebounce'
import useDeepCompareEffect from '../../hooks/useDeepCompareEffect'
import { toast } from 'react-hot-toast'
import { triggerPusherEvent } from '../../lib/pusherEvent'
import useItineraryStore from '../../hooks/useItineraryStore'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Clock, DollarSign, StickyNote, MapPin, Trash2 } from 'lucide-react'

interface TimeInputProps {
  value: Date
  onChange: (date: Date) => void
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(format(value, 'HH:mm'))

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    const parsedDate = parse(newValue, 'HH:mm', new Date())
    if (isValid(parsedDate)) {
      onChange(parsedDate)
    }
  }

  return (
    <Input
      type="time"
      value={inputValue}
      onChange={handleChange}
      className="w-26 h-8 text-sm"
    />
  )
}

const Activity = React.memo(({ activityId, tripDayId }: { activityId: number, tripDayId: number }) => {
  const activities = useItineraryStore(state => state.activities)
  const activity = activities[activityId]
  const updateActivityInStore = useItineraryStore(state => state.updateActivity)
  const deleteActivity = useItineraryStore(state => state.deleteActivity)
  const itinerary = useItineraryStore(state => state.itinerary)
  const [inputActivityState, setInputActivityState] = useState({
    name: activity!.name,
    startTime: activity!.startTime || null,
    endTime: activity!.endTime || null,
    note: activity!.note || '',
    cost: activity!.cost || 0,
  })
  const debouncedInput = useDebounce(inputActivityState, 500)
  const updateActivityRef = useRef(false)

  useDeepCompareEffect(() => {
    async function sendUpdateReq() {
      try {
        console.log('input state COST:', inputActivityState.cost)

        const res = await axios.put('/api/activities', {
          name: inputActivityState.name,
          startTime: inputActivityState.startTime,
          endTime: inputActivityState.endTime,
          note: inputActivityState.note,
          cost: inputActivityState.cost,
          activityId: activity.id
        })

        console.log('activity udpate res:', res)

        updateActivityRef.current = false

        updateActivityInStore(activityId, res.data)

        if (res && itinerary.collaborationId) {
          await triggerPusherEvent(`itinerary-${itinerary.id}`, 'itinerary-event-name', {
            ...res.data,
            entity: 'activity',
            action: 'update'
          })
        }
      } catch (error) {
        console.error(error)
        toast.error(`There was a problem updating the activity: ${inputActivityState.name}`)
      } 
    }

    if (updateActivityRef.current) {
      console.log('update req sent')
      sendUpdateReq()
    }
  }, [debouncedInput])
  
  // Update the state for collaborators
  useEffect(() => {
    setInputActivityState({
      name: activity.name,
      startTime: activity.startTime || null,
      endTime: activity.endTime || null,
      note: activity.note || '',
      cost: activity.cost || 0,
    })
  }, [activity])

  const updateActivity = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInputActivityState(prevState => ({
      ...prevState,
      [name]: name === 'cost' ? parseFloat(value) || 0 : value
    }))
    updateActivityRef.current = true
  }

  const removeActivity = async (activityId: number, tripDayId: number): Promise<void> => {
    try {
      const res = await axios.delete('/api/activities', { data: { activityId: activityId } })
      deleteActivity(activityId, tripDayId)

      if (res && itinerary.collaborationId) {
        await triggerPusherEvent(`itinerary-${itinerary.id}`, 'itinerary-event-name', {
          ...res.data,
          id: activityId,
          tripDayId: tripDayId,
          entity: 'activity',
          action: 'delete'
        })
      }
    } catch (error) {
      console.error(error)
      toast.error(`There was a problem deleting the activity: ${inputActivityState.name}. Try again`)
    }
  }

  return (
    <Card className="border-pastel-purple">
      <CardHeader className="bg-pastel-purple bg-opacity-10">
        <div className="flex justify-between w-full">
          <CardTitle>{inputActivityState.name}</CardTitle>
          <Trash2
            onClick={() => removeActivity(activity.id, tripDayId)}
            className="bg-white p-1 rounded-md text-black hover:bg-gray-300 hover:text-black"
            size={36}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="flex items-center mb-2">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          <TimeInput
            value={new Date(inputActivityState.startTime)}
            onChange={(newTime) => updateActivity({ target: { name: 'startTime', value: newTime.toISOString() } } as unknown as React.ChangeEvent<HTMLInputElement>)}
          />
        </div>
        <p className="text-sm text-muted-foreground mb-2">
          <MapPin className="inline mr-2" size={16} />{activity.address}
        </p>
        <div className="flex items-center">
          <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input
            type="number"
            name="cost"
            value={inputActivityState.cost}
            onChange={updateActivity}
            className="w-24 h-8 text-sm"
          />
        </div>
        <p className='mt-2'>
          {inputActivityState.note}
        </p>
      </CardContent>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="text-pastel-purple border-pastel-purple hover:border-black">
              <StickyNote className="h-4 w-4 mr-2" />
              {inputActivityState.note ? 'Edit Note' : 'Add Note'}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{inputActivityState.name} - Notes</DialogTitle>
            </DialogHeader>
            <Textarea
              placeholder="Add your notes here..."
              value={inputActivityState.note || ''}
              onChange={(e) => updateActivity({ target: { name: 'note', value: e.target.value } } as React.ChangeEvent<HTMLTextAreaElement>)}
              rows={5}
            />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
})

export default Activity
