import { Env } from "./libraries/data"

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
	getBreedImageRandomCount,
	listSingleRandomBreedWithSub,
} from "./libraries/breeds"

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const { pathname } = new URL(request.url);

		const routes = {
			'/api/breeds/list/all': async () => { 
				return responseTwoDimensional(Object.fromEntries(await listAllBreeds(env)));
			},
			'/api/breeds/list/all/random': async () => { 
				return responseTwoDimensional(Object.fromEntries(await listSingleRandomBreedWithSub(env)));
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
				console.log(breed1);
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
				return responseOneDimensional(await getBreedImageRandomCount(env, count));
			},
			'/api/breed/:breed1': async (breed1: string) => { 
				return new Response('NOT FOUND');
			},
			'/api/breed/:breed1/:breed2': async (breed1: string, breed2: string) => { 
				return new Response('NOT FOUND');
			},
			// /breeds/list/all/random
			// /breeds/list/all/random/10
			// /breeds/list/random
			// /breeds/list/random/10
			// /breed/{breed}/list/random
			// /breed/{breed}/list/random/10
			// /breed/{breed}
			// /breed/{breed}/breed2
			// /api/breed/:breed1/images/random/:count
			// /breed/{breed}/{breed2}/images/random
			// /breed/{breed}/{breed2}/images/random/count
			// https://dog.ceo/api/breeds/image/random/9/alt
			// application/xml
		};

		return processRoutes(pathname, routes);
	}
}
