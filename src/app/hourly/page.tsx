'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function page() {
	const router = useRouter();
	const { query } = router;

	const search = query.search;

	useEffect(() => {
		console.log(search);
	}, [search]);

	return <main>hourly</main>;
}
