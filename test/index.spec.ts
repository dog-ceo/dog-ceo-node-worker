import { handleRequest } from "@/index";
import {ListObjectsV2Command, ListObjectsV2CommandOutput, S3Client, CommonPrefix} from '@aws-sdk/client-s3';
import {sdkStreamMixin} from '@aws-sdk/util-stream-node';
import {mockClient} from 'aws-sdk-client-mock';
import {Readable} from 'stream';
import {createReadStream} from 'fs';
import {CreateMultipartUploadCommand, UploadPartCommand} from '@aws-sdk/client-s3';
import { Upload } from "@aws-sdk/lib-storage";

const s3Mock = mockClient(S3Client);
s3Mock.on(ListObjectsV2Command).resolves({ CommonPrefixes: [{Prefix: 'breeds/hound/lol'}] as CommonPrefix[] });

test("should send 404", async () => {
  const env = getMiniflareBindings();
  const res = await handleRequest(new Request("http://localhost"), env);
  expect(res.status).toBe(404);
  expect(await res.text()).toContain("No matching route.");
});

test("should get list of all breeds", async () => {
  const env = getMiniflareBindings();

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/list/all"), env);
  expect(res.status).toBe(200);
  expect(await res.text()).toContain("No matching route.");
});