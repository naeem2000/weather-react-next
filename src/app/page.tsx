'use client';

import { Weather } from '@/modules/modules';
import React, { useEffect, useState } from 'react';

export default function Home() {
	const api = {
		key: 'e4a9403a5ec813396dbfbdefa995c411',
		base: 'https://api.openweathermap.org/data/2.5/',
	};

	const [query, setQuery] = useState('');
	const [weather, setWeather] = useState(() => {
		const savedWeather = localStorage.getItem('weather');
		return savedWeather ? JSON.parse(savedWeather) : null;
	});
	const [days, setDays] = useState(() => {
		const savedDays = localStorage.getItem('days');
		return savedDays ? JSON.parse(savedDays) : [];
	});

	const search = (e: any) => {
		if (e.key === 'Enter') {
			fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
				.then((res) => res.json())
				.then((result) => {
					setWeather(result);
					const fiveDays = result.list?.slice(0, 5) || [];
					setDays(fiveDays);
					setQuery('');
					localStorage.setItem('weather', JSON.stringify(result));
					localStorage.setItem('days', JSON.stringify(fiveDays));
				});
		}
	};

	console.log(weather);
	console.log(days);

	return (
		<>
			<main>
				<div className='search-box'>
					<input
						type='text'
						className='search-bar'
						placeholder='Search...'
						onChange={(e) => setQuery(e.target.value)}
						value={query}
						onKeyDown={search}
					/>
				</div>
				{weather ? (
					<div>
						<div className='location-box'>
							<div className='location'>{(weather as any).city?.name}</div>
						</div>
						<div className='weather-box'>
							<div className='temp'>
								{/* {Math.round((weather as any).main.temp)}°c */}
							</div>
							{/* <div className='weather'>{(weather as any).weather[0].main}</div> */}
						</div>
					</div>
				) : (
					'No weather selected'
				)}
			</main>
		</>
	);
}
