import { type AppType } from "next/app";
// import { type Session } from "next-auth";
import Navbar from "../components/Layout/Navbar";
import Footer from "../components/Layout/Footer";
import { ClerkProvider } from "@clerk/nextjs";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { Montserrat, Roboto } from '@next/font/google'
import { Toaster } from "react-hot-toast";

const montserrat = Montserrat({
  weight: ['400', '700'],
  subsets: ['latin'],
})

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
})

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster />
      <div className={`${montserrat.className} ${roboto.className}`}>
        <div className="bg-sandyBeige">
          <Navbar />
          <Component {...pageProps} />
          {/*@ts-ignore */}
          {!Component.tripPage && <Footer />}
        </div>
      </div>
      <style jsx global>{`
        h1, h2, h3 {
          font-family: 'Montserrat', sans-serif;
        }
        
        body {
          font-family: 'Roboto', sans-serif;
        }
      `}</style>
    </ClerkProvider>
  );
};

export default trpc.withTRPC(MyApp);

// bg-[#e3f4ff]

// current: from-blue-500 via-teal-400 to-blue-500 bg-gradient-to-b
