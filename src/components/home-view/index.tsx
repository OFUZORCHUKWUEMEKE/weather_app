import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { IHomeWeatherData } from "../../interfaces/IHomeWeatherData";
import {
  getDayandTime,
  getFavLocations,
  getUserLocationCoords,
  isFavourite,
  locationPermissionQuery,
  logError,
  sortByLocationName,
} from "../../utils/functions";
import { localStorageKeys, pageurl, weatherConditionCodesMappedToIcons } from "../../utils/constants";
import { LocationPermissionEnum } from "../../enums/LocationPermissionEnum";
import { IWeather, Location } from "../../interfaces/IWeather";
import { getWeather } from "../../services/weather";
import { ICoords } from "../../interfaces/ICoords";
import {
  localstorageGet,
  localstorageSet,
} from "../../utils/local-storage-helpers";
import './index.scss'
import Modal from "./Modal";
import Weather from "./Weather";
import { useOnlineStatus } from "../../hooks/use-online";
// import { getDayandTime } from "./utils";

const Home = () => {
  const navigate = useNavigate();
  const homeWeatherData = useLoaderData() as IHomeWeatherData;

  const weather = useLoaderData() as IWeather;
  const { isOnline } = useOnlineStatus();

  const { location, current } = weather;

  const [locationPermissionStatus, setLocationPermissionStatus] =
    useState<LocationPermissionEnum>();
  const [userWeather, setUserWeather] = useState<IWeather>();

  const [weatherSearchQuery, setWeatherSearchQuery] = useState("");
  const [weatherResult, setWeatherResult] = useState<IWeather>();

  // const [isFav, setIsFav] = useState<boolean>(!!isFavourite(weather));

  console.log(weather)

  let searchTimeout: number;

  const handleSearch = (query: string) => {
    clearTimeout(searchTimeout);
    if (!query) return setWeatherResult({} as IWeather);

    searchTimeout = setTimeout(() => {
      console.log("====>", query);
      getWeather(query).then((state) => {
        console.log(state)
        setWeatherResult(state)
        console.log(weatherResult)
        console.log('data')
      })
        // .then(setWeatherResult)
        .catch((err: any) => logError(err));
    }, 500);
  };
  const cities = document.querySelector('.cities')


  console.log(weatherResult)



  // console.log(sortByLocationName(homeWeatherData.largestCitiesWeather))


  // console.log(userWeather)
  const { time, number, isDay, isNight, todaysDate } = getDayandTime()

  const redirect = (data: any) => {
    // console.log(data)
    const loc = `${data?.location.lat},${data?.location.lon}`;
    localstorageSet(localStorageKeys.userLocation, loc);
    navigate(pageurl.WEATHER_DETAIL.replace(":location", loc));
  }

  let filterSearch =
     homeWeatherData?.largestCitiesWeather?.filter(weather=>
        weather?.location?.name.toLowerCase() === weatherResult?.location?.name.toLocaleLowerCase()
        // weather?.location?.name.toLowerCase().includes(weatherResult?.location?.name)
      )
      console.log(filterSearch)
      console.log(weatherResult)



    let filter = filterSearch.length===0 ? homeWeatherData.largestCitiesWeather : filterSearch

  

  // let filtered ?

  // const toggleFavorite = (item: IWeather) => {
  //   const {
  //     location: { lat: latitude, lon: longitude },
  //   } = item;
  //   const locsFavourites = getFavLocations();

  //   if (isFavourite(item)) {
  //     // removing from favorites
  //     const updatedFavs = (locsFavourites || []).filter((fav) => {
  //       const [lat, loc] = fav.split(",");
  //       setIsFav(false);
  //       return (
  //         String(latitude) !== lat.trim() && String(longitude) !== loc.trim()
  //       );
  //     });

  //     localstorageSet(localStorageKeys.favorites, updatedFavs);
  //     return;
  //   }

  //   const updatedFavs = (locsFavourites || []).concat(
  //     `${latitude},${longitude}`
  //   );
  //   setIsFav(true);
  //   localstorageSet(localStorageKeys.favorites, updatedFavs);
  // };
  





  useEffect(() => {
    locationPermissionQuery().then(({ state }) => {
      // console.log(state)
      if (state === "granted") {
        setLocationPermissionStatus(LocationPermissionEnum.GRANTED);
        const onSuccess = (coords: ICoords) => {
          const loc = `${coords?.latitude},${coords?.longitude}`;
          localstorageSet(localStorageKeys.userLocation, loc);
          getWeather(loc).then(setUserWeather);
          console.log("onload,", coords);
        };
        const status = getUserLocationCoords(onSuccess);

        if (status.failed) {
          const localLocation = localstorageGet<string>(
            localStorageKeys.userLocation
          );
          if (!localLocation) {
            return;
          }
          getWeather(localLocation).then(setUserWeather);
        }
        return;
      } else if (state === "prompt") {
        setLocationPermissionStatus(LocationPermissionEnum.PROMPT);
        return;
      }
      // do nothing if the permission was denied.
      setLocationPermissionStatus(LocationPermissionEnum.DENIED);
      localStorage.removeItem(localStorageKeys.userLocation);
    });
  }, []);

  const image = weatherConditionCodesMappedToIcons.find((weather) => weather.code === userWeather?.current.condition.code)
  // console.log(image)
  const requestLocationPerms = () => {
    const onSuccess = (coords: ICoords) => {
      const loc = `${coords?.latitude},${coords?.longitude}`;
      localstorageSet(localStorageKeys.userLocation, loc);

      navigate(pageurl.WEATHER_DETAIL.replace(":location", loc));
    };

    const onError = (err: GeolocationPositionError) => {
      if (err.code === err.PERMISSION_DENIED) {
        return;
      }

      const localLocation = localstorageGet<string>(
        localStorageKeys.userLocation
      );

      if (!localLocation) {
        return;
      }

      navigate(pageurl.WEATHER_DETAIL.replace(":location", localLocation));
    };

    getUserLocationCoords(onSuccess, onError);
  };
  // let location:Location
  //  {location} = userWeather
  // console.log(location)
  return (
    <div>
      {/* {userWeather && <div>{JSON.stringify(userWeather)}</div>} */}
      {!!(homeWeatherData?.favouritesWeather?.length > 1) &&
        // JSON.stringify(sortByLocationName(homeWeatherData.favouritesWeather))
        <>
          <div>
            <h2>Whats poppings</h2>
          </div>
        </>
      }
      {!!(homeWeatherData?.largestCitiesWeather?.length > 1) &&
        // JSON.stringify(
        //   sortByLocationName(homeWeatherData.largestCitiesWeather)
        // )
        <>
          <div className="container">
            <div className="inside">
              <h2 className="heading_one">Forecast Report</h2>
              <div className="stats_001">
                <h2>Today</h2>
                <p>{todaysDate}</p>
              </div>
              {userWeather && (
                <>
                  <div className="weather">
                    <div className="inner_weather">
                      {/* <h2 className="temp--location">{userWeather.location.name}</h2> */}
                      <div className="">
                        {/* <h2 className="temp">{userWeather.current.temp_c}'c</h2> */}
                        <img src={isDay ? `${image?.day}` : `${image?.night}`} />
                      </div>
                      <h2 className="temp">{userWeather.current.temp_c}'c</h2>
                      <div className="weat_01">
                        <h3>{userWeather.location.name}</h3>
                        <h3>{userWeather.location.localtime.split(" ")[1]}</h3>
                        <p className="p_tag">Feels Like <span>{userWeather.current.feelslike_c} 'c</span></p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="my_weather">
                <div>
                  <h2 className="top_cities">Top Cities</h2>
                  <div className="input_container">
                    <input
                      type="search"
                      name="weather-search"
                      id="weather-search"
                      className="search_input"
                      placeholder="Search Cities..."
                      value={weatherSearchQuery}
                      onChange={({ target: { value } }) => {
                        setWeatherSearchQuery(value);
                        handleSearch(value);
                      }}
                    />
                  </div>
                  <div className="inner_cities">
                    {/* homeWeatherData.largestCitiesWeather.map */}
                    {filter.map((weather, index) => {
                      const image = weatherConditionCodesMappedToIcons.find((weat) => weat.code === weather.current.condition.code)
                      return (
                        // Weather Components
                        // <Weather {...weather} {...image} key={index}/>
                        <div className="cities" onClick={() => redirect(weather)} key={index}>
                          <div className="cities_inner">
                            <h2>{weather.location.name}</h2>
                            {/* <p>{weather.location.country}</p> */}
                            <p>{weather.location.localtime.split(" ")[1]}</p>
                            <p className="feels">Feels Like <span>{weather.current.feelslike_c}</span> 'c</p>
                          </div>
                          <div className="cities_inner_01">
                            <h3 className="h2_tag">{weather.current.temp_c}'c</h3>
                            <p className="cities_inner_text">{weather.current.condition.text}</p>
                          </div>
                          <div className="cities_inner_02">
                            <img src={isDay ? `${image?.day}` : `${image?.night}`} />
                          </div>
                        </div>
                      )
                    }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
      {/* changed from locationPermissionStatus === LocationPermissionEnum.PROMPT to locationPermissionStatus === LocationPermissionEnum.PROMPT || locationPermissionStatus === LocationPermissionEnum.DENIED  */}
      {locationPermissionStatus === LocationPermissionEnum.PROMPT || locationPermissionStatus === LocationPermissionEnum.DENIED && (
        // <div style={{ color: "red" }} onClick={() => requestLocationPerms()}>
        //   get perm modal
        // </div>
        <Modal />
      )}
    </div>
  );
};

export default Home;
