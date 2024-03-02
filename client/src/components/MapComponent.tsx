import React from "react";
import { APIProvider, Map } from '@vis.gl/react-google-maps';
interface MapComponentProps {
  mapZoom?: number
  defaultCenter: any
  fullscreenControl?: boolean
  zoomControl?: boolean
}

const MapComponent: React.FC<React.PropsWithChildren<MapComponentProps>>  = ({ mapZoom = 5, defaultCenter, fullscreenControl = true, zoomControl = true, children }) => {

  return (
    <APIProvider apiKey={`${process.env.REACT_APP_WT_GOOGLE_API_KEY}`}>
      <Map
        draggableCursor={null}
        mapTypeControl={false}
        streetViewControl={false}
        fullscreenControl={fullscreenControl}
        zoomControl={zoomControl}
        defaultZoom={mapZoom}
        gestureHandling={'greedy'}
        defaultCenter={defaultCenter}
      >
        {children}
      </Map>
    </APIProvider>
  )
}

export default MapComponent;
