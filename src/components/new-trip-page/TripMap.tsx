import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import dynamic from "next/dynamic"

interface TripMapProps {
  isVisible: boolean
}

const MapGL = dynamic(() => import('@/components/MapGL'), { ssr: false })

export default function TripMap({ isVisible }: TripMapProps) {
  return (
    <Card className={`bg-white ${isVisible ? 'block' : 'hidden'} md:block`}>
      <CardHeader className="bg-pastel-purple bg-opacity-10">
        <CardTitle className="text-pastel-purple">Trip Map</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div>
          <MapGL />
        </div>
      </CardContent>
    </Card>
  )
}
