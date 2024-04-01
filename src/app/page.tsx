'use client';

import React, { useEffect, useState } from 'react';
import { makeDay } from './components/functions';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { api } from './components/api';
import './page.scss';

export default function Home() {
	const [weather, setWeather] = useState<any>();
	const [days, setDays] = useState<any[]>();
	const [query, setQuery] = useState('');

	const route = useRouter();

	useEffect(() => {
		const currentDay = localStorage.getItem('days');
		const currentWeather = localStorage.getItem('weather');
		if (currentDay && currentWeather) {
			setDays(JSON.parse(currentDay));
			setWeather(JSON.parse(currentWeather));
		}
	}, []);

	const search = async (e: any) => {
		if (query) {
			if (e.key === 'Enter') {
				const response = await fetch(
					`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`
				);
				const result = await response.json();
				setWeather(result);
				setQuery('');
				const tenDays = result.list?.filter(
					(_: any, index: number) => (index + 1) % 8 === 0
				);
				setDays(tenDays);
				localStorage.setItem('weather', JSON.stringify(result));
				localStorage.setItem('days', JSON.stringify(tenDays));
				localStorage.setItem('query', query);
			}
		} else {
			console.log('please enter city');
		}
	};

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
