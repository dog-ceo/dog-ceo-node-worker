import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";

const cdnPrefix = "https://images.dog.ceo/";

export interface Env {
	DOGSTUFF: KVNamespace
	R2_API: string
	R2_BUCKET: string
	R2_ACCESS_KEY_ID: string
	R2_SECRET_ACCESS_KEY: string
}

export function getClient(env: Env) {
    const config = {
		region: "us-east-1",
		endpoint: env.R2_API,
		credentials:{
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY
        },
	};
	
	const client = new S3Client(config);

    return client;
}

export async function getCommonPrefixesByDelimeterAndPrefix(env: Env, client: S3Client, delimeter: string, prefix: string, cacheKey: string): Promise<string[]> {
	const input = {
		Bucket: env.R2_BUCKET,
		Delimiter: delimeter,
		Prefix: prefix,
	};

	let elements: string[] = [];

	const json = await getDataFromCache(env, cacheKey);

    if (json.length) {
		const elements = JSON.parse(json);

		return elements;
	}

	const command = new ListObjectsV2Command(input);

	const listed = await client.send(command);
	
	if (listed && listed.CommonPrefixes) {
		for (const element of listed.CommonPrefixes) {
			if (element && element.Prefix) {
				elements.push(element.Prefix);
			}
		}

		saveDataToCache(env, cacheKey, JSON.stringify(elements));
    }

	return elements;
}

export async function getObjectsByPrefix(env: Env, client: S3Client, prefix: string, cacheKey: string): Promise<string[]> {
	const input = {
		Bucket: env.R2_BUCKET,
		Prefix: prefix,
	};

	let elements: string[] = [];

	const json = await getDataFromCache(env, cacheKey);

    if (json.length) {
		const elements = JSON.parse(json);

		return elements;
	}


	const command = new ListObjectsV2Command(input);

	const listed = await client.send(command);

	if (listed && listed.Contents) {
		for (const element of listed.Contents) {
			if (element && element.Key) {
				elements.push(cdnPrefix + element.Key);
			}
		}

		saveDataToCache(env, cacheKey, JSON.stringify(elements));
    }

	return elements;
}

async function getDataFromCache(env: Env, key: string): Promise<string> {
	const cacheKey = 'dog-' + key;
	const cacheDataKey = cacheKey + '-data';
	let data = await env.DOGSTUFF.get(cacheDataKey);

	if (data === null) {
		data = ""
	}

	return data.toString();
}

async function saveDataToCache(env: Env, key: string, data: any) {
	const cacheKey = 'dog-' + key;
	const cacheDataKey = cacheKey + '-data';
	await env.DOGSTUFF.put(cacheDataKey, data, {expirationTtl: 600});
}
