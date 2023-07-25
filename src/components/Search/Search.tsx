import useDebounce from '../../hooks/useDebounce'
import Loader from '../../components/Layout-Navigation/Loader'
import React, { useEffect, useState } from 'react'
import SearchCard from './SearchCard'
import { BiSearch } from 'react-icons/bi'
import axios from 'axios'
import { IItineraryList } from '../../types/trips'
import { Itinerary } from '../../types/itinerary'


const Search = ({ itineraries }: IItineraryList) => {
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Itinerary[]>([])
    const [loading, setLoading] = useState(false)
    const [noResults, setNoResults] = useState(false)
    const debouncedSearchQuery = useDebounce(query, 500)

    console.log(itineraries)

    useEffect(() => {

        const getSearchData = async () => {
          setNoResults(false)
          setLoading(true)
          
          const searchData = await axios.post('/api/search', {destination: debouncedSearchQuery})
          
          if (debouncedSearchQuery && !searchData.data.length) {
            setNoResults(true)
          } else setNoResults(false)
    
          setSearchResults(searchData.data)
          setLoading(false)
        }
    
        if (debouncedSearchQuery) { 
          getSearchData()
        } 
        
      }, [debouncedSearchQuery])

  return (
    <div className='mt-20'>
    <div className='flex flex-col items-center'>
      <h3 className='text-3xl text-center'>Explore destinations and see where other's have traveled</h3>

      <form className='w-full flex justify-center'>
        <div className='relative  w-full md:w-3/4 lg:w-1/2'>
          <input value={query} 
                 onChange={(e) => setQuery(e.target.value)} 
                 type={'text'} 
                 placeholder={'Find your dream getaway!'} 
                 className='text-black inline-block px-3 py-2 rounded-full w-full mt-10 outline-none border-0 focus:ring-0 focus:ring-offset-0'
            />
          {/* Use state to disable button briefly after submit(1 second?) */}
          <button 
            disabled={false} 
            type='submit' 
            className='absolute right-2.5 bottom-2.5 cursor-pointer text-black'>
              <BiSearch size={20}/>
          </button>
        </div>
      </form>

      {/* <div className='w-full mt-5'>
        <p className='text-center text-lg'>Popular destinations</p>

        <div className='flex justify-start custom1:justify-center space-x-6 text-slate-50 mt-3 overflow-x-auto md:overflow-visible'>
          {pop.map(p => <div key={p} className='bg-indigo-300 py-1 px-4 rounded-lg cursor-pointer hover:scale-125 duration-300 '>{p}</div>)}
        </div>
      </div> */}

      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-10 pb-10'>

        {searchResults.length && !loading ? (
          searchResults.map(s => {
            return <SearchCard 
                      key={s.id}
                      name={s.name}
                      destinations={s.destinations}
                      creator={s.creator}
                      likes={s.likes}
                      coverPhoto={s.coverPhoto}
                      id={s.id}
                    />
        })) : null}

        {!loading && !debouncedSearchQuery.length ? (
          itineraries.map(itinerary  => {
            return <SearchCard 
                      key={itinerary.id} 
                      name={itinerary.name} 
                      destinations={itinerary.destinations} 
                      creator={itinerary.creator} 
                      likes={itinerary.likes} 
                      coverPhoto={itinerary.coverPhoto}
                      id={itinerary.id}
                    />
              })
        ): null}

      </div>

      {loading && <Loader/>}
      {noResults && debouncedSearchQuery.length > 0 && <h2 className='text-2xl'>{`No results found for "${debouncedSearchQuery}"`}</h2>}
    </div>
  </div>
  )
}

export default Search




