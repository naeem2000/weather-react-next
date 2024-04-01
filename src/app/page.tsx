'use client';

import React, { useEffect, useState } from 'react';
import { makeDay } from './components/functions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from './components/api';
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

	const route = useRouter();

	useEffect(() => {
		//store what is currently in local storage
		const currentDay = localStorage.getItem('days');
		const currentWeather = localStorage.getItem('weather');

		//fetching whats in local storage and updating states accordingly
		if (currentDay && currentWeather) {
			setDays(JSON.parse(currentDay));
			setWeather(JSON.parse(currentWeather));
		}
	}, []);

	const search = async (e: any) => {
		//if a query has been submitted within input field
		if (query) {
			//if enter key has been pressed
			if (e.key === 'Enter') {
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
				localStorage.setItem('current', JSON.stringify(currentWeather));
			}
		} else {
			//error if input is empty
			console.log('please enter city');
		}
	};

	//navigate to next page with params for fetching from respective endpoint
	const goDay = (date: string) => {
		route.push(`/hourly?date=${date}`);
	};

	return (
		<>
			<main>
				<div className='search-box'>
					<input
						type='text'
						placeholder='Search...'
						onChange={(e) => setQuery(e.target.value)}
						value={query}
						onKeyDown={search}
					/>
				</div>
				{weather && weather.city ? (
					<div className='weather'>
						<div className='location-box'>
							<h1>
								{weather.city?.name}, {weather?.city.country}
							</h1>
						</div>
						{currentWeather && (
							<div className='current-weather'>
								<h2>Today</h2>
								<div className='temps'>
									<p>Current: {Math.round(currentWeather.main.temp)}</p>
									<p>Min: {Math.round(currentWeather.main.temp_min)}</p>
									<p>Max: {Math.round(currentWeather.main.temp_max)}</p>
								</div>
								<div className='description'>
									<p>{currentWeather.weather[0].description}</p>
								</div>
								<Image
									src={`https://openweathermap.org/img/w/${currentWeather.weather[0].icon}.png`}
									height={50}
									width={50}
									alt={currentWeather.weather[0].description}
								/>
							</div>
						)}
						<div className='weather-box'>
							{days?.map((day: any, index: any) => (
								<div className='box' onClick={() => goDay(day.dt)} key={index}>
									<div>
										<h2>{makeDay(day.dt_txt)}</h2>
										<div className='temps'>
											<p className={day.main.temp_min < 16 ? 'blue' : 'orange'}>
												Min: {Math.round(day.main.temp_min)}&deg;C
											</p>
											<p className={day.main.temp_min > 16 ? 'orange' : 'blue'}>
												Max: {Math.round(day.main.temp_max)}&deg;C
											</p>
										</div>
										<p>Feels like: {Math.round(day.main.feels_like)}&deg;C</p>
										<div className='description'>
											<p>{day.weather[0].description}</p>
										</div>
									</div>
									<Image
										src={`https://openweathermap.org/img/w/${day.weather[0].icon}.png`}
										height={50}
										width={50}
										alt={day.weather[0].description}
									/>
								</div>
							))}
						</div>
					</div>
				) : (
					'No city selected'
				)}
			</main>
		</>
	);
}
