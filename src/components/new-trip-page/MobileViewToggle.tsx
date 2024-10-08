import { Button } from "@/components/ui/button"
import { Map, List } from 'lucide-react'

interface MobileViewToggleProps {
  isMapVisible: boolean
  setIsMapVisible: (isVisible: boolean) => void
}

export default function MobileViewToggle({ isMapVisible, setIsMapVisible }: MobileViewToggleProps) {
  return (
    <div className="fixed bottom-3 right-3 md:hidden">
      <Button 
        variant="outline" 
        className="bg-white text-pastel-purple border-pastel-purple hover:bg-pastel-purple"
        onClick={() => setIsMapVisible(!isMapVisible)}
      >
        {isMapVisible ? <List className="mr-2" size={16} /> : <Map className="mr-2" size={16} />}
        {isMapVisible ? 'Itinerary' : 'Map'}
      </Button>
    </div>
  )
}
