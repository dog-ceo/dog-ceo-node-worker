export interface Alt {
	url: string,
	altText: string,
}

let headers = {
	'content-type': 'application/json;charset=UTF-8',
	'access-control-allow-origin': '*',
	// Cache for 1 hour
	'cache-control': 's-maxage=3600, max-age=3600',
}

export function responseTwoDimensional(data: { [k: string]: string[]; }): Response {
	const json = JSON.stringify({'status': 'success', 'message': data});
	return new Response(json, {headers: headers})
}

export function responseTwoDimensionalNoCache(data: { [k: string]: string[]; }): Response {
	const json = JSON.stringify({'status': 'success', 'message': data});
	headers["cache-control"] = '';
	return new Response(json, {headers: headers})
}

/*
export function responseTwoDimensionalWithAlt(data: Alt[]): Response {
	const json = JSON.stringify({'status': 'success', 'message': data});
	return new Response(json, {headers: headers})
}
*/

export function responseTwoDimensionalWithAltNoCache(data: Alt[]): Response {
	const json = JSON.stringify({'status': 'success', 'message': data});
	headers["cache-control"] = '';
	return new Response(json, {headers: headers})
}

export function responseOneDimensional(data: string[]): Response {
	const json = JSON.stringify({'status': 'success', 'message': data});
	return new Response(json, {headers: headers})
}

export function responseOneDimensionalNoCache(data: string[]): Response {
	const json = JSON.stringify({'status': 'success', 'message': data});
	headers["cache-control"] = '';
	return new Response(json, {headers: headers})
}

/*
export function responseString(data: string): Response {
	const json = JSON.stringify({'status': 'success', 'message': data});
	return new Response(json, {headers: headers})
}
*/

export function responseStringNoCache(data: string): Response {
	const json = JSON.stringify({'status': 'success', 'message': data});
	headers["cache-control"] = '';
	return new Response(json, {headers: headers})
}

export function routeNotFound(): Response {
	return new Response('No matching route.', { status: 404 })
}

export function breedNotFound(): Response {
	const json = JSON.stringify({'status': 'error', 'message': 'Breed not found.'});
	return new Response(json, { status: 404 })
}