import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Palmtree, Users, Compass, Calendar, Share2, Search, Binoculars } from "lucide-react"
import Link from "next/link"
import BeachPlaceholder from '../assets/beach_vacation.avif'
import Globe from "@/components/Globe"
import CuteCatBeach from '../assets/Cute_Cat_Beach.png'
import Footer from '@/components/Layout/Footer'

export default function Component() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F5DEB3] font-sans">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Roboto:wght@400;700&display=swap');
        
        h1, h2, h3 {
          font-family: 'Montserrat', sans-serif;
        }
        
        body {
          font-family: 'Roboto', sans-serif;
        }
      `}</style>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-[#00008B]">
                  Plan Your Dream Vacation with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-[#00008B] md:text-xl">
                  Personalized itineraries tailored to your group and interests. Let our AI create the perfect tropical getaway for you.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex justify-center space-x-2">
                  <Link href="/trips/plan">
                    <Button className="bg-[#FF7F50] text-white hover:bg-[#FF6347]">Plan Now</Button>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#40E0D0]">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <img
                alt="Tropical beach scene"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
                height="310"
                src={BeachPlaceholder.src}
                width="550"
              />
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-white">
                    AI-Powered Itineraries
                  </h2>
                  <p className="max-w-[600px] text-white md:text-xl">
                    Our advanced AI considers your travel group, preferences, and interests to create the perfect itinerary for your tropical adventure.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-white" />
                    <span className="text-white">Tailored for solo, friends, or family trips</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-white" />
                    <span className="text-white">Personalized based on your interests</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-white" />
                    <span className="text-white">Flexible schedules to fit your travel style</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-8 text-[#00008B]">
              Sample Itineraries
            </h2>
            <div className="grid gap-6 lg:grid-cols-3">
              {[
                { title: "Solo Adventure", description: "Exciting activities for the lone traveler" },
                { title: "Friends Getaway", description: "Fun-filled days with your best buddies" },
                { title: "Family Fun", description: "Memorable experiences for all ages" },
              ].map((item) => (
                <div key={item.title} className="flex flex-col items-center space-y-2 border-2 border-[#40E0D0] p-4 rounded-lg">
                  <h3 className="text-xl font-bold text-[#00008B]">{item.title}</h3>
                  <p className="text-[#00008B] text-center">{item.description}</p>
                  <Button className="mt-4 bg-[#FF7F50] text-white hover:bg-[#FF6347]">View Itinerary</Button>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#40E0D0]">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-white">
                    Real-Time Collaboration
                  </h2>
                  <p className="max-w-[600px] text-white md:text-xl">
                    Plan your trip together with friends and family in real-time. Share ideas, vote on activities, and create the perfect itinerary as a team.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <Share2 className="h-5 w-5 text-white" />
                    <span className="text-white">Invite friends to collaborate on your trip</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-white" />
                    <span className="text-white">Vote on activities</span>
                  </li>
                </ul>
              </div>
              <div className="flex justify-center">
                <img
                  alt="Real-time collaboration illustration"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  height="310"
                  src={BeachPlaceholder.src}
                  width="550"
                />
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex justify-center lg:order-last">
                <img
                  alt="Trip discovery illustration"
                  className="aspect-video overflow-hidden rounded-xl object-cover object-center"
                  height="310"
                  src={BeachPlaceholder.src}
                  width="550"
                />
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#00008B]">
                    Trip Discovery
                  </h2>
                  <p className="max-w-[600px] text-[#00008B] md:text-xl">
                    Explore and get inspired by trips created by other travelers. Discover hidden gems and popular destinations tailored to your interests.
                  </p>
                </div>
                <ul className="grid gap-2 py-4">
                  <li className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-[#00008B]" />
                    <span className="text-[#00008B]">Browse trips by destination, budget, or number of travelers </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-[#00008B]" />
                    <span className="text-[#00008B]">Connect with like-minded travelers</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Compass className="h-5 w-5 text-[#00008B]" />
                    <span className="text-[#00008B]">Save and customize discovered trips to make them your own</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-[#40E0D0]">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  Ready for Your Tropical Escape?
                </h2>
                <p className="mx-auto max-w-[600px] text-white md:text-xl">
                  Let our AI create the perfect itinerary for your dream vacation. Start planning now!
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form className="flex flex-col gap-2">
                  <Link href="/trips/plan">
                    <Button className="w-full bg-[#FF7F50] text-white hover:bg-[#FF6347]">Generate Itinerary</Button>
                  </Link>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
