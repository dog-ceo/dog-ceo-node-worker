export interface Env {}

import { 
	listAllBreeds,
	listMasterBreeds,
	listSubBreeds,
} from "./libraries/breeds"

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const { protocol, pathname } = new URL(request.url);

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
			'/breeds/image/random': async () => { 
				return new Response('LOL');
			},
			'/api/breed/:breed/list': async(breedFromUrl: string) => {
				const breeds = await listSubBreeds(env, breedFromUrl);
			    const json = JSON.stringify({'status': 'success', 'message': Object.fromEntries(breeds)});
			    return new Response(json, {headers: {'content-type': 'application/json;charset=UTF-8'}});
			}
			/**
			/breed/{breed1}/list
			/breed/{breed1}/images
			/breed/{breed1}/{breed2}/images
			/breed/{breed1}/images/random
			/breed/{breed1}/{breed2}/images/random
			/breeds/image/random/{count}
			/breed/{breed1}
			/breed/{breed1}/{breed2}
			*/
		};

		let stripped = pathname.replace(/^\/|\/$/g, '');

		for (const [key, value] of Object.entries(routes)) {
			const strippedKey = key.replace(/^\/|\/$/g, '');

			// Matched without any vars detected
			if (stripped === strippedKey) {
				return value();
			}

			// Process the variables in the urls
			if (key.includes(':')) {
				// Split both up by slash
				const explodedRoute = strippedKey.split('/');
				const explodedInput = stripped.split('/');
				const args: string[] = [];

				// Do they have the same number of segments?
				if (explodedRoute.length === explodedInput.length) {
					// Loop through them
					explodedRoute.forEach(function (item, index) {
						// if it contains a :
						if (explodedRoute[index].includes(':')) {
							// remove any weird characters and add it to the args array
							args.push(explodedInput[index].replace(/[^a-zA-Z0-9]/g, ""));
						} else {
							// segment mismatch, skip current route
							if (explodedRoute[index] !== explodedInput[index]) {
								return; // means `continue` in js
							}
						}
					});

					return value(...args);
				}
			}
		}

		return new Response('NO ROUTE MATEHCED', { status: 404 });
	}
}