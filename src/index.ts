export interface Env {
	BUCKET: R2Bucket;
}

//import { getClient, getObjectsByDelimeterAndPrefix } from "./libraries/s3"
import { listAllBreeds } from "./libraries/breeds"

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const { protocol, pathname } = new URL(request.url);

		switch (pathname) {
			case '/api':
				return new Response('Api root');

			case '/api/breeds/list/all':
				const breeds = await listAllBreeds(env);
				const json = JSON.stringify({'status': 'success', 'message': Object.fromEntries(breeds)});
				return new Response(json, {headers: {'content-type': 'application/json;charset=UTF-8'}})
		}

		return new Response('NO ROUTE MATEHCED', { status: 404 });
	}
}