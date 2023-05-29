import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import "./index.scss";
import { IWeather } from "../../../interfaces/IWeather";
import { getWeather } from "../../../services/weather";
import { pageurl } from "../../../utils/constants";
import { logError } from "../../../utils/functions";
import { getDayandTime } from "../../home-view/utils";

const Layout: React.FC = (props) => {
  const [weatherSearchQuery, setWeatherSearchQuery] = useState("");
  const [weatherResult, setWeatherResult] = useState<IWeather>();

  let searchTimeout: number;

  const handleSearch = (query: string) => {
    clearTimeout(searchTimeout);
    if (!query) return setWeatherResult({} as IWeather);

    searchTimeout = setTimeout(() => {
      console.log("====>", query);
      getWeather(query)
        .then(setWeatherResult)
        .catch((err: any) => logError(err));
    }, 500);
  };

  const getCoord =()=> `${weatherResult?.location?.lat},${weatherResult?.location?.lon}`;

  const {time,number , isDay , isNight} = getDayandTime()
  console.log({time,number})

  return (
    <div className={isNight ? "back_ground_dark":"back_ground_light"}>
      {/* <img src='/background/art.jpg' style={{width:'100vw'}}/> */}
      {/* <input
        type="search"
        name="weather-search"
        id="weather-search"
        value={weatherSearchQuery}
        onChange={({ target: { value } }) => {
          setWeatherSearchQuery(value);
          handleSearch(value);
        }}
      /> */}
      {weatherResult?.location && <Link to={pageurl.WEATHER_DETAIL.replace(":location", getCoord())}>
        {JSON.stringify(weatherResult)}
      </Link>}

      <br />
      <Outlet />
    </div>
  );
};

export default Layout;
