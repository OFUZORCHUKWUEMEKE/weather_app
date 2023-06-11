import React, { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { IWeather } from "../../interfaces/IWeather";
import { localstorageGet, localstorageSet } from "../../utils/local-storage-helpers";
import { localStorageKeys, weatherConditionCodesMappedToIcons } from "../../utils/constants";
import { getDayandTime, getFavLocations, isFavourite } from "../../utils/functions";
import { useOnlineStatus } from "../../hooks/use-online";
import './index.scss'

const WeatherDetail = () => {
  const weather = useLoaderData() as IWeather;
  const { isOnline } = useOnlineStatus();

  const [forecast, setForecast] = useState(false)

  const [notes,setNotes] = useState()

  const { location, current } = weather;

  const { time, number, isDay, isNight, todaysDate, Today } = getDayandTime()

  // console.log(weather)
  // console.log({ weather, isDay })

  const [isFav, setIsFav] = useState<boolean>(!!isFavourite(weather));

  console.log(isFav)

  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      // 👇 Get input value
      setNotes(event.target.value)
      console.log(event.target.value)
      localstorageSet(localStorageKeys.notes,String(notes),true)
      console.log(localstorageGet(localStorageKeys.notes))
    }
  };

  console.log(localstorageGet(localStorageKeys.notes))

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

  const image = weatherConditionCodesMappedToIcons.find((weat) => weat.code === weather.current.condition.code)

  return (
    <div
      // style={isFav ? { color: "purple" } : { color: "chocolate" }}
      // onClick={() => toggleFavorite(weather)}
      className={isDay ? 'back_ground_light' : 'back_ground_dark'}
    >
      <div className="weather-details-container">
        <div className="weather-detail-child">
          <div className="header">
            <h1 className="name">{location.name}</h1>
            <p className="date">{Today}</p>
            <div className="forecast">
              <div className={forecast ? 'forecast_000 active':'forecast_000'} onClick={()=>setForecast(true)}>
                <h2>Forecast</h2>
              </div>
              <div className={forecast ? 'forecast_001':'forecast_001 active'} onClick={()=>setForecast(false)}>
                <h2>Notes</h2>
              </div>
            </div>
            <div className="image-padding">
              {forecast ? (<img className="image-0" src={isDay ? `${image?.day}` : `${image?.night}`} />) : (
                <div className="extra-padding">
                  <div className="padding-text">
                    {/* <h2 className="">Notes</h2> */}
                  </div>

                  <input placeholder="Add Notes" onKeyDown={handleKeyDown} onChange={(e)=>e.target.value} className="add-input" />
                </div>
              )}
            </div>
            <div className="weather-detail">
              <div className="weather-detail-one">
                <div className="inner-weather-detail">
                  <p>Temp</p>
                  <h2>{current.temp_c}'c</h2>
                </div>
                <div className="inner-weather-detail">
                  <p>Wind</p>
                  <h2>{current.wind_kph}kph</h2>
                </div>
                <div className="inner-weather-detail">
                  <p>Humidity</p>
                  <h2>{current.humidity}</h2>
                </div>
              </div>
            </div>
            <div className="other-details">
              <h2>Today</h2>
              <div className="other-details-content">
                <div className="other-details-card">
                  <div className="other-details-card-content">
                    <div className="content-001">
                      <img className="" src={isDay ? `${image?.day}` : `${image?.night}`} />
                    </div>
                    <div className="content-01">
                      <p>{location.localtime.split(" ")[1]}</p>
                      <h3>{current.temp_c}'c</h3>
                    </div>
                  </div>
                </div>
                <div className="other-details-card01">
                  <div className="other-details-card-content01">
                    <div className="content-01">
                      {/* <p>{location.localtime.split(" ")[1]}</p> */}
                      <h4 className="weather-region">{location.name}</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDetail;
