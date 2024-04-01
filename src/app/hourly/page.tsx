'use client';

import { splitDate } from '../components/functions';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../components/api';
import Image from 'next/image';

export default function Page() {
	const [hourly, setHourly] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const route = useRouter();

	useEffect(() => {
		const currentDay = localStorage.getItem('days');
		const currentWeather = localStorage.getItem('weather');
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
			setLoading(false);
		};

		loadHourly();
	}, []);

	return (
		<main>
			<h1>Hourly Forecast</h1>
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
