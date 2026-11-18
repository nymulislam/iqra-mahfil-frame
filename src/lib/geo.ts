/**
 * Geographical helpers and distance calculations
 */

// Existing approximate venue pin. Confirm the exact field location with the organizers.
export const MAHFIL_COORDS = {
  latitude: 23.1306,
  longitude: 90.7512,
  name: 'পাটওয়ারী বাজার বালুর মাঠ, ফরিদগঞ্জ, চাঁদপুর',
};

/**
 * Calculates distance between two GPS coordinates using the Haversine formula (in kilometers)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number = MAHFIL_COORDS.latitude,
  lon2: number = MAHFIL_COORDS.longitude
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

/**
 * Flag emoji generator for country codes
 */
export function flag(cc: string): string {
  if (!cc || cc.length !== 2) return '📍';
  return String.fromCodePoint(127397 + cc.charCodeAt(0), 127397 + cc.charCodeAt(1));
}
