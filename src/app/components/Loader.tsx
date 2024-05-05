import loaderAnimation from '../../../public/lottie-loader.json';
import Lottie from 'lottie-react';
import React from 'react';

export default function Loader() {
	return (
		<div className='loader'>
			<Lottie className='lottie' animationData={loaderAnimation} loop={true} />
		</div>
	);
}
