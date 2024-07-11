import { type AppType } from "next/app";
// import { type Session } from "next-auth";
import Navbar from "../components/Layout-Navigation/Navbar";
import Footer from "../components/Layout-Navigation/Footer";
import { ClerkProvider } from "@clerk/nextjs";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { Merriweather_Sans } from '@next/font/google'
import { ItineraryProvider } from '../contexts/ItineraryContext'
import { MapProvider } from '../contexts/MapContext'
import { SearchMarkerProvider } from '../contexts/SearchMarkerContext'
import { TripDayProvider } from "../contexts/TripDayContext";
import { ActivityProvider } from "../contexts/ActivityContext";
import { Toaster } from "react-hot-toast";

const cabin = Merriweather_Sans({
  weight: ['400','500','600', '700'],
  style: ['normal','italic'],
  subsets: ['latin'],
})
// { session: Session | null }
const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster />
      <div className={cabin.className}>
        <div className="bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 text-white w-full min-h-screen">

          <ItineraryProvider>
            <MapProvider>
              <SearchMarkerProvider>
                <TripDayProvider>
                  <ActivityProvider>
                    <Navbar />
                    <Component {...pageProps} />
                    {/*@ts-ignore */}
                    {!Component.tripPage && <Footer />}
                  </ActivityProvider>
                </TripDayProvider>
              </SearchMarkerProvider>
            </MapProvider>
          </ItineraryProvider>

        </div>
      </div>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);

// bg-[#e3f4ff]

// current: from-blue-500 via-teal-400 to-blue-500 bg-gradient-to-b