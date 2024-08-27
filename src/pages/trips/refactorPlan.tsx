import React, { useState } from 'react'
import axios from 'axios';
import { eachDayOfInterval } from 'date-fns'
import { useRouter } from 'next/router';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Info, Plus, X } from "lucide-react"

interface Destination {
  location: string;
  days: number;
}

type TravelCompanion = 'Solo' | 'Family' | 'Friends'

export default function Component() {
  const [tripName, setTripName] = useState('')
  const [destinations, setDestinations] = useState<Destination[]>([{ location: '', days: 1 }])
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [useAI, setUseAI] = useState(true)
  const [isPublic, setIsPublic] = useState(false)
  const [numTravelers, setNumTravelers] = useState(1)
  const [travelCompanion, setTravelCompanion] = useState<TravelCompanion>('Solo')
  const [interests, setInterests] = useState('')
  const [submitIsDisabled, setSubmitIsDisabled] = useState(false)

  const router = useRouter();
  const { user } = useUser();

  const addDestination = () => {
    setDestinations([...destinations, { location: '', days: 1 }])
  }

  const removeDestination = (index: number) => {
    const newDestinations = destinations.filter((_, i) => i !== index)
    setDestinations(newDestinations)
  }

  const updateDestination = (index: number, field: keyof Destination, value: string | number) => {
    const newDestinations = destinations.map((dest, i) => {
      if (i === index) {
        return { ...dest, [field]: value }
      }
      return dest
    })
    setDestinations(newDestinations)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!user) {
      const itineraryCreated = localStorage.getItem('itineraryCreated')
      if (itineraryCreated) {
        toast.error('Only one itinerary can be created per guest.', {
          duration: 3000,
          position: 'top-right',
        });
        router.push('/trips')
        return;
      } else {
        localStorage.setItem('itineraryCreated', 'true')
      }
    } else if (user) {
      localStorage.removeItem('itineraryCreated')
    }

    if (!tripName || !startDate || !endDate || destinations.some(d => !d.location)) return

    setSubmitIsDisabled(true)

    let finalEndDate = endDate;
    if (!user) {
      const maxDays = 4;
      const maxEndDate = new Date(startDate);
      maxEndDate.setDate(maxEndDate.getDate() + maxDays - 1);
      if (finalEndDate > maxEndDate) {
        finalEndDate = maxEndDate;
      }
    }

    const dateArray = eachDayOfInterval({start: startDate, end: finalEndDate});

    const itineraryData = {
      itineraryName: tripName,
      startDate: startDate,
      endDate: finalEndDate,
      days: dateArray,
      destinations: destinations,
      isPublic: isPublic,
      useAI: useAI,
      numTravelers: numTravelers,
      travelCompanion: travelCompanion,
      interests: interests
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
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Plan Your Trip</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tripName">Trip Name</Label>
          <Input 
            id="tripName" 
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            placeholder="Enter your trip name" 
            required 
          />
        </div>
        
        <div className="space-y-4">
          <Label>Destinations</Label>
          {destinations.map((dest, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder="Enter destination"
                value={dest.location}
                onChange={(e) => updateDestination(index, 'location', e.target.value)}
                required
              />
              <Input
                type="number"
                min="1"
                value={dest.days}
                onChange={(e) => updateDestination(index, 'days', parseInt(e.target.value))}
                className="w-20"
                required
              />
              <Label htmlFor={`days-${index}`} className="sr-only">Days</Label>
              <span className="text-sm text-muted-foreground">days</span>
              {destinations.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeDestination(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove destination</span>
                </Button>
              )}
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addDestination}>
            <Plus className="h-4 w-4 mr-2" />
            Add Destination
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  disabled={(date) => 
                    date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                    (startDate ? date < startDate : false)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="numTravelers">Number of Travelers</Label>
          <Input
            id="numTravelers"
            type="number"
            min="1"
            value={numTravelers}
            onChange={(e) => setNumTravelers(parseInt(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Who are you traveling with?</Label>
          <RadioGroup value={travelCompanion} onValueChange={(value: TravelCompanion) => setTravelCompanion(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Solo" id="solo" />
              <Label htmlFor="solo">Solo</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Family" id="family" />
              <Label htmlFor="family">Family</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Friends" id="friends" />
              <Label htmlFor="friends">Friends</Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interests">Interests (Optional)</Label>
          <Textarea
            id="interests"
            placeholder="Enter activities you and/or your travel companions typically enjoy while traveling. Ex. Food, Hiking, Museums, etc."
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
        </div>
        
        <div className="bg-primary/10 p-6 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="useAI" className="text-lg font-semibold">Use AI to generate activities</Label>
            <Switch 
              id="useAI" 
              checked={useAI} 
              onCheckedChange={setUseAI}
            />
          </div>
          {useAI && (
            <p className="text-muted-foreground">
              Our AI will analyze your destinations, dates, and interests to suggest the best activities and create an optimized itinerary for your trip.
            </p>
          )}
        </div>
        
        <div className="border border-muted p-6 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="isPublic" className="text-lg font-semibold">Make itinerary public</Label>
            <Switch 
              id="isPublic" 
              checked={isPublic} 
              onCheckedChange={setIsPublic}
            />
          </div>
          <div className="flex items-start space-x-2 text-muted-foreground">
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Public itineraries will only be shown on the discover page after you have completed your trip, ensuring your safety during travel.
            </p>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={submitIsDisabled}>Create Trip Plan</Button>
      </form>
    </div>
  )
}