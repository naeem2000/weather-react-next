import Footer from './components/Footer';
import type { Metadata } from 'next';
import './globals.scss';

export const metadata: Metadata = {
	title: 'Forecast Hub',
	description: 'Developed with React.JS and Next.JS',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body>
				{children}
				<Footer />
			</body>
		</html>
	);
}
