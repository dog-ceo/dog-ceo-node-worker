export async function processRoutes(pathname: string, routes: Function) {
    let stripped = pathname.replace(/^\/|\/$/g, '');

	for (const [key, value] of Object.entries(routes)) {
		const strippedKey = key.replace(/^\/|\/$/g, '');

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
					args.push(explodedInput[index].replace(/[^a-zA-Z0-9]/g, ''));
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

	return new Response('No matching route.', { status: 404 });
}