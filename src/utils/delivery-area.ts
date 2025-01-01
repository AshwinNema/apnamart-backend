// Formula for calculating that latitude, longtitude lies within a centered latitude, longtitude with a radius
function haversine(
  centerLat: number,
  centerLon: number,
  lat: number,
  lon: number,
): number {
  const earthRadius = 6371000;
  const toRadians = (degrees: number): number => degrees * (Math.PI / 180);

  const phi1 = toRadians(centerLat);
  const phi2 = toRadians(lat);
  const deltaPhi = toRadians(lat - centerLat);
  const deltaLambda = toRadians(lon - centerLon);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;
}

export function isWithinRange(
  centerLat: number,
  centerLon: number,
  lat: number,
  lon: number,
  radius: number,
): boolean {
  const distance = haversine(centerLat, centerLon, lat, lon);
  return distance <= radius;
}
