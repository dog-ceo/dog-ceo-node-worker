import { shuffle, capitalizeFirstLetter } from "@/libraries/util";

test("should capitalize first letter", async () => {
  const string1 = "capital";
  const string2 = "Capital";
  const result = capitalizeFirstLetter(string1);
  
  expect(string2).toBe(result);
});
