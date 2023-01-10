import { handleRequest } from "@/index";
import {ListObjectsV2Command, S3Client, CommonPrefix} from '@aws-sdk/client-s3';
import {mockClient} from 'aws-sdk-client-mock';

// 404
test("should send 404", async () => {
  const env = getMiniflareBindings();
  const res = await handleRequest(new Request("http://localhost"), env);
  expect(res.status).toBe(404);
  expect(await res.text()).toContain("No matching route.");
});

// api/breeds/list/all
test("should get list of all breeds", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves({ CommonPrefixes: [
    {Prefix: 'breeds/hound'},
    {Prefix: 'breeds/hound-something'},
    {Prefix: 'breeds/hound'},
    {Prefix: 'breeds/hound-somethingelse'},
  ] as CommonPrefix[] });

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/list/all"), env);

  expect(res.status).toBe(200);
  expect(JSON.parse(await res.text())).toStrictEqual({status: 'success', message: {'hound': ['something', 'somethingelse']}});
});

// api/breeds/list/all/random
test("api/breeds/list/all/random", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves({ CommonPrefixes: [
    {Prefix: 'breeds/hound'},
    {Prefix: 'breeds/hound-something'},
    {Prefix: 'breeds/hound'},
    {Prefix: 'breeds/hound-somethingelse'},
  ] as CommonPrefix[] });

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/list/all/random"), env);

  expect(res.status).toBe(200);
  expect(JSON.parse(await res.text())).toStrictEqual({status: 'success', message: {'hound': ['something', 'somethingelse']}});
});

// api/breeds/list/all/random/3
test("api/breeds/list/all/random/3", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves({ CommonPrefixes: [
    {Prefix: 'breeds/hound11'},
    {Prefix: 'breeds/hound22'},
    {Prefix: 'breeds/hound33'},
    {Prefix: 'breeds/hound44'},
    {Prefix: 'breeds/hound55-somethingelse'},
  ] as CommonPrefix[] });

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/list/all/random/3"), env);
  const obj = JSON.parse(await res.text()).message
  const count = Object.keys(obj).length;
  expect(res.status).toBe(200);
  expect(count).toBe(3);
});

// api/breeds/list
test("api/breeds/list", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves({ CommonPrefixes: [
    {Prefix: 'breeds/hound111'},
    {Prefix: 'breeds/hound555-somethingelse'},
  ] as CommonPrefix[] });

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/list"), env);

  expect(JSON.parse(await res.text())).toStrictEqual({status: 'success', message: ['hound1', 'hound5']});

  expect(res.status).toBe(200);
});

// api/breeds/list/random
test("api/breeds/list/random", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves({ CommonPrefixes: [
    {Prefix: 'breeds/hound1111'},
    {Prefix: 'breeds/hound1111-somethingelse'},
  ] as CommonPrefix[] });

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/list/random"), env);

  expect(JSON.parse(await res.text())).toStrictEqual({status: 'success', message: 'hound1'});

  expect(res.status).toBe(200);
});

// api/breeds/list/random/3
test("api/breeds/list/random/4", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves({ CommonPrefixes: [
    {Prefix: 'breeds/hound11111'},
    {Prefix: 'breeds/hound22222'},
    {Prefix: 'breeds/hound33333'},
    {Prefix: 'breeds/hound44444'},
    {Prefix: 'breeds/hound55555-somethingelse'},
  ] as CommonPrefix[] });

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/list/random/4"), env);
  const obj = JSON.parse(await res.text()).message
  const count = Object.keys(obj).length;
  expect(res.status).toBe(200);
  expect(count).toBe(4);
});

// /api/breed/:breed1/list
test("api/breed/:breed1/list", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves({ CommonPrefixes: [
    {Prefix: 'breeds/hound1'},
    {Prefix: 'breeds/hound2'},
    {Prefix: 'breeds/hound3-lol1'},
    {Prefix: 'breeds/hound3-lol2'},
    {Prefix: 'breeds/hound4'},
    {Prefix: 'breeds/hound5-somethingelse'},
  ] as CommonPrefix[] });

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breed/hound3/list"), env);

  expect(res.status).toBe(200);

  expect(JSON.parse(await res.text())).toStrictEqual({status: 'success', message: {hound3: ['lol1', 'lol2']}});
});

// /api/breed/:breed1/list/random
test("api/breed/:breed1/list/random", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves({ CommonPrefixes: [
    {Prefix: 'breeds/hound1'},
    {Prefix: 'breeds/hound2'},
    {Prefix: 'breeds/hound3-lol1'},
    {Prefix: 'breeds/hound3'},
    {Prefix: 'breeds/hound4'},
    {Prefix: 'breeds/hound5-somethingelse'},
  ] as CommonPrefix[] });

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breed/hound3/list/random"), env);

  expect(res.status).toBe(200);

  expect(JSON.parse(await res.text())).toStrictEqual({status: 'success', message: 'lol1'});
});

// /api/breed/:breed1/list/random/3
test("api/breed/:breed1/list/random/3", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves({ CommonPrefixes: [
    {Prefix: 'breeds/hound1'},
    {Prefix: 'breeds/hound2'},
    {Prefix: 'breeds/hound3-lol1'},
    {Prefix: 'breeds/hound3'},
    {Prefix: 'breeds/hound4'},
    {Prefix: 'breeds/hound5-somethingelse'},
  ] as CommonPrefix[] });

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breed/hound3/list/random/3"), env);

  expect(res.status).toBe(200);

  expect(JSON.parse(await res.text())).toStrictEqual({status: 'success', message: ['lol1']});
});