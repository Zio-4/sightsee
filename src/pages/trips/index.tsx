import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { FaPlane } from 'react-icons/fa'
import { prisma } from '../../server/db/client'
import { GetServerSideProps } from 'next'
import LayoutWrapper from '../../components/Layout-Navigation/LayoutWrapper'
import { Tab } from '@headlessui/react'
import TabPanelContainer from '../../components/Trips/TabPanelContainer'
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { IMappedItineraries, ItinerariesMap, INoData } from '../../types/trips'
import { Itinerary } from '../../types/itinerary'

// Don't really know what the filter does in this case, tested with and without and couldn't notice a difference.
// The boolean object always evaluates to true when passed in a conditional statement so nothing will get filetered here?
// Was in the headless ui demo code
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const filters = ['CURRENT', 'UPCOMING', 'PAST']

const trips = (serverProps: IMappedItineraries | INoData) => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const router = useRouter()


  return (
    <LayoutWrapper>
      <div className='flex flex-col flex-grow min-:'>
          <h2 className='text-center text-4xl mt-16 mb-8'>Your Trips</h2>

          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            {({ selectedIndex }) => (
              <div className="flex flex-col flex-grow">
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 w-full xl:w-1/2 mx-auto">
                  {filters.map((category) => (
                    <Tab
                      key={category}
                      className={({ selected }) =>
                        classNames(
                          'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                          'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                          selected
                            ? 'bg-white shadow'
                            : 'text-blue-100 hover:bg-white/[0.12] hover:text-white'
                        )
                      }
                    >
                      {category}
                    </Tab>
                  ))}
                </Tab.List>
                <div className='flex justify-center'>
                  <button onClick={() => router.push('/trips/plan')} className=' bg-indigo-300 text-slate-50 px-10 py-2 rounded-md mt-8 hover:bg-indigo-500'>Plan trip <span className='inline-block text-md'><FaPlane/></span></button>
                </div>
                <Tab.Panels className="mt-2 flex-grow">
                  {filters.map(filter => {
                    return (
                      <Tab.Panel key={filter} className="">
                        {"itineraryData" in serverProps && Object.keys(serverProps.itineraryData).length ? (
                          <TabPanelContainer itinerariesByDate={serverProps.itineraryData} selectedFilter={filters[selectedIndex]!} selectedIndex={selectedIndex}/>
                        ) : (
                            <div className="flex items-center justify-center ">
                              <h2 className='text-center text-xl w-full'>{`You don't have any ${filters[selectedIndex]?.toLocaleLowerCase()} trips. Now's the perfect time to plan for a getaway!`}</h2>
                            </div>
                        )}
                      </Tab.Panel>
                    )
                  })}
                </Tab.Panels>
              </div>
            )}
          </Tab.Group>

      </div>
    </LayoutWrapper>
  )
} 

export default trips

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  let data: any;

  try {
    if (userId) {
      const res = await prisma.profile.findUnique({
        where: {
          clerkId: userId
        },
        include: {
          itineraries: {
            orderBy:{
                startDate: 'asc'
              }
          },
          collaborations: {
            include: {
              itinerary: true
            }
          }
        }
      })

      if (res) {
        data = res
      }
    }
  } catch (e) {
    console.error(e);
  }

  console.log('data:', data)
  console.log('data.collaborations:', data?.collaborations)

  if (data?.itineraries) {
    // add collaboration itineraries if they are not in the users itineraries
    const allItineraries = data.itineraries

    // Create a Set of ids from array1 for quick lookup
    const idsInUsersItineraries = new Set(allItineraries.map((obj: Itinerary) => obj.id));

    // Iterate over array2 and add objects to array1 if the id is not already present
    data.collaborations.forEach((obj: any) => {
      if (!idsInUsersItineraries.has(obj.itineraryId)) {
        // Add field for conditional rendering tag in component
        obj.itinerary.collaborator = true
        allItineraries.push(obj.itinerary);
      }
    });


    if (allItineraries.length) {
      const itinerariesMap: ItinerariesMap = {}

      for (const itin of allItineraries) {
        const start = new Date(itin.startDate)

        const startMonth = start.getMonth()
        const startYear = start.getFullYear()  

        if (itinerariesMap[`${startMonth}-${startYear}`]) {
          itinerariesMap[`${startMonth}-${startYear}`]!.push(itin)
        } else {
          itinerariesMap[`${startMonth}-${startYear}`] = [itin]  
        }
      }


      return { props: { ...buildClerkProps(ctx.req), itineraryData: JSON.parse(JSON.stringify(itinerariesMap)) } }
    }
  }

  // signed in but have no itineraries
  return { props: { ...buildClerkProps(ctx.req), noItins: true } }
}
