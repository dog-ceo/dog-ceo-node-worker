import { 
    getClient,
    getCommonPrefixesByDelimeterAndPrefix,
    getObjectsByPrefix,
    Env
} from "./s3"

export async function listAllBreeds(env: Env): Promise<Map<string, string[]>> {
    const prefix = "breeds/";
    const delimiter = "/";

    const elements = await getCommonPrefixesByDelimeterAndPrefix(env, getClient(env), delimiter, prefix, 'listAllBreeds');

    const breeds: Map<string, string[]> = new Map;

    for (const element of elements) {
        const breedString = element.replace(prefix, '').replace(delimiter, '');
        const exploded = breedString.split("-");
        const breed = exploded[0];

        if (!(breed in breeds)) {
            breeds.set(breed, []);
        }

        if (exploded.length > 1) {
            const secondary = breeds.get(breed);
            if (secondary) {
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

    const elements = await getCommonPrefixesByDelimeterAndPrefix(env, getClient(env), delimiter, prefix, 'listMasterBreeds');

    const breeds: Map<string, string[]> = new Map;

    for (const element of elements) {
        const breedString = element.replace(prefix, '').replace(delimiter, '');
        const exploded = breedString.split("-");
        const breed = exploded[0];

        if (!(breed in breeds)) {
            breeds.set(breed, []);
        }
    }

    return breeds;
}

export async function listSubBreeds(env: Env, breed1: string): Promise<Map<string, string[]>> {
    const prefix = "breeds/";
    const delimiter = "/";

    const elements = await getCommonPrefixesByDelimeterAndPrefix(env, getClient(env), delimiter, prefix, 'listSubBreeds:' + breed1);

    const breeds: Map<string, string[]> = new Map;

    for (const element of elements) {
        const breedString = element.replace(prefix, '').replace(delimiter, '');
        const exploded = breedString.split("-");
        const breed = exploded[0];

        if (breed1 === breed) {
            if (!(breed in breeds)) {
                breeds.set(breed, []);
            }

            if (exploded.length > 1) {
                const secondary = breeds.get(breed);
                if (secondary) {
                    secondary.push(exploded[1]);
                    breeds.set(breed, secondary);
                }
            }
        }
    }

    return breeds;
}

export async function getBreedImages(env: Env, breed1: string): Promise<string[]> {
    const prefix = "breeds/" + breed1;

    // todo: check breed exists

    const elements = await getObjectsByPrefix(env, getClient(env), prefix, 'getBreedImages:' + breed1);

    return elements;
}