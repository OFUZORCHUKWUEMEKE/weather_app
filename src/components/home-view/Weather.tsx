import React from 'react'
import { IWeather } from '../../interfaces/IWeather'
import { IWeatherConditionIcons } from '../../interfaces/IWeatherConditionIcons'
import { getDayandTime } from '../../utils/functions'

type Props = {}

const Weather = (weather: IWeather, image: IWeatherConditionIcons) => {
    const { time, number, isDay, isNight, todaysDate } = getDayandTime()
    console.log(image)
    return (
        <div className="cities">
            <div className="cities_inner">
                <h2>{weather.location.name}</h2>
                {/* <p>{weather.location.country}</p> */}
                <p>{weather.location.localtime.split(" ")[1]}</p>
                <p className="feels">Feels Like <span>{weather.current.feelslike_c}</span> 'c</p>
            </div>
            <div className="cities_inner">
                <h3 className="h2_tag">{weather.current.temp_c}'c</h3>
            </div>
            <div className="cities_inner">
                <img src={isDay ? `${image?.day}` : `${image?.night}`} style={{ width: '100%', height: '70px', objectFit: 'contain' }} />
            </div>
        </div>
    )
}

export default Weather