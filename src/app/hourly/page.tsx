'use client';

import { dateAndTime, splitDate } from '../components/functions';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../components/api';
import '../page.scss';
import Image from 'next/image';

export default function Page() {
	const [hourly, setHourly] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [weather, setWeather] = useState<any>();
	const [area, setArea] = useState<string>('');
	//state for date and time
	const [time, setTime] = useState<string>('');
	const [date, setDate] = useState<string>('');
	const route = useRouter();

	const { formatDate, formatTime } = dateAndTime();

	useEffect(() => {
		const currentDay = localStorage.getItem('days');
		const currentWeather = localStorage.getItem('weather');
		const wholeWeather = localStorage.getItem('weather');
		if (!currentDay && !currentWeather) {
			route.push('/');
		}
		const loadHourly = async () => {
			const params = new URLSearchParams(window.location.search);
			const date = params.get('date');
			const location = localStorage.getItem('query');
			if (!date || !location) return;
			const response = await fetch(
				`${api.base}forecast?q=${location}&units=metric&APPID=${api.key}&date=${date}`
			);
			const result = await response.json();
			setHourly(result.list.slice(0, 5));
			setArea(location);
			setLoading(false);
		};
		//date and time for header
		setDate(formatDate);
		setTime(formatTime);
		setWeather(JSON.parse(wholeWeather));
		loadHourly();
	}, []);
	console.log(weather);
	return (
		<main>
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
							<p>{Math.round(weather.list[0].main.temp)}</p>
							<div>
								<span>&deg;C</span>
								<br />
								<span>{weather.list[0].main.description}</span>
							</div>
						</div>
						<div className='temp-right'>
							<Image
								src={`https://openweathermap.org/img/wn/${weather.list[0].weather[0].icon}@2x.png`}
								height={50}
								width={50}
								alt={weather.list[0].description}
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
									<Image src={'/wind.png'} width={20} height={20} alt='wind' />
								</div>
								<div>
									<p>
										Feels like: {Math.round(weather.list[0].feels_like)}
										&deg;C
									</p>
									<p>Humidity: {Math.round(weather.list[0].main.humidity)}%</p>
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
				<div>
					<p>
						{splitDate(hourly[0].dt_txt).year}-
						{splitDate(hourly[0].dt_txt).month}-
						{splitDate(hourly[0].dt_txt).day}
					</p>
					{hourly.map((item, index) => (
						<div key={index}>
							<p>{` ${splitDate(item.dt_txt).hour}:${
								splitDate(item.dt_txt).minute
							}:${splitDate(item.dt_txt).second}`}</p>
							<p>{Math.round(item.main.temp)}</p>
							<p>{item.weather[0].description}</p>
							<Image
								src={`https://openweathermap.org/img/w/${item.weather[0].icon}.png`}
								height={50}
								width={50}
								alt={item.weather[0].description}
							/>
						</div>
					))}
				</div>
			)}
		</main>
	);
}
