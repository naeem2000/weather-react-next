'use client';

import { dateAndTime, loader, makeDay } from './components/functions';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from './components/Loader';
import { api } from './components/api';
import Image from 'next/image';
import './page.scss';

export default function Home() {
	//state for weather
	const [weather, setWeather] = useState<any>();
	//state for forecast array from weather
	const [days, setDays] = useState<any[]>();
	//state for current weather
	const [currentWeather, setCurrentWeather] = useState<any>();
	//state for query from input
	const [query, setQuery] = useState<string>('');
	//state for date and time
	const [time, setTime] = useState('');
	const [date, setDate] = useState('');
	//error for empty input
	const [error, setError] = useState<boolean>(false);

	//loader for page
	const { load, setLoad } = loader();

	const { formatDate, formatTime } = dateAndTime();

	const route = useRouter();

	useEffect(() => {
		// Fetch what is currently in local storage
		const currentDay = localStorage.getItem('days');
		const wholeWeather = localStorage.getItem('weather');
		const currentWeather = localStorage.getItem('currentDayWeather');

		// Check if data exists in local storage and is valid JSON
		if (currentDay && wholeWeather && currentWeather) {
			try {
				const parsedCurrentDay = JSON.parse(currentDay);
				const parsedWholeWeather = JSON.parse(wholeWeather);
				const parsedCurrentWeather = JSON.parse(currentWeather);

				// Update states accordingly
				setCurrentWeather(parsedCurrentWeather);
				setDays(parsedCurrentDay);
				setWeather(parsedWholeWeather);
			} catch (error) {
				// Handle JSON parsing errors
				console.error('Error parsing JSON:', error);
				setCurrentWeather(undefined);
				setDays(undefined);
				setWeather(undefined);
			}
			// setLoad(false);
		} else {
			// Handle cases where data doesn't exist in local storage
			setCurrentWeather(undefined);
			setDays(undefined);
			setWeather(undefined);
			// setLoad(false);
		}

		//date and time for header on page load
		setDate(formatDate);
		setTime(formatTime);
		//loader
		// setLoad(false);
	}, []);

	console.log(load);

	const search = async (e: any) => {
		try {
			//if a query has been submitted within input field
			if (query) {
				//awaiting response from API
				const response = await fetch(
					`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`
				);

				//awaiting response from API to parse into JSON
				const result = await response.json();

				//awaiting response from current weather endpoint
				const currentResponse = await fetch(
					`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`
				);

				//awaiting response from current weather endpoint to parse into JSON
				const currentResult = await currentResponse.json();

				//updating states after asynchronous steps
				setCurrentWeather(currentResult);
				setWeather(result);
				setQuery('');

				//filtering that only 1 array be taken for every 10 as the resonse returns 40 arrays containing the same day.
				const tenDays = result.list?.filter(
					(_: any, index: number) => (index + 1) % 8 === 0
				);

				//updating state after filtering for days state and updating local storage
				setDays(tenDays);
				localStorage.setItem('weather', JSON.stringify(result));
				localStorage.setItem('days', JSON.stringify(tenDays));
				localStorage.setItem('query', query);
				localStorage.setItem(
					'currentDayWeather',
					JSON.stringify(currentResult)
				);
				//loader
				setLoad(false);
			} else {
				//error if input is empty
				setError(true);
				setTimeout(() => setError(false), 2000);
				//loader
				// setLoad(false);
			}
			console.log('UNload');
		} catch (e) {
			console.log('error fetching data', e);
		}
		// setLoad(false);
	};

	//navigate to next page with params for fetching from respective endpoint
	const goDay = (date: string) => {
		route.push(`/hourly?date=${date}`);
	};

	return (
		<>
			<main>
				{load ? (
					<Loader />
				) : (
					<>
						{' '}
						<div className='weather-header'>
							<div className='country'>
								{weather && <h1>{weather.city.name}</h1>}
								<p>
									{date} &nbsp; | &nbsp; {time}
								</p>
							</div>
							<div className='input-side'>
								<Image
									src={'/search.png'}
									width={30}
									height={30}
									alt='search'
								/>
								<input
									type='text'
									placeholder={
										!error
											? 'Search your location'
											: 'Please enter a location...'
									}
									onChange={(e) => setQuery(e.target.value)}
									value={query}
									className={error ? 'input-error' : ''}
								/>
								<button onClick={search}>Enter</button>
							</div>
						</div>
						{currentWeather && (
							<>
								<div className='temps'>
									<div className='temp-left'>
										<p>{Math.round(currentWeather.main.temp)}</p>
										<div>
											<span>&deg;C</span>
											<br />
											<span>{currentWeather.weather[0].description}</span>
										</div>
									</div>
									<div className='temp-right'>
										<Image
											src={`https://openweathermap.org/img/wn/${currentWeather.weather[0].icon}@2x.png`}
											height={50}
											width={50}
											alt={currentWeather.weather[0].description}
										/>
										<div className='condition-rows'>
											<div>
												<Image
													src={'/feels.png'}
													width={20}
													height={20}
													alt='feels like'
												/>
												<Image
													src={'/humid.png'}
													width={20}
													height={20}
													alt='humidity'
												/>
												<Image
													src={'/wind.png'}
													width={20}
													height={20}
													alt='wind'
												/>
											</div>
											<div>
												<p>
													Feels like:{' '}
													{Math.round(currentWeather.main.feels_like)}
													&deg;C
												</p>
												<p>
													Humidity: {Math.round(currentWeather.main.humidity)}%
												</p>
												<p>Wind: {Math.round(currentWeather.wind.speed)}km/h</p>
											</div>
										</div>
									</div>
								</div>
							</>
						)}
						{weather && weather.city ? (
							<div className='weather'>
								<div className='weather-box'>
									{days?.map((day: any, index: any) => (
										<div
											className='box'
											onClick={() => goDay(day.dt)}
											key={index}
										>
											<h2>{makeDay(day.dt_txt)}</h2>
											<Image
												src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
												height={90}
												width={90}
												alt={day.weather[0].description}
											/>
											<p>
												{Math.round(day.main.temp_min)}&deg; -{' '}
												{Math.round(day.main.temp_max)}&deg;
											</p>
											<p>{day.weather[0].description}</p>
										</div>
									))}
								</div>
							</div>
						) : (
							<h1 className='no-city'>No location selected</h1>
						)}
					</>
				)}
			</main>
		</>
	);
}
