import { Env } from "./libraries/s3"
import { processRoutes } from "./libraries/router"

import { 
	listAllBreeds,
	listMasterBreeds,
	listSubBreeds,
	getBreedImages,
} from "./libraries/breeds"

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const { pathname } = new URL(request.url);

		const routes = {
			'/api/breeds/list/all': async () => { 
				var breeds = await listAllBreeds(env);
				var json = JSON.stringify({'status': 'success', 'message': Object.fromEntries(breeds)});
				return new Response(json, {headers: {'content-type': 'application/json;charset=UTF-8'}})
			},
			'/api/breeds/list': async () => { 
				var breeds = await listMasterBreeds(env);
				var json = JSON.stringify({'status': 'success', 'message': Object.fromEntries(breeds)});
				return new Response(json, {headers: {'content-type': 'application/json;charset=UTF-8'}});
			},
			'/api/breeds/image/random': async () => {
				return new Response('NOT FOUND');
			},
			'/api/breed/:breed1/list': async(breed1: string) => {
				const breeds = await listSubBreeds(env, breed1);
			    const json = JSON.stringify({'status': 'success', 'message': Object.fromEntries(breeds)});
			    return new Response(json, {headers: {'content-type': 'application/json;charset=UTF-8'}});
			},
			'/api/breed/:breed1/images': async (breed1: string) => {
				const breeds = await getBreedImages(env, breed1, '');
			    const json = JSON.stringify({'status': 'success', 'message': breeds});
			    return new Response(json, {headers: {'content-type': 'application/json;charset=UTF-8'}});
			},
			'/api/breed/:breed1/:breed2/images': async (breed1: string, breed2: string) => { 
				const breeds = await getBreedImages(env, breed1, breed2);
			    const json = JSON.stringify({'status': 'success', 'message': breeds});
			    return new Response(json, {headers: {'content-type': 'application/json;charset=UTF-8'}});
			},
			'/api/breed/:breed1/images/random': async (breed1: string) => { 
				return new Response('NOT FOUND');
			},
			'/api/breed/:breed1/:breed2/images/random': async (breed1: string, breed2: string) => { 
				return new Response('NOT FOUND');
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