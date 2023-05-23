import { useState, useEffect } from 'react'
import { Map as MapComponent, NavigationControl, Marker } from 'react-map-gl';
import { useSetAtom, useAtomValue } from 'jotai';
import { mapAtom, searchMarkerCoordinatesAtom } from '../store';
import * as React from 'react';

const MapGL = () => {
  const [mapCoords, setMapCoords] = useState({
    longitude: -100,
    latitude: 40,
    zoom: 3.5
  });
  const mapRef = React.useRef(null)
  const setMap = useSetAtom(mapAtom)
  const searchMarkerCoordinates = useAtomValue(searchMarkerCoordinatesAtom)

  useEffect(() => {
    // @ts-ignore
    setMap((map) => mapRef.current?.getMap())
  }, [mapRef.current])

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

        {searchMarkerCoordinates[0] && <Marker longitude={searchMarkerCoordinates[0]} latitude={searchMarkerCoordinates[1]}/>}
    </MapComponent>
  )
}

export default MapGL