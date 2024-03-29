import React, { useEffect, useState } from 'react'
import MonthContainer from './MonthContainer'
import { ITabPanel } from '../../types/trips'



const TabPanelContainer = ({itinerariesByDate, selectedFilter, selectedIndex}: ITabPanel) => {
    const [monthContainersAreEmpty, setMonthContainersAreEmpty] = useState(false)

    const monthContainersCheck = () => {
      setTimeout(() => {
        const tripCards = document.getElementsByClassName('trip-card')

        if (!tripCards.length) {
          setMonthContainersAreEmpty(true)
        }
      }, 50)
    }


  return (
    <div>
        {Object.keys(itinerariesByDate).map((date, i) => {
            return <MonthContainer 
                      key={i} 
                      startMonth={date.length === 6 ? date.substring(0,1) : date.substring(0,2)} 
                      startYear={date.substring(2)} 
                      itineraries={itinerariesByDate[date]!} 
                      selectedIndex={selectedIndex} 
                      monthContainersCheck={monthContainersCheck}
                   />
        })}

        {monthContainersAreEmpty && (
          <p className='text-center'>{`You don't have any ${selectedFilter.toLocaleLowerCase()} trips.`}</p>
        )}
    </div>
  )
}

export default TabPanelContainer
