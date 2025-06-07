
import React from 'react';

interface PropertyMapProps {
  address: string;
  className?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ address, className = "" }) => {
  // Create a Google Maps embed URL with the address
  const encodedAddress = encodeURIComponent(address);
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${encodedAddress}&zoom=15`;
  
  // For demo purposes, we'll use a placeholder map with the general Dubai area
  const demoMapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.8!2d55.1562!3d25.0657!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f43496ad9c645%3A0xbde66e5084295162!2sDubai%20-%20United%20Arab%20Emirates!5e0!3m2!1sen!2s!4v1699000000000!5m2!1sen!2s";

  return (
    <div className={`rounded-lg overflow-hidden ${className}`}>
      <iframe
        src={demoMapUrl}
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
