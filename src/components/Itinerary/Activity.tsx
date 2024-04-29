import React, { use, useEffect, useRef, useState } from 'react'
import axios from 'axios';
import { BsTrashFill } from 'react-icons/bs'
import { format } from 'date-fns'
import { IActivityProps } from '../../types/itinerary';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { 
    activitiesAtom,
    debouncRefAtom,
    removeActivity,
    updateActivityAtoms 
} from '../../atomStore';
import useDebounce from '../../hooks/useDebounce';



const Activity = ({ activityId, tripDayId }: { activityId: number, tripDayId: number } ) => {
    const [activities, setActivities] = useAtom(activitiesAtom)
    const activity = activities[activityId.toString()]
    const [timeDropDown, setTimeDropDown] = useState(false)
    const clearedTimeRef = useRef(false)
    const debouncedActivityUpdate = useDebounce(useAtomValue(debouncRefAtom), 500)
    // For activity update
    const setDebounceRef = useSetAtom(debouncRefAtom);

    useEffect(() => {
        const updateActivityCall = async () => {
            if (clearedTimeRef.current) {
                // setDisplayStartTime(`${activity.startTime}`)
                // setDisplayEndTime(`${activity.endTime}`)
                await sendUpdateReq()
                clearedTimeRef.current = false
            }
        }
        updateActivityCall()
    }, [activity])


    const updateActivity = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateActivityAtoms(activityId,  { ...activity, [e.target.name]: e.target.value }, setActivities, setDebounceRef)

        // add network request to update activity
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



  return (
        <div  >
            <div className='flex flex-col'>
                <input 
                    onChange={updateActivity} 
                    name='name' 
                    value={activity?.name} 
                    className='bg-white bg-opacity-40 rounded-md p-1 outline-none w-fit h-fit'
                />

                <div className='bg-white bg-opacity-40 rounded-md p-2 mt-2'>
                    <textarea 
                        value={activity?.note} 
                        name='note' 
                        placeholder='Add notes, links, etc.' 
                        onChange={updateActivity} 
                        className='bg-transparent p-1 focus:ring-0 focus:ring-offset-0 border-0 resize-none mt-2 placeholder-slate-400 w-full' 
                    />
                    
                    <div className='flex justify-between'>
                        <div  className=' bg-sky-200 text-sky-600 rounded-full p-1 w-fit text-xs cursor-pointer relative'>
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

                            {timeDropDown && (
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
                            )}
                            
                        </div>

                        <button title='delete-button' onClick={() => removeActivity(activity!.id, tripDayId, [activity!.longitude, activity!.latitude])}>
                            <BsTrashFill className='bg-red-400 p-1 cursor-pointer rounded-md text-white hover:bg-red-500' size={25}/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default Activity
