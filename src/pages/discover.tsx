import React, { useEffect, useState } from 'react'
import LayoutWrapper from '../components/Layout-Navigation/LayoutWrapper'
import { type GetServerSideProps } from 'next'
import Search from '../components/Search/Search'
import { prisma } from '../server/db/client'


interface IItinerary {
  coverPhoto: string
  destinations: string
  endDate: string
  id: number
  likes: number
  name: string
  creator: string
  profileId: number
  public: boolean
  startDate: string
}

interface IServerData {
  initialItineraries: IItinerary[]
}


const discover = ({ initialItineraries }: IServerData) => {

  return (
    <LayoutWrapper>
      <Search initialItineraries={initialItineraries}/>
    </LayoutWrapper>
  )
}

export default discover

export const getServerSideProps: GetServerSideProps = async () => {
  const compareDate = new Date()

  const initialItineraries = await prisma.itinerary.findMany({
    where: {
      public: true,
      endDate: {
        // Creating the date like this so that trips created on the same day are not shown since they have not been completed yet.
        // Otherwise it will compare down to the second or millisecond or whatever.
        lt: new Date(`${compareDate.getMonth() + 1} ${compareDate.getDate()} ${compareDate.getFullYear()}`)
      }
    },
    take: 20,
  })

  return { 
    props: { initialItineraries: JSON.parse(JSON.stringify(initialItineraries)) } 
  }
} 