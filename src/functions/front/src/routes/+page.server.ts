import { env } from '$env/dynamic/private';
import type { PageServerLoad, Actions } from './$types';

interface ClickResponse {
	clicks: number;
}

const backendUrl = env.BACKEND_URL;

export const load: PageServerLoad = async ({ fetch }) => {
	const response = await fetch(`${backendUrl}/api/clicks`);
	const data: ClickResponse = await response.json();
	return { clicks: data.clicks };
};

export const actions: Actions = {
	increment: async ({ fetch }) => {
		const response = await fetch(`${backendUrl}/api/clicks/incr`);
		const data: ClickResponse = await response.json();
		return { clicks: data.clicks };
	}
};
