import { useState, useEffect } from 'react'
import { Map as MapComponent, NavigationControl, Marker } from 'react-map-gl';
import * as React from 'react';
import { type Activity } from '../types/itinerary';
import useItineraryStore from '../hooks/useItineraryStore';
import useMapStore from '../hooks/useMapStore';

const MapGL = React.memo(() => {
  const activities = useItineraryStore(state => state.activities);
  const searchMarkerCoordinates = useMapStore(state => state.searchMarkerCoordinates);
  const setMap = useMapStore(state => state.setMap);

  const firstKeyReturned = Object.keys(activities)[0];
  const someActivityCoords = [activities[firstKeyReturned]?.longitude, activities[firstKeyReturned]?.latitude];
  const [mapCoords, setMapCoords] = useState({
    longitude: someActivityCoords[0] || 0,
    latitude: someActivityCoords[1] || 0,
    zoom: 3.5
  });

  const onMapLoad = React.useCallback((event: { target: mapboxgl.Map }) => {
    setMap(event.target);
  }, [setMap]);

  return (
    <div className="h-screen w-full sticky top-0 right-0">
      <MapComponent
        {...mapCoords}
        onMove={evt => setMapCoords(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        reuseMaps
        onLoad={onMapLoad}
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
