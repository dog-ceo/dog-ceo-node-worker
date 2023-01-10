import { handleRequest } from "@/index";

test("should send 404", async () => {
  const env = getMiniflareBindings();
  const res = await handleRequest(new Request("http://localhost"), env);
  expect(res.status).toBe(404);
  expect(await res.text()).toContain("No matching route.");
});

test("should get list of all breeds", async () => {
  const env = getMiniflareBindings();
  const res = await handleRequest(new Request("http://localhost/api/breeds/list/all"), env);
  expect(res.status).toBe(404);
});