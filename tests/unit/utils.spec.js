import { parseDuration } from "@/services/audio";
import getFiles from "../utils/getMockAudio";

it("parse duration works", () => {
  const sample = 180;
  expect(parseDuration(sample)).toBe("3:00");
});

it("gen audio files", () => {
  expect(getFiles()).toHaveLength(2);
});
