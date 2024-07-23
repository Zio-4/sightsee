import React, { useRef, useState, useEffect } from 'react'
import axios from 'axios';
import { BsTrashFill } from 'react-icons/bs'
import { format } from 'date-fns'
import useDebounce from '../../hooks/useDebounce';
import useDeepCompareEffect from '../../hooks/useDeepCompareEffect';
import { toast } from 'react-hot-toast';
import { triggerPusherEvent } from '../../lib/pusherEvent';
import DatePicker from 'react-datepicker';
import useItineraryStore from '../../hooks/useItineraryStore';

const Activity = React.memo(({ activityId, tripDayId }: { activityId: number, tripDayId: number } ) => {
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
    })
    const [timeDropDown, setTimeDropDown] = useState(false)
    const clearedTimeRef = useRef(false)
    const debouncedInput = useDebounce(inputActivityState, 500)
    const updateActivityRef = useRef(false)

    useDeepCompareEffect(() => {
        async function sendUpdateReq() {
            try {
                const res = await axios.put('/api/activities', {
                    name: inputActivityState.name,
                    startTime: inputActivityState.startTime,
                    endTime: inputActivityState.endTime,
                    note: inputActivityState.note,
                    activityId: activity.id
                })
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
            sendUpdateReq() 
        }
    }, [debouncedInput])
    
    // This updates the input state when the activity changes from a collaborator
    useEffect(() => {
        setInputActivityState({
          name: activity.name,
          startTime: activity.startTime || null,
          endTime: activity.endTime || null,
          note: activity.note || '',
        });
    }, [activity]);


    const updateActivity = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputActivityState({...inputActivityState, 
                              [e.target.name]: e.target.value})

        // add network request to update activity
        updateActivityRef.current = true
    }

    const sendUpdateReq = async () => {
        let tempStartDate

        if (activity?.startTime.includes('-')) {
            tempStartDate = null
        } else {
            tempStartDate = new Date()
            tempStartDate.setHours(Number(activity?.startTime.substring(0,2)))
            tempStartDate.setMinutes(Number(activity?.startTime.substring(3,5)))
        }

        let tempEndDate

        if (activity?.startTime.includes('-')) {
            tempEndDate = null
        } else {
            tempEndDate = new Date()
            tempEndDate.setHours(Number(activity?.endTime.substring(0,2)))
            tempEndDate.setMinutes(Number(activity?.endTime.substring(3,5)))
        }

        await axios.put('/api/activities', {
            name: activity?.name,
            startTime: tempStartDate,
            endTime: tempEndDate,
            contactInfo: activity?.contactInfo,
            note: activity?.note,
            activityId: activity?.id
        })
    }



    const getActualTime = (timeState: string) => {
        if (timeState.includes('-')) {
            return null
        }

        const hours = Number(timeState.substring(0,2))
        let time = timeState


        if (hours >= 13) {
            time = `${Math.abs(hours - 12)}:${timeState.substring(3,5)} PM`
        } else if (hours === 12) {
            time = `12:${timeState.substring(3,5)} PM`
        } else if (hours === 0) {
            time = `12:${timeState.substring(3,5)} AM`
        } else {
            time = time + ' AM'
        }

        return time
    }

    const clearTime = () => {
        setTimeDropDown(prev => !prev)
        // setactivity({...activity, 'startTime': '--:-- --', 'endTime': '--:-- --'})
        clearedTimeRef.current = true
    }

    const saveTime = async () => {
        setTimeDropDown(prev => !prev)
        // setDisplayStartTime(activity.startTime)
        // setDisplayEndTime(activity.endTime)
        await sendUpdateReq()
    }

    const getFormattedTime = (time: string | null | undefined) => {
        if (time) {
            return format(new Date(time), 'hh:mm a')
        }

        return '--:-- --'
    }

    const removeActivity = async (activityId: number, tripDayId: number, activityCoordinates: [number | undefined, number | undefined]): Promise<void> => {
        try {
            const res = await axios.delete('/api/activities', { 
                data: { activityId: activityId } 
             })

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
        <div  >
            <div className='flex flex-col'>
                <div className='flex justify-between'>
                    {/* <input 
                        onChange={updateActivity} 
                        name='name' 
                        value={inputActivityState?.name} 
                        className='bg-white bg-opacity-40 rounded-md p-1 outline-none w-full h-fit mr-2'
                    /> */}
                    <p className='bg-white bg-opacity-40 rounded-md p-1 outline-none w-full h-fit mr-2'>{inputActivityState?.name}</p>
                    
                    <BsTrashFill
                        onClick={() => removeActivity(activity.id, tripDayId, [activity?.longitude, activity?.latitude])} 
                        className='bg-red-400 p-1 m-auto cursor-pointer rounded-md text-white hover:bg-red-500' 
                        size={38}
                    />
                </div>

                <div className='bg-white bg-opacity-40 rounded-md p-2 mt-2'>
                    <textarea 
                        value={inputActivityState?.note} 
                        name='note' 
                        placeholder='Add notes, links, etc.' 
                        onChange={updateActivity} 
                        className='bg-transparent p-1 focus:ring-0 focus:ring-offset-0 border-0 resize-none mt-2 placeholder-slate-400 w-full' 
                    />
                    
                    <div className='flex justify-between'>
                         {/* className=' bg-sky-200 text-sky-600 rounded-full p-1 w-fit text-xs cursor-pointer relative' */}
                        <div  >
                            {/* {displayStartTime.includes('-') ? (
                                <div onClick={() => setTimeDropDown(prev => !prev)}>
                                    <p className='px-2'>Add time</p>
                                </div>
                                ) : (
                                <div onClick={() => setTimeDropDown(prev => !prev)} className='flex items-center'>
                                    <p>{getActualTime(displayStartTime)}</p>

                                    {activity?.endTime.includes('-') ? null : <p className='mx-1'>-</p>}

                                    <p>{getActualTime(displayEndTime)}</p>
                                </div>
                            )} */}

                            {/* {timeDropDown && (
                                <div className='absolute top-10 bg-slate-400 p-3 rounded-lg z-10'>
                                    <div className='flex'>
                                        <input 
                                            value={activity?.startTime} 
                                            onChange={updateActivity} 
                                            type='time' 
                                            name='startTime' 
                                            className='rounded-md border-0'
                                        />
                                        <p>-</p>
                                        <input 
                                            value={activity?.endTime} 
                                            onChange={updateActivity} 
                                            type='time' 
                                            name='endTime' 
                                            className='rounded-md border-0'
                                        />
                                    </div>

                                    <div className='flex justify-around mt-4 text-lg'>
                                        <button onClick={clearTime} className='rounded-lg px-6 py-1 bg-orange-300 text-white hover:bg-orange-500'>Clear</button>
                                        <button onClick={saveTime} className='rounded-lg px-6 py-1 bg-green-300 text-white hover:bg-green-500'>Save</button>
                                    </div>
                                </div>
                            )} */}


                            {/* {activity?.startTime && (
                                <DatePicker
                                    selected={new Date(activity.startTime)}
                                    onChange={(date) => updateActivity(date)}
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                />
                            )}
                            
                            {activity?.endTime && (
                                <div>
                                    <p>-</p>
                                    <DatePicker
                                        selected={new Date(activity.endTime)}
                                        onChange={(date) => updateActivity(date)}
                                        showTimeSelect
                                        showTimeSelectOnly
                                        timeIntervals={15}
                                        timeCaption="Time"
                                        dateFormat="h:mm aa"
                                    />
                                </div>
                            )} */}
                        </div>

                        {/* <button title='delete-button' onClick={() => removeActivity(activity!.id, tripDayId, [activity!.longitude, activity!.latitude])}>
                            <BsTrashFill className='bg-red-400 p-1 cursor-pointer rounded-md text-white hover:bg-red-500' size={25}/>
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
  )
})

export default Activity
