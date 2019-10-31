import { parseDuration } from "@/services/audio";

it("parse duration works", () => {
  const sample = 180;
  expect(parseDuration(sample)).toBe("3:00");
});
