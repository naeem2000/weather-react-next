'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { api } from '../api';

export default function Page() {
	const [hourly, setHourly] = useState<any[]>([]);
	const searchParams = useSearchParams();

	const date = searchParams.get('date');
	const location = localStorage.getItem('query');

	const loadHourly = async () => {
		if (!date || !location) return;
		const response = await fetch(
			`${api.base}forecast?q=${location}&units=metric&APPID=${api.key}&date=${date}`
		);
		const result = await response.json();
		setHourly(result.list.slice(0, 5));
	};

	useEffect(() => {
		loadHourly();
	}, []);

	const splitDate = (resDate: string) => {
		const dateParts = resDate.split(' ');
		const date = dateParts[0];
		const time = dateParts[1];
		const [year, month, day] = date.split('-');
		const [hour, minute, second] = time.split(':');
		return { year, month, day, hour, minute, second };
	};

	return (
		<main>
			<h1>Hourly Forecast</h1>
			{hourly.length > 0 ? (
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
			) : (
				<p>No data available</p>
			)}
		</main>
	);
}
