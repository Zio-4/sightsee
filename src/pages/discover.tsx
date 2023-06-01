import React, { useEffect, useState } from 'react'
import LayoutWrapper from '../components/Layout-Navigation/LayoutWrapper'
import { type GetServerSideProps } from 'next'
import Search from '../components/Search/Search'
import { prisma } from '../server/db/client'
import { IItineraryList } from '../types/trips'


const discover = ({ itineraries }: IItineraryList) => {

  return (
    <LayoutWrapper>
      <Search itineraries={itineraries}/>
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
    props: { itineraries: JSON.parse(JSON.stringify(initialItineraries)) } 
  }
} 