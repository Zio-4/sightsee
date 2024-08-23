import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Info } from "lucide-react"

export default function Component() {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [useAI, setUseAI] = useState(true)
  const [isPublic, setIsPublic] = useState(false)

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    // Handle form submission here
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center">Plan Your Trip</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="tripName">Trip Name</Label>
          <Input id="tripName" placeholder="Enter your trip name" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="destinations">Destinations</Label>
          <Textarea 
            id="destinations" 
            placeholder="Enter your destinations (one per line)" 
            className="min-h-[100px]" 
            required 
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
            <Info className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">
              Public itineraries will only be shown on the discover page after you have completed your trip, ensuring your safety during travel.
            </p>
          </div>
        </div>
        
        <Button type="submit" className="w-full">Create Trip Plan</Button>
      </form>
    </div>
  )
}
