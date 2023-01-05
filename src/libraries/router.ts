import { Params } from "./breeds"
import { notFound } from "./response"

export interface Route {
	route: string,
	handler: Function,
}

const Router = require('@medley/router');
const router = new Router();

function addRoute(method: string, path: string, handler: Function): void{
	const store = router.register(path);
	store[method] = handler;
}

export async function processRoutes(pathname: string, routes: Array<Route>): Promise<Response> {
	for (const [key, route] of Object.entries(routes)) {
		addRoute('GET', route.route, route.handler);
	}

	const match = router.find(pathname);

	if (match !== null) {
		const handler = match.store['GET'];
		const params = match.params as Params;
		return handler(params);
	}

	return notFound();
}