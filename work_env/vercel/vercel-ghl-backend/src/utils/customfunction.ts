import axios from "axios";

async function geocodeAddress(
  state: string,
  city: string,
  postal_code: any,
  country?: string,
  address?: string
): Promise<{ lat: number; lng: number } | null> {
  const fullAddress = `${address}, ${city}, ${state}, ${postal_code}, ${country}`;
  const mapboxApiKey = process.env.MAPBOX_PUBLIC_TOKEN;
  console.log(fullAddress);

  try {
    const encodedAddress = encodeURIComponent(fullAddress);
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json`,
      {
        params: {
          access_token: mapboxApiKey,
          limit: 1,
        },
      }
    );

    if (response.data.features && response.data.features.length > 0) {
      const location = response.data.features[0].center;
      console.log(location[1], location[0]);
      return { lat: location[1], lng: location[0] };
    } else {
      console.warn(`Geocoding failed: ${response}`);
      return {
        lat: 0, // Default latitude
        lng: 0, // Default longitude
      };
    }
  } catch (error: any) {
    console.error("Error occurred during geocoding:", error.message);
    return null;
  }
}

export { geocodeAddress };

// import axios from "axios";

// async function geocodeAddress(
//   state: string,
//   city: string,
//   postal_code: any,
//   country?: string,
//   address?: string
// ): Promise<{ lat: number; lng: number } | null> {
//   const fullAddress = `${address}, ${city}, ${state}, ${postal_code}, ${country}`;
//   const apiKey = process.env.GOOGLE_API_KEY;
//   console.log(fullAddress);

//   try {
//     const response = await axios.get(
//       "https://maps.googleapis.com/maps/api/geocode/json",
//       {
//         params: {
//           address: fullAddress,
//           key: apiKey,
//         },
//       }
//     );

//     if (response.data.status === "OK") {
//       const location = response.data.results[0].geometry.location;
//       return { lat: location.lat, lng: location.lng };
//     } else {
//       console.warn(`Geocoding failed: ${response}`);
//       // Return a default location if geocoding fails
//       return {
//         lat: 0, // Replace with a default latitude, e.g., the equator
//         lng: 0, // Replace with a default longitude, e.g., the prime meridian
//       };
//     }
//   } catch (error: any) {
//     console.error("Error occurred during geocoding:", error.message);
//     return null;
//   }
// }

// export { geocodeAddress };
