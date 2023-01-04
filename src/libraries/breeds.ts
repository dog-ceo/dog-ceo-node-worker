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

export async function listMasterBreeds(env: Env): Promise<Map<string, string[]>> {
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
        }
    }

    return breeds;
}

export async function listSubBreeds(env: Env, breedFromUrl: string): Promise<Map<string, string[]>> {
    const prefix = "breeds/";
    const delimiter = "/";

    const listed = await getObjectsByDelimeterAndPrefix(env, getClient(env), delimiter, prefix);

    const breeds: Map<string, string[]> = new Map;

    if (listed && listed.CommonPrefixes) {
        for (const element of listed.CommonPrefixes) {
            const breedString = element.Prefix?.replace(prefix, '').replace(delimiter, '');
            const exploded = breedString.split("-");
            const breed = exploded[0];

            if (breedFromUrl === breed) {
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
    }

    return breeds;
}
