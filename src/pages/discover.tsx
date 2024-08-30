import React, { useState, useEffect, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { SearchIcon, MapPinIcon, CalendarIcon, UsersIcon, FilterIcon } from 'lucide-react'
import IslandPlaceholder from '../assets/island_placeholder.jpeg'



export default function DiscoverPage() {
  interface Itinerary {
    id: number;
    title: string;
    destination: string;
    duration: number;
    price: number;
  }

  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const loader = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulating fetching itineraries
    const fetchItineraries = () => {
      const newItineraries: Itinerary[] = Array.from({ length: 10 }, (_, i) => ({
        id: itineraries.length + i + Math.random(),
        title: `Trip to ${['Bali', 'Paris', 'Tokyo', 'New York', 'Sydney'][Math.floor(Math.random() * 5)]}`,
        destination: ['Indonesia', 'France', 'Japan', 'USA', 'Australia'][Math.floor(Math.random() * 5)],
        duration: Math.floor(Math.random() * 14) + 1,
        price: Math.floor(Math.random() * 5000) + 500,
      }))
      setItineraries(prev => [...prev, ...newItineraries])
    }

    fetchItineraries()
  }, [page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPage(prevPage => prevPage + 1)
        }
      },
      { threshold: 1 }
    )

    if (loader.current) {
      observer.observe(loader.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-sandyBeige text-oceanBlue">
      <main className="container mx-auto p-4">
        <section className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Discover Your Next Adventure</h2>
          <div className="flex gap-2">
            <Input 
              placeholder="Search destinations..." 
              className="flex-grow"
            />
            <Button className="bg-coral hover:bg-coral">
              <SearchIcon className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </section>

        <section className="mb-8">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="mb-4 bg-turquoise hover:bg-turquoise text-oceanBlue"
          >
            <FilterIcon className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96' : 'max-h-0'}`}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Duration (days)</CardTitle>
              </CardHeader>
              <CardContent>
                <Slider defaultValue={[7]} max={30} step={1} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Budget ($)</CardTitle>
              </CardHeader>
              <CardContent>
                <Slider defaultValue={[2000]} max={10000} step={100} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Travelers</CardTitle>
              </CardHeader>
              <CardContent>
                <Slider defaultValue={[2]} max={10} step={1} />
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Discover Itineraries</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {itineraries.map(itinerary => (
              <Card key={itinerary.id} className="bg-white">
                <CardHeader>
                  <CardTitle>{itinerary.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img 
                    src={IslandPlaceholder.src} 
                    alt={itinerary.title}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      {itinerary.destination}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="flex items-center">
                      <CalendarIcon className="w-4 h-4 mr-1" />
                      {itinerary.duration} days
                    </span>
                    <span className="flex items-center">
                      <UsersIcon className="w-4 h-4 mr-1" />
                      2 travelers
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <span className="font-bold text-lg">${itinerary.price}</span>
                  <Button className="bg-coral hover:bg-coral">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <div ref={loader} className="h-10 mt-4"></div>
        </section>
      </main>
    </div>
  )
}

// export const getServerSideProps: GetServerSideProps = async () => {
//   const compareDate = new Date()

//   const initialItineraries = await prisma.itinerary.findMany({
//     where: {
//       public: true,
//       endDate: {
//         // Creating the date like this so that trips created on the same day are not shown since they have not been completed yet.
//         // Otherwise it will compare down to the second or millisecond or whatever.
//         lt: new Date(`${compareDate.getMonth() + 1} ${compareDate.getDate()} ${compareDate.getFullYear()}`)
//       }
//     },
//     take: 20,
//   })

//   return { 
//     props: { itineraries: JSON.parse(JSON.stringify(initialItineraries)) } 
//   }
// } 
