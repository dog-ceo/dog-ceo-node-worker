import { notFound } from "./response"

const Router = require('@medley/router');
const router = new Router();

function addRoute(method: string, path: string, handler: any) {
	const store = router.register(path);
	store[method] = handler;
}

export async function processRoutes(pathname: string, routes: Function) {
	for (const [route, handler] of Object.entries(routes)) {
		addRoute('GET', route, handler);
	}

	const match = router.find(pathname);

	if (match !== null) {
		const handler = match.store['GET'];
		const params = match.params;
		const values = Object.values(params);
		return handler(...values);
	}

	return notFound();
}