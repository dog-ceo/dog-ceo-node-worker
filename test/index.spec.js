import { handleRequest } from "../src/index.ts";

test("responds with url", async () => {
  const req = new Request("http://localhost/");
  const res = await handleRequest(req);
  expect(await res.text()).toBe("URL: http://localhost/ KEY: value");
});