import { useState, useEffect, useCallback } from 'react';

const FetchWeather = ({ auth_key, locationName }) => {
    return fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=${auth_key}&StationName=${locationName}`)
        .then((response) => response.json())
        .then((data) => {
            const recordsStation = data.records.Station[0];
            return {
                location: recordsStation.GeoInfo.CountyName,
                windSpeed: recordsStation.WeatherElement.WindSpeed,
                temperature: recordsStation.WeatherElement.AirTemperature,
                observationTime: recordsStation.ObsTime.DateTime,
            }
        });
}

const FetchWeatherForecast = ({ auth_key, cityName }) => {
    return fetch(`https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=${auth_key}&locationName=${cityName}`)
        .then((response) => response.json())
        .then((data) => {
            const recordsLocation = data.records.location[0];
            const weatherElement = recordsLocation.weatherElement.reduce((neededElements, item) => {
                if (['Wx', 'PoP', 'CI'].includes(item.elementName)) {
                    neededElements[item.elementName] = item.time[0].parameter;
                }
                return neededElements;
            }, {})
            return {
                description: weatherElement.Wx.parameterName,
                weatherCode: weatherElement.Wx.parameterValue,
                rainPossibility: weatherElement.PoP.parameterName,
                comfortability: weatherElement.CI.parameterName,
            }
        });
}


const useWeatherAPI = ({ locationName, cityName, auth_key }) => {
    const [currentWeather, setCurrentWeather] = useState({
        location: '',
        description: '',
        windSpeed: 0,
        temperature: 0,
        rainPossibility: 0,
        observationTime: new Date(),
        comfortability: '',
        weatherCode: 0,
        isLoading: true,
    });

    const fetchData = useCallback(async () => {
        setCurrentWeather((prevState) => ({
            ...prevState,
            isLoading: true,
        }));
        const [currentWeather, weatherForecast] = await Promise.all([FetchWeather({ auth_key, locationName }), FetchWeatherForecast({ auth_key, cityName })])
        setCurrentWeather({
            ...currentWeather,
            ...weatherForecast,
            isLoading: false,
        })
    }, [auth_key, locationName, cityName])

    useEffect(() => {
        fetchData();
    }, [fetchData])

    return [currentWeather, fetchData]
}

export default useWeatherAPI;