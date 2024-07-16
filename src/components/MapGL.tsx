import { useState, useEffect } from 'react'
import { Map as MapComponent, NavigationControl, Marker } from 'react-map-gl';
import * as React from 'react';
import { type Activity } from '../types/itinerary';
import useItineraryStore from '../hooks/useItineraryStore';
import useMapStore from '../hooks/useMapStore';


const MapGL = React.memo(() => {
  const mapRef = React.useRef(null)
  const activities = useItineraryStore(state => state.activities)
  const searchMarkerCoordinates = useMapStore(state => state.searchMarkerCoordinates)
  const setMap = useMapStore(state => state.setMap)


  const firstKeyReturned = Object.keys(activities)[0]
  // @ts-ignore
  const someActivityCoords = [activities[firstKeyReturned]?.longitude, activities[firstKeyReturned]?.latitude]
  const [mapCoords, setMapCoords] = useState({
    // initial coordinates
    longitude: someActivityCoords[0] || 0,
    latitude: someActivityCoords[1] || 0,
    zoom: 3.5
  });


  useEffect(() => {
    // @ts-ignore
    setMap(mapRef.current?.getMap())

  }, [mapRef.current])

  return (
    <div className="h-screen w-full sticky top-0 right-0">
      <MapComponent
          {...mapCoords}
          onMove={evt => setMapCoords(evt.viewState)}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
          reuseMaps
          ref={mapRef}
      >
          <NavigationControl showCompass showZoom/>

          {searchMarkerCoordinates[0] && <Marker longitude={searchMarkerCoordinates[0]} latitude={searchMarkerCoordinates[1]}/>}

          {Object.values(activities as Record<string, Activity>)
            .map((act: Activity) => {
              if (act.longitude) {
                return (
                  <Marker 
                    key={act.id} 
                    longitude={act.longitude} 
                    latitude={act.latitude}
                  />
                )
              }
              return null
            }
          )}
      </MapComponent>
    </div>
  )
})

export default MapGL