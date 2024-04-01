'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { api } from '../api';

export default function page() {
	const searchParams = useSearchParams();
	const [hourly, setHourly] = useState();

	const date = searchParams.get('date');
	const queryParam = searchParams.get('query');

	const loadHourly = async () => {
		if (!date || !queryParam) return;
		const response = await fetch(
			`${api.base}forecast?q=${queryParam}&units=metric&APPID=${api.key}&date=${date}`
		);
		const result = await response.json();
		const filteredList = result.list.slice(0, 5);
		setHourly(filteredList);
	};

	useEffect(() => {
		loadHourly();
	}, []);

	console.log(hourly);

	return <main>hourly{date}</main>;
}
