import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, eachDayOfInterval } from "date-fns"
import { Calendar as CalendarIcon, Info } from "lucide-react"
import axios from 'axios'
import { useRouter } from 'next/router'
import { useUser } from '@clerk/nextjs'
import { toast } from 'react-hot-toast'
import LayoutWrapper from '../../components/Layout-Navigation/LayoutWrapper'

export default function PlanTrip() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [useAI, setUseAI] = useState(true)
  const [isPublic, setIsPublic] = useState(true)
  const [itineraryName, setItineraryName] = useState('')
  const [destinations, setDestinations] = useState('')
  const [submitIsDisabled, setSubmitIsDisabled] = useState(false)

  const router = useRouter()
  const { user } = useUser()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!user) {
      const itineraryCreated = localStorage.getItem('itineraryCreated')
      if (itineraryCreated) {
        toast.error('Only one itinerary can be created per guest.', {
          duration: 3000,
          position: 'top-right',
        })
        router.push('/trips')
        return
      } else {
        localStorage.setItem('itineraryCreated', 'true')
      }
    } else if (user) {
      localStorage.removeItem('itineraryCreated')
    }

    if (!itineraryName || !destinations || !startDate || !endDate) return

    setSubmitIsDisabled(true)

    let finalEndDate = endDate
    if (!user) {
      const maxDays = 4
      const maxEndDate = new Date(startDate)
      maxEndDate.setDate(maxEndDate.getDate() + maxDays - 1)
      if (finalEndDate > maxEndDate) {
        finalEndDate = maxEndDate
      }
    }

    const dateArray = eachDayOfInterval({start: startDate, end: finalEndDate})

    const itineraryData = {
      itineraryName,
      startDate,
      endDate: finalEndDate,
      days: dateArray,
      destinations,
      isPublic,
      useAI,
    }

    try {
      const res = await axios.post('/api/itinerary', itineraryData)
      console.log('res.data: ', res.data)
      toast.success('Itinerary created successfully!', {
        duration: 3000,
        position: 'top-right',
      })

      router.push({
        pathname: '/trips/[id]',
        query: { 
          id: res.data.id
        },
      })
    } catch (error) {
      console.error('Error creating itinerary:', error)
      toast.error('Failed to create itinerary. Please try again.', {
        duration: 3000,
        position: 'top-right',
      })
      setSubmitIsDisabled(false)
    }
  }

  return (
    <LayoutWrapper>
      <h1 className="text-3xl font-bold text-center mb-8">Plan Your Trip</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        <div className="space-y-2">
          <Label htmlFor="tripName">Trip Name</Label>
          <Input 
            id="tripName" 
            placeholder="Enter your trip name" 
            required 
            value={itineraryName}
            onChange={(e) => setItineraryName(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="destinations">Destinations</Label>
          <Textarea 
            id="destinations" 
            placeholder="Enter your destinations (one per line)" 
            className="min-h-[100px]" 
            required 
            value={destinations}
            onChange={(e) => setDestinations(e.target.value)}
          />
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
              Our AI will analyze your destinations and dates to suggest the best activities and create an optimized itinerary for your trip.
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
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0 " />
            <p className="text-sm " >
              Public itineraries will only be shown on the discover page after you have completed your trip, ensuring your safety during travel.
            </p>
          </div>
        </div>
        
        <Button type="submit" className="w-full" disabled={submitIsDisabled}>
          Create Trip Plan
        </Button>
      </form>
    </LayoutWrapper>
  )
}
