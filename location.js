import { getWeather } from "./script.js";
export function successCallback(position) {
  const lat = position.coords.latitude;
  const lon = position.coords.longitude;
  getWeather(lat, lon);
}

export function errorCallback(error) {
  console.error("Error getting location:", error);
  const defaultLat = 51.5074; 
  const defaultLon = -0.1278;
  getWeather(defaultLat, defaultLon);
}