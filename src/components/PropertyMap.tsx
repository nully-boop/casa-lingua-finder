
import React from 'react';

interface PropertyMapProps {
  address: string;
  latitude?: string | null;
  longitude?: string | null;
  className?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({
  address,
  latitude,
  longitude,
  className = "",
}) => {
  let mapUrl: string;

  // Determine if we have valid lat/lng values
  if (
    latitude &&
    longitude &&
    !isNaN(Number(latitude)) &&
    !isNaN(Number(longitude))
  ) {
    // Center the map on the given latitude and longitude using Google Maps embed
    mapUrl = `https://www.google.com/maps?q=${latitude},${longitude}&hl=es;z=14&output=embed`;
  } else {
    // Fall back to location search if latitude/longitude is unavailable
    const encodedAddress = encodeURIComponent(address);
    mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}&zoom=15`;
  }

  // For demo purposes, you may want to fallback to a default map for development only
  // const demoMapUrl = "https://www.google.com/maps/embed?...";

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={mapUrl}
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Property Location"
        className="w-full h-[300px]"
      />
      <div className="bg-muted p-3 text-sm text-muted-foreground">
        <strong>Location:</strong> {address}
      </div>
    </div>
  );
};

export default PropertyMap;

