import { enc, AES } from "crypto-js";
import { localStorageKeys } from "./constants";
import { localstorageGet, localstorageSet } from "./local-storage-helpers";
import { IWeather } from "../interfaces/IWeather";
import { ICoords } from "../interfaces/ICoords";

const { REACT_APP_PASSPHRASE = "" } = process.env;

export function importAllIcons(r: __WebpackModuleApi.RequireContext) {
  let icons = {} as Record<string, string>;
  r.keys().forEach((item) => {
    icons[item.replace(/\.\/(night|day|cloud)\//g, "")] = r(item);
  });
  return icons;
}

export const getDayandTime = () => {
  const date = Date()
 
  const todaysDate = `${date.split(" ")[0]} ${date.split(" ")[1]} ${date.split(" ")[2]},${date.split(" ")[3]}`
  const Today = `${date.split(" ")[1]} ${date.split(" ")[2]},${date.split(" ")[3]}`
  

  let isDay;
  let isNight;

  const time = Date().split(" ")[4]

  const number = time.split(":")[0]

  if (parseInt(number) >= 5 && parseInt(number) <= 16) {
      isDay = true
      isNight = false
  } else {
      isDay = false
      isNight = true
  }


  // console.log({isDay,isNight})
  return { time, number , isDay , isNight,todaysDate ,Today }
}

export function hash(thing: string): string {
  return AES.encrypt(thing, REACT_APP_PASSPHRASE).toString();
}

export function deHash(thing: string): string {
  if (!thing) {
    return "";
  }
  return AES.decrypt(thing, REACT_APP_PASSPHRASE).toString(enc.Utf8);
}

export function round(num: number, precision: number = 2) {
  const base = 10 ** precision;
  return (Math.round(num * base) / base).toFixed(precision);
}

export function getUserLocationCoords(
  onSuccess: (coords: ICoords) => void,
  onError?: (err: GeolocationPositionError) => void
) {
  let coords: ICoords
  let status = {
    failed: true
  }

  const setSuccessStatus = () => {
    status.failed = false
  }

  const success = (position: GeolocationPosition) => {
    const latitude = +round(position.coords.latitude);
    const longitude = +round(position.coords.longitude);

    coords = { latitude, longitude };
    onSuccess(coords);
    setSuccessStatus();
  };

  const error = (err: GeolocationPositionError) => {
    console.warn("error in getting location coordinates");
    logError(err);
    onError?.(err)
    return
  };

  if (!navigator?.geolocation) {
    const err = "Geolocation is not supported by your browser";
    console.warn(err);
    logError(err);
    setSuccessStatus();
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }

  return status;
}

export async function locationPermissionQuery(): Promise<PermissionStatus> {
  console.log('location coordinates')
  return await navigator.permissions.query({ name: "geolocation" });

}

export const updateWeatherCache = (weather: IWeather, location: string) => {
  const [lat, lon] = location.split(",");
  const weatherCache = localstorageGet<IWeather[]>(
    localStorageKeys.weatherCache,
    { isObject: true }
  ) as IWeather[] | null;

  const unaffectedWeathers = (weatherCache || []).filter(
    (w) =>
      String(w.location.lat) !== String(lat.trim()) &&
      String(w.location.lon) !== String(lon.trim())
  );

  const updatedCache = unaffectedWeathers.concat(weather);
  localstorageSet(localStorageKeys.weatherCache, updatedCache)

  return updatedCache;
};

export const getWeatherFromCache = (location: string) => {
  const [lat, lon] = location.split(",");

  try {
    const weatherCache = localstorageGet<IWeather[]>(
      localStorageKeys.weatherCache,
      { isObject: true }
    ) as IWeather[] | null;

    // console.log(weatherCache)

    const cachedWeather = weatherCache?.find(
      (w) =>
        String(w.location.lat) === String(lat.trim()) &&
        String(w.location.lon) === String(lon.trim())
    );

    return cachedWeather;
  } catch {
    return;
  }
};

export const getFavLocations = () => localstorageGet<string[]>(
  localStorageKeys.favorites, { isObject: true }
) as string[] | null;

export const isFavourite = (item: IWeather) => {
  const {
    location: { lat: latitude, lon: longitude },
  } = item;
  const locsFavourites = getFavLocations()
  console.log(typeof locsFavourites)

  const match = (locsFavourites || []).find((f) => {
    const [lat, loc] = f.split(",");
    return (
      String(latitude) === lat.trim() && String(longitude) === loc.trim()
    );
  });

  return match
}

export const sortByLocationName = (weather: IWeather[]) =>
  weather.sort((a, b) => a.location.name.localeCompare(b.location.name));

export const logError = (err: any) =>
  localstorageSet(localStorageKeys.lastErrorLog, err, false);
