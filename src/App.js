import React from 'react';
import styled from '@emotion/styled';
import { ThemeProvider } from '@emotion/react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import useWeatherAPI from './hook/useWeatherAPI';
import { getMoment, findLocation } from './utils/helpers';
import WeatherCard from './view/WeatherCard';
import WeatherSetting from './view/WeatherSetting';

const Container = styled.div`
  background-color: ${({ theme }) => theme.backgroundColor};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};


const AUTH_KEY = 'CWA-5FF2F0D7-4928-4862-979B-C7E19965E7F5';
// const STATION_NAME = '臺北';
// const LOCATION_NAME_FORECAST = '臺北市';

function App() {
  const storageCity = localStorage.getItem('cityName') || '臺北市';
  const [currentCity, setCurrentCity] = useState(storageCity);
  const currentLocation = useMemo(() => findLocation(currentCity), [currentCity]);
  const { cityName, locationName, sunriseCityName } = currentLocation;

  const [currentPage, setCurrentPage] = useState('WeatherCard');

  const handleCurrentCityChange = (currentCity) => {
    setCurrentCity(currentCity);
  }
  const handleCurrentPageChange = (currentPage) => {
    setCurrentPage(currentPage)
  }
  const [currentTheme, setCurrentTheme] = useState('light');
  const [currentWeather, fetchData] = useWeatherAPI({
    auth_key: AUTH_KEY,
    cityName: cityName,
    locationName: locationName,
  })

  const moment = useMemo(() => getMoment(sunriseCityName), [sunriseCityName]);


  useEffect(() => {
    setCurrentTheme(moment === 'day' ? 'light' : 'dark');
  }, [moment])

  return (
    <ThemeProvider theme={theme[currentTheme]}>
      <Container>
        {currentPage === 'WeatherCard' && (
          <WeatherCard
            currentWeather={currentWeather}
            moment={moment}
            fetchData={fetchData}
            handleCurrentPageChange={handleCurrentPageChange}
          />
        )
        }
        {currentPage === 'WeatherSetting' && (
          <WeatherSetting
            cityName={cityName}
            handleCurrentPageChange={handleCurrentPageChange}
            handleCurrentCityChange={handleCurrentCityChange}
          />
        )
        }
      </Container>
      // </ThemeProvider>
  );
}


export default App;
