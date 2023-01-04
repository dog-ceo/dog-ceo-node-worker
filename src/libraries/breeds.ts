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

export async function listMainBreeds(env: Env): Promise<Map<string, string[]>> {
    const prefix = "breeds/";
    const delimiter = "/";

    const elements = await getCommonPrefixesByDelimeterAndPrefix(env, getClient(env), delimiter, prefix, 'listMainBreeds');

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

export async function getBreedImages(env: Env, breed1: string, breed2: string): Promise<string[]> {
    let breed = breed1;

    if (breed2 && breed2.length > 0) {
        breed = breed + '-' + breed2;
    }

    const prefix = "breeds/" + breed;

    // todo: check breed exists

    const elements = await getObjectsByPrefix(env, getClient(env), prefix, 'getBreedImages:' + breed);

    return elements;
}

export async function getBreedImagesRandom(env: Env, breed1: string, breed2: string): Promise<string> {
    const breeds = await getBreedImages(env, breed1, breed2);

    const image = breeds[Math.floor(Math.random() * breeds.length)];

    return image;
}

export async function getBreedImageRandom(env: Env): Promise<string> {
    const mainBreeds = await listMainBreeds(env);

    const randomBreed = getRandomKeyFromBreedsMap(mainBreeds);

    const breeds = await getBreedImages(env, randomBreed, '');

    const image = breeds[Math.floor(Math.random() * breeds.length)];

    return image;
}

function getRandomKeyFromBreedsMap(collection: Map<string, string[]>) {
    let keys = Array.from(collection.keys());
    return keys[Math.floor(Math.random() * keys.length)];
}