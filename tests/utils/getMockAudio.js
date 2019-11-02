import path from "path";
import fs from "fs";
import glob from "glob";

const getMockAudio = () => {
  return glob.sync(path.join(__dirname, `../mocks/*.mp3`)).map((fPath, i) => {
    return new File(fs.readFileSync(fPath), `file-${i}`, {
      type: "audio/mp3"
    });
  });
};

export default getMockAudio;
