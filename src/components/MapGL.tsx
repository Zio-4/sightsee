import React, { useState, useRef, useEffect } from 'react'
import { Map as MapComponent, NavigationControl } from 'react-map-gl';
import { useSetAtom } from 'jotai';
import { mapAtom } from '../store';

const MapGL = () => {
  const [mapCoords, setMapCoords] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  });
  const mapRef = useRef(null)
  const setMap = useSetAtom(mapAtom)

  useEffect(() => {
    // @ts-ignore
    setMap((map) => mapRef.current?.getMap())
  }, [])
  

  return (
    <MapComponent
        {...mapCoords}
        onMove={evt => setMapCoords(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        reuseMaps
        ref={mapRef}
    >
        <NavigationControl showCompass showZoom/>
    </MapComponent>
  )
}

export default MapGL