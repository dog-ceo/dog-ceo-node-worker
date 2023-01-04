import { getObjectsByDelimeterAndPrefix as name } from "./r2"
import { getClient, getObjectsByDelimeterAndPrefix } from "./s3"

export interface Env {}

export async function listAllBreeds(env: Env): Promise<Map<string, string[]>> {
    const prefix = "breeds/";
    const delimiter = "/";

    const listed = await getObjectsByDelimeterAndPrefix(env, getClient(env), delimiter, prefix);

    const breeds: Map<string, string[]> = new Map;

    if (listed && listed.CommonPrefixes) {
        for (const element of listed.CommonPrefixes) {
            const breedString = element.Prefix?.replace(prefix, '').replace(delimiter, '');
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

export async function listAllBreedsR2(env: Env): Promise<Map<string, string[]>> {
    // for some reason the output truncates when I use R2 for this...
    const prefix = "breeds/";
    const delimiter = "/";

    const listed = await name(env.BUCKET, delimiter, prefix);

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