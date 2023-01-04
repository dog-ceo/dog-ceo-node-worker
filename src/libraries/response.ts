export function responseTwoDimensional(data: { [k: string]: string[]; }): Response {
	const json = JSON.stringify({'status': 'success', 'message': data});
	return new Response(json, {headers: {'content-type': 'application/json;charset=UTF-8'}})
}

export function responseOneDimensional(data: string[]): Response  {
	const json = JSON.stringify({'status': 'success', 'message': data});
	return new Response(json, {headers: {'content-type': 'application/json;charset=UTF-8'}})
}

export function responseString(data: string): Response  {
	const json = JSON.stringify({'status': 'success', 'message': data});
	return new Response(json, {headers: {'content-type': 'application/json;charset=UTF-8'}})
}
