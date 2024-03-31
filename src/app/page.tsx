'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Home() {
	const route = useRouter();

	const api = {
		key: 'e4a9403a5ec813396dbfbdefa995c411',
		base: 'https://api.openweathermap.org/data/2.5/',
	};

	const [weather, setWeather] = useState<any>();
	const [query, setQuery] = useState('');
	const [days, setDays] = useState<any[]>();

	const search = (e: any) => {
		if (e.key === 'Enter') {
			fetch(`${api.base}forecast?q=${query}&units=metric&APPID=${api.key}`)
				.then((res) => res.json())
				.then((result) => {
					setWeather(result);
					const tenDays = result.list?.filter(
						(_: any, index: number) => (index + 1) % 8 === 0
					);
					setDays(tenDays);
					setQuery('');
					localStorage.setItem('weather', JSON.stringify(result));
					localStorage.setItem('days', JSON.stringify(tenDays));
				});
		}
	};

	useEffect(() => {
		const currentDay = localStorage.getItem('days');
		const currentWeather = localStorage.getItem('weather');
		if (currentDay !== null) {
			setDays(JSON.parse(currentDay));
		}
		if (currentWeather !== null) {
			setWeather(JSON.parse(currentWeather));
		}
	}, []);

	const makeDay = (dateStr: string) => {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { weekday: 'long' });
	};

	console.log(weather);
	console.log('days', days);

	const goDay = (date: string) => {
		route.push(`/hourly?date=${date}`);
	};

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
							<div className='location'>
								<h1>
									{weather.city?.name}, {weather?.city.country}
								</h1>
							</div>
						</div>
						<div className='weather-box'>
							<div className='temp'>
								{days?.map((day: any, index: any) => (
									<div onClick={() => goDay(day.dt)} key={index}>
										<label>{makeDay(day.dt_txt)}</label>
										<div className='temps'>
											<p>Min: {Math.round(day.main.temp_min)}C</p>
											<p>Max: {Math.round(day.main.temp_max)}C</p>
										</div>
										<p>
											Currently feels like: {Math.round(day.main.feels_like)}
										</p>
										<p>{day.weather[0].description}</p>
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
					</div>
				) : (
					'No weather selected'
				)}
			</main>
		</>
	);
}
