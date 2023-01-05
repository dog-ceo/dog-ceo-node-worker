const headers = {
	'content-type': 'application/json;charset=UTF-8',
	'access-control-allow-origin': '*',
	// Cache for 1 hour
	'cache-control': 's-maxage=3600, max-age=3600',
}

export function responseTwoDimensional(data: { [k: string]: string[]; }): Response {
	const json = JSON.stringify({'status': 'success', 'message': data});
	return new Response(json, {headers: headers})
}

export function responseOneDimensional(data: string[]): Response  {
	const json = JSON.stringify({'status': 'success', 'message': data});
	return new Response(json, {headers: headers})
}

export function responseString(data: string): Response  {
	const json = JSON.stringify({'status': 'success', 'message': data});
	return new Response(json, {headers: headers})
}
