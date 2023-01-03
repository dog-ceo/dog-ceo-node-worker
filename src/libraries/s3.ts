import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

export function getClient() {
    const config = {
		region: "us-east-1",
		credentials:{
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY
        },
		endpoint: R2_API,
	};
	
	const client = new S3Client(config);

    return client;
}

// GetObjectsByDelimeterAndPrefix gets objects from s3 which start with string
export async function getObjectsByDelimeterAndPrefix(client: S3Client, delimeter: string, prefix: string) {
	const input = {
		Bucket: R2_BUCKET,
		Delimiter: delimeter,
		Prefix: prefix,
	};

	const command = new ListObjectsV2Command(input);

	const list = await client.send(command);

	return list;
}