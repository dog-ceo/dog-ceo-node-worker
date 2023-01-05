import { Env } from "./libraries/data"

import { processRoutes } from "./libraries/router"

import {
	responseString,
	responseOneDimensional,
	responseTwoDimensional,
} from "./libraries/response"

import {
	Params,
	listAllBreeds,
	listMainBreeds,
	listSubBreeds,
	getBreedImages,
	getBreedImageRandom,
	getBreedImagesRandom,
	getBreedImageRandomCount,
	listRandomMainBreeds,
	listRandomBreedsWithSub,
	listRandomSubBreeds,
} from "./libraries/breeds"

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const { pathname } = new URL(request.url);

		const routes = {
			'/api/breeds/list/all': async () => {
				return responseTwoDimensional(Object.fromEntries(await listAllBreeds(env)));
			},
			'/api/breeds/list/all/random': async () => {
				const params = {count: 1} as Params;
				return responseTwoDimensional(Object.fromEntries(await listRandomBreedsWithSub(env, params)));
			},
			'/api/breeds/list/all/random/:count': async (params: Params) => {
				return responseTwoDimensional(Object.fromEntries(await listRandomBreedsWithSub(env, params)));
			},
			'/api/breeds/list': async () => {
				const breeds = await listMainBreeds(env);
				return responseOneDimensional(Array.from(breeds.keys()));
			},
			'/api/breeds/list/random': async () => {
				const params = {count: 1} as Params;
				const breeds = await listRandomMainBreeds(env, params);
				return responseString(Array.from(breeds.keys())[0]);
			},
			'/api/breeds/list/random/:count': async (params: Params) => {
				const breeds = await listRandomMainBreeds(env, params);
				return responseOneDimensional(Array.from(breeds.keys()));
			},
			'/api/breeds/image/random': async () => {
				return responseString(await getBreedImageRandom(env));
			},
			'/api/breed/:breed1/list': async(params: Params) => {
				return responseTwoDimensional(Object.fromEntries(await listSubBreeds(env, params)));
			},
			'/api/breed/:breed1/list/random': async(params: Params) => {
				const breeds = await listRandomSubBreeds(env, params);
				return responseString(breeds[0]);
			},
			'/api/breed/:breed1/list/random/:count': async(params: Params) => {
				return responseOneDimensional(await listRandomSubBreeds(env, params));
			},
			'/api/breed/:breed1/images': async (params: Params) => {
				return responseOneDimensional(await getBreedImages(env, params));
			},
			'/api/breed/:breed1/:breed2/images': async (params: Params) => {
				return responseOneDimensional(await getBreedImages(env, params));
			},
			'/api/breed/:breed1/images/random': async (params: Params) => {
				return responseString(await getBreedImagesRandom(env, params));
			},
			'/api/breed/:breed1/:breed2/images/random': async (params: Params) => {
				return responseString(await getBreedImagesRandom(env, params));
			},
			'/api/breeds/image/random/:count': async (params: Params) => {
				return responseOneDimensional(await getBreedImageRandomCount(env, params));
			},
			'/api/breed/:breed1': async (params: Params) => {
				return new Response('NOT FOUND');
			},
			'/api/breed/:breed1/:breed2': async (params: Params) => {
				return new Response('NOT FOUND');
			},
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
