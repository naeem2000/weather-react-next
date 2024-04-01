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
	//state for date and time
	const [time, setTime] = useState('');
	const [date, setDate] = useState('');

	const route = useRouter();

	useEffect(() => {
		//store what is currently in local storage
		const currentDay = localStorage.getItem('days');
		const wholeWeather = localStorage.getItem('weather');
		const currentWeather = localStorage.getItem('current');

		//fetching whats in local storage and updating states accordingly
		if (currentDay && wholeWeather && currentWeather) {
			setCurrentWeather(JSON.parse(currentWeather));
			setDays(JSON.parse(currentDay));
			setWeather(JSON.parse(wholeWeather));
		}

		//date and time for header
		const dateAndTime = () => {
			const now = new Date();
			const formatDate = new Intl.DateTimeFormat('en-US', {
				weekday: 'long',
				year: 'numeric',
				month: 'long',
				day: '2-digit',
			}).format(now);
			const formatTime = new Intl.DateTimeFormat('en-US', {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false,
			}).format(now);

			setTime(formatTime);
			setDate(formatDate);
		};
		dateAndTime();
	}, []);

	const search = async (e: any) => {
		//if a query has been submitted within input field
		if (query) {
			//if enter key has been pressed
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
		} else {
			//error if input is empty
			console.log('please enter city');
		}
	};

	//navigate to next page with params for fetching from respective endpoint
	const goDay = (date: string) => {
		route.push(`/hourly?date=${date}`);
	};
	console.log(currentWeather);
	return (
		<>
			<main>
				<div className='weather-header'>
					<div className='country'>
						{weather && <h1>{weather.city.name}</h1>}
						<p>
							{date} &nbsp; | &nbsp; {time}
						</p>
					</div>
					<div className='input-side'>
						<Image src={'/search.png'} width={30} height={30} alt='search' />
						<input
							type='text'
							placeholder='Search your location |'
							onChange={(e) => setQuery(e.target.value)}
							value={query}
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
											Feels like: {Math.round(currentWeather.main.feels_like)}
											&deg;C
										</p>
										<p>Humidity: {Math.round(currentWeather.main.humidity)}%</p>
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
								<div className='box' onClick={() => goDay(day.dt)} key={index}>
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
					'No city selected'
				)}
			</main>
		</>
	);
}
