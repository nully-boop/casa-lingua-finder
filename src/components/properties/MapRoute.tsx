import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import axios from 'axios';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MapPin, Navigation, Clock, Route, Satellite, Map, ExternalLink } from 'lucide-react';

import 'leaflet/dist/leaflet.css';

// Additional CSS to ensure proper map display
const mapStyles = `
  .leaflet-container {
    z-index: 0 !important;
  }
  .leaflet-control-container {
    z-index: 25 !important;
  }
  .leaflet-popup-pane {
    z-index: 25 !important;
  }
  .leaflet-tooltip-pane {
    z-index: 25 !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = mapStyles;
  if (!document.head.querySelector('style[data-map-styles]')) {
    styleElement.setAttribute('data-map-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Setup default marker icon
const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;


interface FreeMapRouteProps {
  destination: { lat: string; lng: string; };
  containerStyle?: React.CSSProperties;
  height?: string;
}

type Status = 'loading' | 'error' | 'success' | 'permission-denied' | 'location-only';
type MapMode = 'location' | 'directions';
type TileMode = 'street' | 'satellite';

const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  if (hours > 0) return `${hours} h ${minutes} min`;
  return `${minutes} min`;
};

export const FreeMapRouteComponent: React.FC<FreeMapRouteProps> = ({
  destination,
  containerStyle,
  height = "400px"
}) => {
  const { t, language } = useLanguage();
  const [status, setStatus] = useState<Status>('loading');
  const [mapMode, setMapMode] = useState<MapMode>('location');
  const [tileMode, setTileMode] = useState<TileMode>('street');
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const destinationCoords: LatLngExpression = useMemo(() => {
    return [parseFloat(destination.lat), parseFloat(destination.lng)];
  }, [destination]);


  useEffect(() => {
    const initializeLocation = async () => {
      try {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
          // Show location without user position
          setStatus('location-only');
          return;
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              if (error.code === error.PERMISSION_DENIED) {
                setStatus('permission-denied');
                return;
              }
              // For other geolocation errors, show location only
              setStatus('location-only');
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 300000 // 5 minutes
            }
          );
        });

        const currentUserLocation: LatLngExpression = [position.coords.latitude, position.coords.longitude];
        setUserLocation(currentUserLocation);
        setStatus('location-only'); // Initially show location only

      } catch (error: unknown) {
        // If any error occurs, just show the property location
        setStatus('location-only');
      }
    };

    initializeLocation();
  }, [destinationCoords, t]);

  // Function to get directions
  const getDirections = async () => {
    if (!userLocation) {
      setErrorMessage(t('map.locationRequired') || 'Your location is required to get directions.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    try {
      const userLon = (userLocation as number[])[1];
      const userLat = (userLocation as number[])[0];
      const destLon = (destinationCoords as number[])[1];
      const destLat = (destinationCoords as number[])[0];

      // Use HTTPS for routing service
      const url = `https://router.project-osrm.org/route/v1/driving/${userLon},${userLat};${destLon},${destLat}?overview=full&geometries=geojson`;

      const response = await axios.get(url);

      if (response.data.routes.length === 0) {
        throw new Error(t('map.noRouteFound') || 'No route could be found.');
      }

      const routeData = response.data.routes[0];
      setRoute(routeData.geometry.coordinates.map((p: number[]) => [p[1], p[0]]));
      setDistance(routeData.distance);
      setDuration(routeData.duration);
      setMapMode('directions');
      setStatus('success');

    } catch (error: unknown) {
      const err = error as { isAxiosError?: boolean; response?: unknown; message?: string };
      if (err.isAxiosError && !err.response) {
        setErrorMessage(t('map.networkError') || 'Network Error: Could not connect to the routing service. Please check your internet connection.');
      } else {
        setErrorMessage(err.message || t('map.unknownError') || 'An unknown error occurred.');
      }
      setStatus('error');
    }
  };

  // Function to open large map in new tab
  const openLargeMap = () => {
    const lat = (destinationCoords as number[])[0];
    const lng = (destinationCoords as number[])[1];
    const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=15`;
    window.open(googleMapsUrl, '_blank');
  };

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center p-8" style={{ height }}>
        <div className="flex flex-col items-center space-y-3">
          <Route className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            {t('map.calculatingRoute') || 'Calculating route...'}
          </p>
        </div>
      </div>
    );
  }

  // Permission denied state
  if (status === 'permission-denied') {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4" style={{ height }}>
        <Navigation className="h-12 w-12 text-orange-500" />
        <div className="text-center space-y-2">
          <h3 className="font-semibold">
            {t('map.locationPermissionRequired') || 'Location Permission Required'}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('map.enableLocationMessage') || 'Please enable location access to see the route to this property.'}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            <Navigation className="h-4 w-4 mr-2" />
            {t('map.tryAgain') || 'Try Again'}
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4" style={{ height }}>
        <MapPin className="h-12 w-12 text-red-500" />
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-red-600">
            {t('map.routeError') || 'Route Error'}
          </h3>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            className="mt-3"
          >
            {t('common.retry') || 'Retry'}
          </Button>
        </div>
      </div>
    );
  }

  // Location-only state (show property location with controls)
  if (status === 'location-only') {
    return (
      <div className="relative w-full z-0" style={{ height, ...containerStyle }}>
        <MapContainer
          center={destinationCoords}
          zoom={15}
          className="w-full h-full rounded-lg z-0"
          scrollWheelZoom={true}
        >
          <TileLayer
            url={tileMode === 'satellite'
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={tileMode === 'satellite'
              ? '© Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          />
          <Marker position={destinationCoords}>
            <Popup>{t('map.destination') || 'Property Location'}</Popup>
          </Marker>
        </MapContainer>

        {/* Control buttons */}
        <div className="absolute top-3 right-3 z-30 flex flex-col space-y-2">
          {/* Satellite toggle */}
          <Button
            onClick={() => setTileMode(tileMode === 'street' ? 'satellite' : 'street')}
            size="sm"
            variant="secondary"
            className="bg-white dark:bg-gray-800 shadow-lg border"
          >
            {tileMode === 'street' ? (
              <Satellite className="h-4 w-4" />
            ) : (
              <Map className="h-4 w-4" />
            )}
          </Button>

          {/* Directions button */}
          {userLocation && (
            <Button
              onClick={getDirections}
              size="sm"
              variant="default"
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              <Navigation className="h-4 w-4" />
            </Button>
          )}

          {/* Large map button */}
          <Button
            onClick={openLargeMap}
            size="sm"
            variant="secondary"
            className="bg-white dark:bg-gray-800 shadow-lg border"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Info overlay */}
        <div className="absolute bottom-3 left-3 z-30 bg-white dark:bg-gray-800 px-3 py-2 rounded-lg shadow-lg border">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">{t('map.propertyLocation') || 'Property Location'}</span>
          </div>
        </div>
      </div>
    );
  }

  // Success state with directions
  if (status === 'success') {
    return (
      <div className="relative w-full z-0" style={{ height, ...containerStyle }}>
        <MapContainer
          center={userLocation || destinationCoords}
          zoom={13}
          className="w-full h-full rounded-lg z-0"
          scrollWheelZoom={true}
        >
          <TileLayer
            url={tileMode === 'satellite'
              ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            }
            attribution={tileMode === 'satellite'
              ? '© Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
              : '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }
          />
          {userLocation && (
            <Marker position={userLocation}>
              <Popup>{t('map.yourLocation') || 'Your Location'}</Popup>
            </Marker>
          )}
          <Marker position={destinationCoords}>
            <Popup>{t('map.destination') || 'Property Location'}</Popup>
          </Marker>
          {route.length > 0 && <Polyline positions={route} color="#3b82f6" weight={4} />}
        </MapContainer>

        {/* Control buttons */}
        <div className="absolute top-3 right-3 z-30 flex flex-col space-y-2">
          {/* Satellite toggle */}
          <Button
            onClick={() => setTileMode(tileMode === 'street' ? 'satellite' : 'street')}
            size="sm"
            variant="secondary"
            className="bg-white dark:bg-gray-800 shadow-lg border"
          >
            {tileMode === 'street' ? (
              <Satellite className="h-4 w-4" />
            ) : (
              <Map className="h-4 w-4" />
            )}
          </Button>

          {/* Large map button */}
          <Button
            onClick={openLargeMap}
            size="sm"
            variant="secondary"
            className="bg-white dark:bg-gray-800 shadow-lg border"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>

        {/* Route info overlay */}
        {distance !== null && duration !== null && (
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-30 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg border">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Route className="h-4 w-4 text-primary" />
                <span className="font-medium">{(distance / 1000).toFixed(1)} km</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="font-medium">{formatDuration(duration)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback return (should not reach here)
  return null;
};