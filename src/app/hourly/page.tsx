'use client';

import { dateAndTime, loader, splitDate } from '../components/functions';
import { Hourly, HourlyWeather } from '@/modules/modules';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '../components/Loader';
import { api } from '../components/api';
import Image from 'next/image';
import './hourly.scss';
import '../page.scss';

export default function Page() {
	//state for hourly weather
	const [hourly, setHourly] = useState<Hourly[]>([]);
	//loading state
	const [loading, setLoading] = useState<boolean>(true);
	//weather state before filtering
	const [weather, setWeather] = useState<HourlyWeather>();
	//current location state
	const [area, setArea] = useState<string>('');
	//state for date and time
	const [time, setTime] = useState<string>('');
	const [date, setDate] = useState<string>('');

	const route = useRouter();

	const { load, setLoad } = loader();

	const { formatDate } = dateAndTime();

	console.log('hourly', hourly);

	useEffect(() => {
		//fetch what is currently in local storage
		const currentDay = localStorage.getItem('days');
		const currentWeather = localStorage.getItem('weather');
		const wholeWeather = localStorage.getItem('weather');
		//condition if 2 items not present, go back to home page
		if (!currentDay && !currentWeather) {
			route.push('/');
		}
		//loading of hourly weather from url params from previous page
		try {
			const loadHourly = async () => {
				const params = new URLSearchParams(window.location.search);
				const date = params.get('date');
				const location = localStorage.getItem('query');
				//if date and location params not present, do not proceed any further
				if (!date || !location) return;
				const response = await fetch(
					`${api.base}forecast?q=${location}&units=metric&APPID=${api.key}&date=${date}`
				);
				const result = await response.json();
				//only using the first 5 arrays
				setHourly(result.list.slice(0, 5));
				setArea(location);
				setLoading(false);
			};
			//date and time for header
			setDate(formatDate);
			setWeather(JSON.parse(wholeWeather as string));
			loadHourly();
		} catch (e) {
			console.log('error fetching data', e);
		}
		//loader
		setTimeout(() => {
			setLoad(false);
		}, 2000);
	}, []);

	setInterval(() => {
		//adding new variable to format time with updated time
		const { formatTime: updatedTime } = dateAndTime();
		//updating state with updated time every 1000 ms
		setTime(updatedTime);
	}, 1000);

	return (
		<main>
			{load ? (
				<Loader />
			) : (
				<>
					<div className='weather-header'>
						<div className='country'>
							<h1>{area}</h1>
							<p>
								{date} &nbsp; | &nbsp; {time}
							</p>
						</div>
					</div>
					{weather && (
						<>
							<div className='temps'>
								<div className='temp-left'>
									<p
										className={
											weather && weather.list[0].main.temp < 16
												? 'cold-text'
												: '' || (weather && weather.list[0].main.temp > 27)
												? 'warm-text'
												: ''
										}
									>
										{Math.round(weather.list[0].main.temp)}
									</p>
									<div>
										<span>&deg;C</span>
										<br />
										<span>{weather.list[0].weather[0].description}</span>
									</div>
								</div>
								<div className='temp-right'>
									<Image
										src={`https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`}
										height={50}
										width={50}
										alt='current'
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
												{Math.round(weather.list[0].main.feels_like)}
												&deg;C
											</p>
											<p>
												Humidity: {Math.round(weather.list[0].main.humidity)}%
											</p>
											<p>Wind: {Math.round(weather.list[0].wind.speed)}km/h</p>
										</div>
									</div>
								</div>
							</div>
						</>
					)}
					{loading ? (
						<p>Loading...</p>
					) : (
						<div className='hourly-box'>
							<h2>Hourly Forecast</h2>
							<div className='hourly'>
								{hourly.map((item, index) => (
									<div className='hourly-item' key={index}>
										<p>{` ${splitDate(item.dt_txt).hour}:${
											splitDate(item.dt_txt).minute
										}`}</p>
										<Image
											src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`}
											height={50}
											width={50}
											alt={item.weather[0].description}
										/>
										<p>{Math.round(item.main.temp)}&deg;C</p>
										<p>{item.weather[0].description}</p>
									</div>
								))}
							</div>
						</div>
					)}
				</>
			)}
		</main>
	);
}
