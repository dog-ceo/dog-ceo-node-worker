import { handleRequest } from "@/index";
import AWSMock from "mock-aws-s3";

test("should send 404", async () => {
  const env = getMiniflareBindings();
  const res = await handleRequest(new Request("http://localhost"), env);
  expect(res.status).toBe(404);
  expect(await res.text()).toContain("No matching route.");
});

test("should get list of all breeds", async () => {
  const env = getMiniflareBindings();

  AWSMock.config.basePath = './.tmp/buckets/' // Can configure a basePath for your local buckets
  var s3 = new AWSMock.S3({
    params: { Bucket: env.R2_BUCKET }
  });

  s3.putObject({Key: 'breeds/hound/image1.jpg', Body: '12345', Bucket: env.R2_BUCKET}, function(err: any, data: any) {
    s3.listObjects({Prefix: 'breeds/hound', Bucket: env.R2_BUCKET}, function (err: any, data: any) {
      console.log(data);
    });
  });

  const res = await handleRequest(new Request("http://localhost/api/breeds/list/all"), env);
  expect(res.status).toBe(404);
});