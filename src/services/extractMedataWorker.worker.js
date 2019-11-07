import { processorScript } from "./metadata-extractor";

onmessage = e => {
  if (e.data instanceof File) {
    processorScript(e.data, self.postMessage);
  }
};
