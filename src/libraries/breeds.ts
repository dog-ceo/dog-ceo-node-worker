import { getObjectsByDelimeterAndPrefix } from "./r2"

export interface Env {
	BUCKET: R2Bucket;
}

export async function listAllBreeds(env: Env): Promise<Map<string, string[]>> {
    const prefix = "breeds/";
    const delimiter = "/";

    const listed = await getObjectsByDelimeterAndPrefix(env.BUCKET, delimiter, prefix);

    const breeds: Map<string, string[]> = new Map;

    if (listed && listed.delimitedPrefixes) {
        for (const element of listed.delimitedPrefixes) {
            const breedString = element.replace(prefix, '').replace(delimiter, '');
            const exploded = breedString.split("-");
            const breed = exploded[0];

            if (!(breed in breeds)) {
                breeds.set(breed, []);
            }

            if (exploded.length > 1) {
                const secondary = breeds.get(breed);
                secondary.push(exploded[1]);
                breeds.set(breed, secondary);
            }
        }
    }

    return breeds;
}