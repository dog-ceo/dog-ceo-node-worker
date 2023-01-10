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
    {Prefix: 'breeds/hound1'},
    {Prefix: 'breeds/hound2'},
    {Prefix: 'breeds/hound3'},
    {Prefix: 'breeds/hound4'},
    {Prefix: 'breeds/hound5-somethingelse'},
  ] as CommonPrefix[] });

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/list/all/random/3"), env);
  const obj = JSON.parse(await res.text());
  const count = Object.keys(obj.message).length;
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(count).toBe(3);
});

// api/breeds/list
test("api/breeds/list", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves({ CommonPrefixes: [
    {Prefix: 'breeds/hound1'},
    {Prefix: 'breeds/hound5-somethingelse'},
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
    {Prefix: 'breeds/hound1'},
    {Prefix: 'breeds/hound1-somethingelse'},
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
    {Prefix: 'breeds/hound1'},
    {Prefix: 'breeds/hound2'},
    {Prefix: 'breeds/hound3'},
    {Prefix: 'breeds/hound4'},
    {Prefix: 'breeds/hound5-somethingelse'},
  ] as CommonPrefix[] });

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/list/random/4"), env);

  const obj = JSON.parse(await res.text());
  const count = Object.keys(obj.message).length;
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(count).toBe(4);
  expect(obj.message[0]).toContain('hound');
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

// /api/breeds/image/random
test("api/breeds/image/random", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves(
    { CommonPrefixes: 
      [
        {Prefix: 'breeds/hound1'},
      ] as CommonPrefix[],
      Contents:
      [
        {Key: 'breeds/hound1/lol123.jpg'}
      ]
    }
  );

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/image/random"), env);

  expect(res.status).toBe(200);

  expect(JSON.parse(await res.text())).toStrictEqual({status: 'success', message: 'https://images.dog.ceo/breeds/hound1/lol123.jpg'});
});

// /api/breeds/image/random/5
test("api/breeds/image/random/5", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves(
    { CommonPrefixes: 
      [
        {Prefix: 'breeds/hound1'},
      ] as CommonPrefix[],
      Contents:
      [
        {Key: 'breeds/hound1/lol123.jpg'},
        {Key: 'breeds/hound1/lol1234.jpg'},
        {Key: 'breeds/hound1/lol1235.jpg'},
        {Key: 'breeds/hound1/lol1236.jpg'},
        {Key: 'breeds/hound1/lol1237.jpg'},
        {Key: 'breeds/hound1/lol1238.jpg'},
      ]
    }
  );

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/image/random/5"), env);

  const obj = JSON.parse(await res.text());
  const count = Object.keys(obj.message).length;
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(count).toBe(5);
  expect(obj.message[0]).toContain('hound1/lol123');
  expect(obj.message[4]).toContain('.jpg');
});

// /api/breeds/image/random/5/alt
test("api/breeds/image/random/5/alt", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves(
    { CommonPrefixes: 
      [
        {Prefix: 'breeds/hound1'},
      ] as CommonPrefix[],
      Contents:
      [
        {Key: 'breeds/hound1/lol123.jpg'},
        {Key: 'breeds/hound1/lol1234.jpg'},
        {Key: 'breeds/hound1/lol1235.jpg'},
        {Key: 'breeds/hound1/lol1236.jpg'},
        {Key: 'breeds/hound1/lol1237.jpg'},
        {Key: 'breeds/hound1/lol1238.jpg'},
      ]
    }
  );

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breeds/image/random/5/alt"), env);
  const obj = JSON.parse(await res.text())
  const count = Object.keys(obj.message).length;
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(count).toBe(5);
  expect(obj.message[0].altText).toBe('Hound1 dog.');
  expect(obj.message[4].url).toContain('https://images.dog.ceo/breeds/hound1/lol123');
  expect(obj.message[3].url).toContain('.jpg');
});

// /api/breed/:breed1/images
test("/api/breed/:breed1/images", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves(
    { CommonPrefixes: 
      [
        {Prefix: 'breeds/hound1'},
      ] as CommonPrefix[],
      Contents:
      [
        {Key: 'breeds/hound1/lol123.jpg'},
        {Key: 'breeds/hound1/lol1234.jpg'},
        {Key: 'breeds/hound1/lol1235.jpg'},
        {Key: 'breeds/hound1/lol1236.jpg'},
        {Key: 'breeds/hound1/lol1237.jpg'},
        {Key: 'breeds/hound1/lol1238.jpg'},
      ]
    }
  );

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breed/hound1/images"), env);

  const obj = JSON.parse(await res.text())
  const count = Object.keys(obj.message).length;
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(count).toBe(6);
  expect(obj.message[4]).toContain('https://images.dog.ceo/breeds/hound1/lol123');
  expect(obj.message[3]).toContain('.jpg');
});

// /api/breed/:breed1/images/random
test("/api/breed/:breed1/images/random", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves(
    { CommonPrefixes: 
      [
        {Prefix: 'breeds/hound1'},
      ] as CommonPrefix[],
      Contents:
      [
        {Key: 'breeds/hound1/lol123.jpg'},
        {Key: 'breeds/hound1/lol1234.jpg'},
        {Key: 'breeds/hound1/lol1235.jpg'},
        {Key: 'breeds/hound1/lol1236.jpg'},
        {Key: 'breeds/hound1/lol1237.jpg'},
        {Key: 'breeds/hound1/lol1238.jpg'},
      ]
    }
  );

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breed/hound1/images/random"), env);
  const obj = JSON.parse(await res.text());
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(obj.message).toContain('https://images.dog.ceo/breeds/hound1/lol123')
  expect(obj.message).toContain('.jpg')
});

// /api/breed/:breed1/images/random/2
test("/api/breed/:breed1/images/random/2", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves(
    { CommonPrefixes: 
      [
        {Prefix: 'breeds/hound1'},
      ] as CommonPrefix[],
      Contents:
      [
        {Key: 'breeds/hound1/lol123.jpg'},
        {Key: 'breeds/hound1/lol1234.jpg'},
        {Key: 'breeds/hound1/lol1235.jpg'},
        {Key: 'breeds/hound1/lol1236.jpg'},
        {Key: 'breeds/hound1/lol1237.jpg'},
        {Key: 'breeds/hound1/lol1238.jpg'},
      ]
    }
  );

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breed/hound1/images/random/2"), env);

  const obj = JSON.parse(await res.text())
  const count = Object.keys(obj.message).length;
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(count).toBe(2);
  expect(obj.message[0]).toContain('https://images.dog.ceo/breeds/hound1/lol123');
  expect(obj.message[1]).toContain('.jpg');
});

// /api/breed/:breed1/images/random/2/alt
test("/api/breed/:breed1/images/random/2/alt", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves(
    { CommonPrefixes: 
      [
        {Prefix: 'breeds/hound1'},
      ] as CommonPrefix[],
      Contents:
      [
        {Key: 'breeds/hound1/lol123.jpg'},
        {Key: 'breeds/hound1/lol1234.jpg'},
        {Key: 'breeds/hound1/lol1235.jpg'},
        {Key: 'breeds/hound1/lol1236.jpg'},
        {Key: 'breeds/hound1/lol1237.jpg'},
        {Key: 'breeds/hound1/lol1238.jpg'},
      ]
    }
  );

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breed/hound1/images/random/2/alt"), env);

  const obj = JSON.parse(await res.text())
  const count = Object.keys(obj.message).length;
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(count).toBe(2);
  expect(obj.message[0].url).toContain('https://images.dog.ceo/breeds/hound1/lol123');
  expect(obj.message[1].url).toContain('.jpg');
  expect(obj.message[1].altText).toContain('Hound1 dog.');
});

// /api/breed/:breed1/:breed2/images
test("/api/breed/:breed1/:breed2/images", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves(
    { CommonPrefixes: 
      [
        //{Prefix: 'breeds/hound1'},
        {Prefix: 'breeds/hound1-basset'},
      ] as CommonPrefix[],
      Contents:
      [
        {Key: 'breeds/hound1-basset/lol123.jpg'},
        //{Key: 'breeds/hound1/lol1234.jpg'},
        {Key: 'breeds/hound1-basset/lol1235.jpg'},
        //{Key: 'breeds/hound1/lol1236.jpg'},
        {Key: 'breeds/hound1-basset/lol1237.jpg'},
        //{Key: 'breeds/hound1/lol1238.jpg'},
      ]
    }
  );

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breed/hound1/basset/images"), env);
  const obj = JSON.parse(await res.text());
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(obj.message.length).toBe(3)
  expect(obj.message[0]).toContain('https://images.dog.ceo/breeds/hound1-basset/lol123')
  expect(obj.message[2]).toContain('.jpg')
});

// /api/breed/:breed1/:breed2/images/random
test("/api/breed/:breed1/:breed2/images/random", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves(
    { CommonPrefixes: 
      [
        //{Prefix: 'breeds/hound1'},
        {Prefix: 'breeds/hound1-basset'},
      ] as CommonPrefix[],
      Contents:
      [
        {Key: 'breeds/hound1-basset/lol123.jpg'},
        //{Key: 'breeds/hound1/lol1234.jpg'},
        {Key: 'breeds/hound1-basset/lol1235.jpg'},
        //{Key: 'breeds/hound1/lol1236.jpg'},
        {Key: 'breeds/hound1-basset/lol1237.jpg'},
        //{Key: 'breeds/hound1/lol1238.jpg'},
      ]
    }
  );

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breed/hound1/basset/images/random"), env);
  const obj = JSON.parse(await res.text());
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(obj.message).toContain('https://images.dog.ceo/breeds/hound1-basset/lol123')
  expect(obj.message).toContain('.jpg');
});

// /api/breed/:breed1/:breed2/images/random/10
test("/api/breed/:breed1/:breed2/images/random/10", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves(
    { CommonPrefixes: 
      [
        //{Prefix: 'breeds/hound1'},
        {Prefix: 'breeds/hound1-basset'},
      ] as CommonPrefix[],
      Contents:
      [
        {Key: 'breeds/hound1-basset/lol123.jpg'},
        {Key: 'breeds/hound1-basset/lol1235.jpg'},
        {Key: 'breeds/hound1-basset/lol1237.jpg'},
      ]
    }
  );

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breed/hound1/basset/images/random/10"), env);
  const obj = JSON.parse(await res.text());
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(obj.message.length).toBe(3);
  expect(obj.message[1]).toContain('https://images.dog.ceo/breeds/hound1-basset/lol123')
  expect(obj.message[2]).toContain('.jpg');
});

// /api/breed/:breed1/:breed2/images/random/9999/alt
test("/api/breed/:breed1/:breed2/images/random/9999/alt", async () => {
  const env = getMiniflareBindings();

  const s3Mock = mockClient(S3Client);

  s3Mock.on(ListObjectsV2Command).resolves(
    { CommonPrefixes: 
      [
        //{Prefix: 'breeds/hound1'},
        {Prefix: 'breeds/hound1-basset'},
      ] as CommonPrefix[],
      Contents:
      [
        {Key: 'breeds/hound1-basset/lol123.jpg'},
        {Key: 'breeds/hound1-basset/lol1235.jpg'},
        {Key: 'breeds/hound1-basset/lol1237.jpg'},
      ]
    }
  );

  env.S3_CLIENT = new S3Client({});

  const res = await handleRequest(new Request("http://localhost/api/breed/hound1/basset/images/random/9999/alt"), env);
  const obj = JSON.parse(await res.text());
  expect(res.status).toBe(200);
  expect(obj.status).toBe('success');
  expect(obj.message.length).toBe(3);
  expect(obj.message[1].url).toContain('https://images.dog.ceo/breeds/hound1-basset/lol123')
  expect(obj.message[2].url).toContain('.jpg');
  expect(obj.message[0].altText).toContain('Basset hound1 dog.');
});