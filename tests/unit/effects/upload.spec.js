import getFile from "../../utils/getMockAudio";
import audioSvc from "@/services/audio";

describe("load and extract audio data actions", () => {
  window.URL.createObjectURL = jest.fn();
  const files = getFile();

  it("child process to load and enrich tracks", async () => {
    const cb = jest.fn();

    await audioSvc(files[0], "the-file-name")(cb);
    expect(cb.mock.calls).toMatchSnapshot();
  });
});
