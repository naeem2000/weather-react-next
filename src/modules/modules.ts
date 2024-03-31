export interface Weather {
	base: string;
	clouds: {};
	cod: number;
	coord: {};
	dt: number;
	id: number;
	main: {};
	name: string;
	sys: {};
	timezone: number;
	visibility: number;
	weather: [
		{
			main: string;
		}
	];
	wind: {};
}
