import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { IWeather } from "../../interfaces/IWeather";
import { localstorageSet } from "../../utils/local-storage-helpers";
import { localStorageKeys } from "../../utils/constants";
import { getFavLocations, isFavourite } from "../../utils/functions";
import { useOnlineStatus } from "../../hooks/use-online";

const WeatherDetail = () => {
  const weather = useLoaderData() as IWeather;
  const { isOnline } = useOnlineStatus();

  const [isFav, setIsFav] = useState<boolean>(!!isFavourite(weather));

  const toggleFavorite = (item: IWeather) => {
    const {
      location: { lat: latitude, lon: longitude },
    } = item;
    const locsFavourites = getFavLocations();

    if (isFavourite(item)) {
      // removing from favorites
      const updatedFavs = (locsFavourites || []).filter((fav) => {
        const [lat, loc] = fav.split(",");
        setIsFav(false);
        return (
          String(latitude) !== lat.trim() && String(longitude) !== loc.trim()
        );
      });

      localstorageSet(localStorageKeys.favorites, updatedFavs);
      return;
    }

    const updatedFavs = (locsFavourites || []).concat(
      `${latitude},${longitude}`
    );
    setIsFav(true);
    localstorageSet(localStorageKeys.favorites, updatedFavs);
  };

  /* here for setting seo friendly url */
  useEffect(() => {
    if (isOnline) {
      window.history.replaceState(
        null,
        "",
        `${weather.location.name.toLowerCase()}-${weather.location.region.toLowerCase()}-${weather.location.country.toLowerCase()}`.replace(
          " ",
          "-"
        )
      );
      return;
    }

    window.history.replaceState(
      null,
      "",
      `${weather.location.lat},${weather.location.lon}`
    );
  }, [isOnline, weather]);

  return (
    <div
      style={isFav ? { color: "purple" } : { color: "chocolate" }}
      onClick={() => toggleFavorite(weather)}
    >
      {JSON.stringify(weather)}
    </div>
  );
};

export default WeatherDetail;
