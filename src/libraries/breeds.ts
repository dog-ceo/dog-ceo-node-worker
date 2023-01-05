import { 
    Env,
    getClient,
    getCommonPrefixesByDelimeterAndPrefix,
    getObjectsByPrefix,
} from "./data"

import { Alt } from "./response"

export interface Params {
	breed1: string,
	breed2: string,
	count: number,
}

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

export async function listRandomBreedsWithSub(env: Env, params: Params): Promise<Map<string, string[]>> {
    const {count} = params;
    let breeds = await listAllBreeds(env);
    const result: Map<string, string[]> = new Map;

    if (count === 1) {
        const key = getRandomKeyFromBreedsMap(breeds);

        let value = breeds.get(key);

        if (!value) {
            value = [];
        }

        result.set(key, value);

        return result;
    }

    return shuffleBreedsMap(breeds, count);
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

export async function listRandomMainBreeds(env: Env, params: Params): Promise<Map<string, string[]>> {
    const {count} = params;
    let breeds = await listMainBreeds(env);
    const result: Map<string, string[]> = new Map;

    if (count === 1) {
        const key = getRandomKeyFromBreedsMap(breeds);

        let value = breeds.get(key);

        if (!value) {
            value = [];
        }

        result.set(key, value);

        return result;
    }

    return shuffleBreedsMap(breeds, count);
}

export async function listSubBreeds(env: Env, params: Params): Promise<Map<string, string[]>> {
    const {breed1} = params;
    const prefix = "breeds/";
    const delimiter = "/";

    const elements = await getCommonPrefixesByDelimeterAndPrefix(env, getClient(env), delimiter, prefix, 'listSubBreeds:' + breed1);

    const breeds: Map<string, string[]> = new Map;

    const subs: string[] = [];

    for (const element of elements) {
        const breedString = element.replace(prefix, '').replace(delimiter, '');
        const exploded = breedString.split("-");
        const breed = exploded[0];

        if (breed1 === breed) {
            if (!(breed in breeds)) {
                breeds.set(breed, []);
            }

            if (exploded.length > 1) {
                subs.push(exploded[1]);
                breeds.set(breed, subs);
            }
        }
    }

    return breeds;
}

export async function listRandomSubBreeds(env: Env, params: Params): Promise<Array<string>> {
    let {count} = params;
    const breeds = await listSubBreeds(env, params);
    const key = getRandomKeyFromBreedsMap(breeds);
    let subs = breeds.get(key);
    let result: Array<string> = [];

    if (!subs) {
        return result;
    }

    subs = shuffle(subs);

    if (count > subs.length) {
        count = subs.length;
    }

    return subs.slice(0, count); 
}

export async function getBreedImages(env: Env, params: Params): Promise<string[]> {
    const {breed1, breed2, count} = params;

    let breed = breed1;

    if (breed2 && breed2.length > 0) {
        breed = breed + '-' + breed2;
    }

    const prefix = "breeds/" + breed;

    // todo: check breed exists

    const elements = await getObjectsByPrefix(env, getClient(env), prefix, 'getBreedImages:' + breed);

    return elements;
}

export async function getBreedImagesRandom(env: Env, params: Params): Promise<string[]> {
    let {count} = params;

    let images = await getBreedImages(env, params);

    if (count === 1) {
        return [images[Math.floor(Math.random() * images.length)]];
    }

    images = shuffle(images);

    if (count > images.length) {
        return images;
    }

    return images.slice(0, count);
}

export async function getBreedImagesRandomAlt(env: Env, params: Params): Promise<Array<Alt>> {
    let {count} = params;

    let images = await getBreedImages(env, params);

    images = shuffle(images);

    if (count < images.length) {
        images = images.slice(0, count);
    }

    const result: Array<Alt> = [];

    images.forEach((image) => {
        const alt = {url: image, altText: niceBreedNameFromParams(params)} as Alt;
        result.push(alt);
    });

    return result;
}

export async function getBreedImageRandom(env: Env): Promise<string> {
    const mainBreeds = await listMainBreeds(env);

    const randomBreed = getRandomKeyFromBreedsMap(mainBreeds);

    const params = {breed1: randomBreed, breed2: ''} as Params;

    const images = await getBreedImages(env, params);

    const image = images[Math.floor(Math.random() * images.length)];

    return image;
}

export async function getBreedImageRandomCount(env: Env, params: Params): Promise<string[]> {
    let {count} = params;

    if (count > 50) {
        count = 50;
    }

    const mainBreeds = await listMainBreeds(env);

    const images: string[] = [];

    for (let i = 0; i < count; i++) {
        const randomBreed = getRandomKeyFromBreedsMap(mainBreeds);
        params.breed1 = randomBreed;
        const breedImages = await getBreedImages(env, params);
        const image = breedImages[Math.floor(Math.random() * breedImages.length)];
        images.push(image);
    }

    return images;
}

export async function getBreedImageRandomCountAlt(env: Env, params: Params): Promise<Array<Alt>> {
    let {count} = params;

    if (count > 50) {
        count = 50;
    }

    const mainBreeds = await listAllBreeds(env);

    const images = [] as Array<Alt>

    for (let i = 0; i < count; i++) {
        const breed1 = getRandomKeyFromBreedsMap(mainBreeds)
        params.breed1 = breed1;

        const subs = mainBreeds.get(breed1);
        const breed2 = (subs && subs.length === 1) ? subs[0] : '';
        params.breed2 = breed2;

        const breedImages = await getBreedImages(env, params);
        const image = breedImages[Math.floor(Math.random() * breedImages.length)];
        const alt = {url: image, altText: niceBreedNameFromParams(params)} as Alt;
        images.push(alt);
    }

    return images;
}

function niceBreedNameFromParams(params: Params): string {
    let output = '';

    if (params.breed2 && params.breed2.length > 0) {
        output += params.breed2;
    }

    if (params.breed1 && params.breed1.length > 0) {

        if (output.length) {
            output += ' ';
        }

        output += params.breed1;
        output += ' dog.';
    }

    if (output.length) {
        return capitalizeFirstLetter(output);
    }

    return 'Unknown breed of dog.'
}

export function getRandomKeyFromBreedsMap(collection: Map<string, string[]>) {
    let keys = Array.from(collection.keys());
    return keys[Math.floor(Math.random() * keys.length)];
}

export function shuffleBreedsMap(breeds: Map<string, string[]>, count = 0): Map<string, string[]> {
    let keys = shuffle(Array.from(breeds.keys()));

    if (count > 0 && count <= keys.length) {
        keys = keys.slice(0, count);
    }

    const result: Map<string, string[]> = new Map;

    keys.forEach(function (item: string, index: number) {
        let value = breeds.get(item);

        if (!value) {
            value = [];
        }

        result.set(item, value)
    });

    return result;
}

// https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array: Array<string>): Array<string> {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
}