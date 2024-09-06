import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import EDCPlaceHolder from '../../assets/EDC_Placeholder.jpeg'

interface TripMapProps {
  isVisible: boolean
}

export default function TripMap({ isVisible }: TripMapProps) {
  return (
    <Card className={`bg-white ${isVisible ? 'block' : 'hidden'} md:block`}>
      <CardHeader className="bg-pastel-purple bg-opacity-10">
        <CardTitle className="text-pastel-purple">Trip Map</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-square rounded-md overflow-hidden">
          <img 
            src={EDCPlaceHolder.src} 
            alt="Map of Bangkok" 
            className="w-full h-full object-cover"
          />
        </div>
      </CardContent>
    </Card>
  )
}
