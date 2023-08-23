import React, { ReactNode } from 'react'
import { FaMapMarkedAlt } from 'react-icons/fa'
import { SlNote } from 'react-icons/sl'

interface ITripLayout {
    viewState: boolean
    setViewState: React.Dispatch<React.SetStateAction<boolean>>
    itineraryChild: ReactNode
    mapChild: ReactNode
}

function TripLayout({viewState, setViewState, itineraryChild, mapChild}: ITripLayout) {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3'>
      <div className={`${viewState && 'hidden'} lg:block 2xl:col-start-1 2xl:col-end-1 shadow-lg shadow-gray-600 z-[998]`}>
        { itineraryChild }
      </div>
      <div className={`${!viewState && 'hidden'} lg:block 2xl:col-start-2 2xl:col-end-4`}>
        { mapChild }
      </div>

      <button onClick={() => setViewState((prev: boolean) => !prev)} className='lg:hidden z-[1000] fixed bottom-4 right-4 p-3 text-sm transition-colors duration-300 rounded-full shadow-xl text-violet-100 bg-violet-500 hover:bg-violet-600 shadow-violet-500'>
        {viewState ? <SlNote size={27}/> : <FaMapMarkedAlt size={27} />}
      </button>
    </div>
  )
}

export default TripLayout