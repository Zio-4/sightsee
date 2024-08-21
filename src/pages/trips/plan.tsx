import React, { useState } from 'react'
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';
import { eachDayOfInterval } from 'date-fns'
import { useRouter } from 'next/router';
import LayoutWrapper from '../../components/Layout-Navigation/LayoutWrapper';
import TripPlanForm from '../../components/Trips/TripPlanForm';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

const Plan = () => {
    const [calendarDates, setCalendarDates] = useState([new Date(), new Date()]);
    const [formValues, setFormValues] = useState({
        itineraryName: '',
        destinations: '',
        isPublic: true
    })
    const [submitIsDisabled, setSubmitIsDisabled] = useState(false)
    const router = useRouter();
    const { user } = useUser();

    const handleInput = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.name === 'isPublic') {
            if (event.target.value === 'public') {
                setFormValues({...formValues, [event.target.name]: true});
            } else {
                setFormValues({...formValues, [event.target.name]: false});
            }
        } else {
            setFormValues({...formValues, [event.target.name]: event.target.value});
        }
    }



    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!user) {
            const itineraryCreated = localStorage.getItem('itineraryCreated')
            if (itineraryCreated) {
                toast.error('Only one itinerary can be created per guest.', {
                    duration: 3000,
                    position: 'top-right',
                });
                router.push('/trips')
            } else {
                localStorage.setItem('itineraryCreated', 'true')
            }
        } else if (user) {
            localStorage.removeItem('itineraryCreated')
        }


        if (!formValues.itineraryName.length || !formValues.destinations.length) return

        setSubmitIsDisabled(true)
        
        let endDate = calendarDates[1]!;
        if (!user) {
            const maxDays = 4;
            const maxEndDate = new Date(calendarDates[0]!);
            maxEndDate.setDate(maxEndDate.getDate() + maxDays - 1);
            if (endDate > maxEndDate) {
                endDate = maxEndDate;
            }
        }
        
        const dateArray = eachDayOfInterval({start: calendarDates[0]!, end: endDate});
        
        const itineraryData = {
            itineraryName: formValues.itineraryName,
            startDate: calendarDates[0],
            endDate: endDate,
            days: dateArray,
            destinations: formValues.destinations, 
            isPublic: formValues.isPublic,
        };

    
        try {
            const res = await axios.post('/api/itinerary', itineraryData);
            toast.success('Itinerary created successfully!', {
                duration: 3000,
                position: 'top-right',
            });

            router.push({
                pathname: '/trips/[id]',
                query: { 
                    id: res.data.id
                },
              })
        } catch (error) {
            console.error('Error creating itinerary:', error);
            toast.error('Failed to create itinerary. Please try again.', {
                duration: 3000,
                position: 'top-right',
            });
            setSubmitIsDisabled(false);
            return;
        }
    }


  return (
    <LayoutWrapper>
        <TripPlanForm 
            handleSubmit={handleSubmit} 
            handleInput={handleInput} 
            setCalendarDates={setCalendarDates} 
            calendarDates={calendarDates} 
            submitIsDisabled={submitIsDisabled}/>
    </LayoutWrapper>
  )
}

export default Plan