import React from "react";
import { FiExternalLink } from "react-icons/fi";
import { useOutletContext } from "react-router-dom";
function AboutLocations() {
  const { company } = useOutletContext();
  const mapUrl = company.mapsloc; // The exact location link from the backend
  const embedUrl = `https://www.google.com/maps?q=${encodeURIComponent(
    company.address,
  )}&output=embed`;

  return (
    <div
      className="bg-boxbackground p-6 shadow-md rounded-md w-full max-w-3xl mx-auto pb-4 mb-8"
      data-testid="about-locations"
    >
      <h1 className="text-2xl font-semibold mb-2 text-boxheading">Location</h1>

      {/* Get Directions Link */}
      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 hover:underline inline-flex items-center justify-center gap-2 flex-shrink-0"
      >
        <span>Get directions</span>
        <FiExternalLink className="w-4 h-4" />
      </a>

      {/* Google Maps Embed (No API) */}
      <div className="w-full h-64 rounded-lg overflow-hidden shadow-lg mt-4">
        <iframe
          title="Google Map"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </div>
  );
}

export default AboutLocations;
