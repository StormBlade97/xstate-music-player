import SampleInput from "./SampleInput.vue";
import path from "path";
import fs from "fs";
import { mount } from "@vue/test-utils";

test.only("file upload works", () => {
  const filename = "file1";
  const wrapper = mount(SampleInput);
  const file = new File(
    fs.readFileSync(path.join(__dirname, "../mocks/file1.mp3")),
    filename,
    {
      type: "audio/mp3"
    }
  );

  wrapper.find("input").trigger("change", {
    files: [file]
  });
  expect(wrapper.find(".name").text()).toBe(filename);
});
