import React from 'react'
import Image from 'next/image'
import { AiFillHeart } from 'react-icons/ai'
import Link from 'next/link'
import { IItineraryCard } from '../../types/search'


const SearchCard = ({coverPhoto, destinations, id, likes, name, creator}: IItineraryCard ) => {

  return (
    <Link href={{pathname:'/itinerary/[id]', query: { id: id.toString() }}} as={`/itinerary/${id.toString()}`} className='bg-white p-4 bg-opacity-80 rounded-lg drop-shadow-lg cursor-pointer text-black'>
        <Image src={coverPhoto || 'https://commons.wikimedia.org/wiki/File:BlankMap-World.svg'} alt='Itinerary cover' width={300} height={300} className='rounded-md w-64 h-48'/>

        <div className='flex justify-between'>
            <p className='text-lg'>{name}</p>
            {/* <div><AiFillHeart size={22} color={'red'} className='inline-block'/>{`${likes}`}</div> */}
        </div>


        <p className='text-slate-500'>{destinations}</p>


        <p className='mt-5'>By: {creator}</p>
    </Link>
  )
}

export default SearchCard
