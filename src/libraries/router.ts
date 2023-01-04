export async function processRoutes(pathname: string, routes: Function) {
    let stripped = pathname.replace(/^\/|\/$/g, '');

	for (const [key, value] of Object.entries(routes)) {
		const strippedKey = key.replace(/^\/|\/$/g, '');

		// Split both up by slash
		const explodedRoute = strippedKey.split('/');
		const explodedInput = stripped.split('/');

		let segmentsMatch = false;

		// Do they have the same number of segments?
		if (explodedRoute.length === explodedInput.length) {
			// Loop through the segments sent to us
			explodedRoute.forEach(function (item, index) {
				// Check that this is not a dotted segment
				if (!explodedRoute[index].includes(':')) {
					// Do all the non dotted segments match?
					segmentsMatch = (explodedRoute[index] == explodedInput[index])
				}
			});

			// All the non dotted segments matched
			if (segmentsMatch) {
				const potentialArgs: string[] = [];

				// Loop through the segments sent to us again
				explodedRoute.forEach(function (item, index) {
					// If its matching segment contains a :
					if (explodedRoute[index].includes(':')) {
						// Remove any bad characters and store as potential argument
						potentialArgs.push(explodedInput[index].replace(/[^a-zA-Z0-9]/g, ''));
					}
				});

				return value(...potentialArgs);
			}
		}
	}

	return new Response('No matching route.', { status: 404 });
}