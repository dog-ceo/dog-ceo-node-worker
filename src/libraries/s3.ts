import { S3Client, ListObjectsV2Command, ListObjectsV2CommandOutput } from "@aws-sdk/client-s3";

export interface Env {}

export function getClient(env: Env) {
    const config = {
		region: "us-east-1",
		credentials:{
            accessKeyId: env.R2_ACCESS_KEY_ID,
            secretAccessKey: env.R2_SECRET_ACCESS_KEY
        },
		endpoint: env.R2_API,
	};
	
	const client = new S3Client(config);

    return client;
}

// GetObjectsByDelimeterAndPrefix gets objects from s3 which start with string
export async function getObjectsByDelimeterAndPrefix(env: Env, client: S3Client, delimeter: string, prefix: string): Promise<ListObjectsV2CommandOutput> {
	const input = {
		Bucket: env.R2_BUCKET,
		Delimiter: delimeter,
		Prefix: prefix,
	};

	const command = new ListObjectsV2Command(input);

	const list = await client.send(command);

	return list;
}