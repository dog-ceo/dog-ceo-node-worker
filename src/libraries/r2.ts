// getObjectsByDelimeterAndPrefix gets objects from s3 which start with string
export async function getObjectsByDelimeterAndPrefix(bucket: R2Bucket, delimeter: string, prefix: string) {
	const options: R2ListOptions = {
		delimiter: delimeter,
		prefix: prefix,
	};

	let listed = await bucket.list(options);
    let truncated = listed.truncated;
    let cursor = truncated ? listed.cursor : undefined;

    while (truncated) {
        const next = await bucket.list({
          ...options,
          cursor: cursor,
        });
        listed.objects.push(...next.objects);
      
        truncated = next.truncated;
        cursor = next.cursor

        console.log("2");
    }

    console.log(listed);

	return listed;
}