import { type AppType } from "next/app";
// import { type Session } from "next-auth";
import Navbar from "../components/Layout-Navigation/Navbar";
import Footer from "../components/Layout-Navigation/Footer";
import { ClerkProvider } from "@clerk/nextjs";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { Merriweather_Sans } from '@next/font/google'
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
      {/* className="bg-gradient-to-br from-green-300 via-blue-500 to-purple-600 text-white w-full min-h-screen" */}
        <div >
          <Navbar />
          <Component {...pageProps} />
          {/*@ts-ignore */}
          {!Component.tripPage && <Footer />}
        </div>
      </div>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);

// bg-[#e3f4ff]

// current: from-blue-500 via-teal-400 to-blue-500 bg-gradient-to-b
