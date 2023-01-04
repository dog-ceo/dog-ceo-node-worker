import { Env } from "./libraries/s3"

import { processRoutes } from "./libraries/router"

import {
	responseString,
	responseOneDimensional,
	responseTwoDimensional,
} from "./libraries/response"

import { 
	listAllBreeds,
	listMainBreeds,
	listSubBreeds,
	getBreedImages,
	getBreedImageRandom,
	getBreedImagesRandom,
} from "./libraries/breeds"

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const { pathname } = new URL(request.url);

		const routes = {
			'/api/breeds/list/all': async () => { 
				return responseTwoDimensional(Object.fromEntries(await listAllBreeds(env)));
			},
			'/api/breeds/list': async () => { 
				return responseTwoDimensional(Object.fromEntries(await listMainBreeds(env)));
			},
			'/api/breeds/image/random': async () => {
				return responseString(await getBreedImageRandom(env));
			},
			'/api/breed/:breed1/list': async(breed1: string) => {
				return responseTwoDimensional(Object.fromEntries(await listSubBreeds(env, breed1)));
			},
			'/api/breed/:breed1/images': async (breed1: string) => {
				return responseOneDimensional(await getBreedImages(env, breed1, ''));
			},
			'/api/breed/:breed1/:breed2/images': async (breed1: string, breed2: string) => { 
				return responseOneDimensional(await getBreedImages(env, breed1, breed2));
			},
			'/api/breed/:breed1/images/random': async (breed1: string) => { 
				return responseString(await getBreedImagesRandom(env, breed1, ''));
			},
			'/api/breed/:breed1/:breed2/images/random': async (breed1: string, breed2: string) => { 
				return responseString(await getBreedImagesRandom(env, breed1, breed2));
			},
			'/api/breeds/image/random/:count': async (count: number) => { 
				return new Response('NOT FOUND');
			},
			'/api/breed/:breed1': async (breed1: string) => { 
				return new Response('NOT FOUND');
			},
			'/api/breed/:breed1/:breed2': async (breed1: string, breed2: string) => { 
				return new Response('NOT FOUND');
			},
		};

		return processRoutes(pathname, routes);
	}
}

function getMultipleRandom(arr, num) {
	const shuffled = [...arr].sort(() => 0.5 - Math.random());
  
	return shuffled.slice(0, num);
  }