import { useState, useEffect } from 'react'
import { Map as MapComponent, NavigationControl, Marker } from 'react-map-gl';
import { useSetAtom, useAtomValue } from 'jotai';
import { mapAtom, searchMarkerCoordinatesAtom, activityCoordinatesAtom } from '../atomStore';
import * as React from 'react';

type MapCoords = {
  longitude: number;
  latitude: number;
  zoom: number;
};

const MapGL = () => {
  const mapRef = React.useRef(null)
  const setMap = useSetAtom(mapAtom)
  const searchMarkerCoordinates = useAtomValue(searchMarkerCoordinatesAtom)
  const activityCoordinates = useAtomValue(activityCoordinatesAtom)
  const [mapCoords, setMapCoords] = useState({
    longitude: activityCoordinates[0]?.[0] || 0,
    latitude: activityCoordinates[0]?.[1] || 0,
    zoom: 3.5
  });


  useEffect(() => {
    // @ts-ignore
    setMap((map) => mapRef.current?.getMap())
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

          {activityCoordinates.map((coords, i) => coords[0] && <Marker key={i} longitude={coords[0]} latitude={coords[1]}/>)}
      </MapComponent>
    </div>
  )
}

export default MapGL