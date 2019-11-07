/* Collection of audio related functions */
import { processorScript } from "./metadata-extractor";
import Worker from "./extractMedataWorker.worker";

const loadNewTrackService = (file, id) => async cb => {
  let myWorker = null;
  if (Worker) {
    try {
      myWorker = new Worker();
      myWorker.postMessage(file);
      myWorker.onmessage = e => {
        cb({
          type: "CHILD_UPDATE",
          payload: { ...e.data, id }
        });
        cb({
          type: "LOAD_TRACK_SUCCESS",
          payload: {
            id
          }
        });
      };
    } catch (error) {
      console.error(error);
    }
  } else {
    console.log(
      "Worker feature is not available. Processing file in mainthread!"
    );
    processorScript(file, extracted => {
      cb({
        type: "CHILD_UPDATE",
        payload: { ...extracted, id }
      });

      cb({
        type: "LOAD_TRACK_SUCCESS",
        payload: {
          id
        }
      });
    });
  }

  // }

  // // enrich data
  // while (retryLeft > 0) {
  //   try {
  //     const query = metadata.common.title
  //       ? `${metadata.common.title} - ${metadata.common.artist}`
  //       : id.split(".")[0].replace(/\([^()]*\)/g, "");
  //     const response = await axios.get(`/enrichment?q=${query}`);
  //     cb({
  //       type: "CHILD_UPDATE",
  //       payload: {
  //         ...response.data,
  //         id,
  //         error: null
  //       }
  //     });
  //     retryLeft = 0;
  //   } catch (error) {
  //     cb({
  //       type: "CHILD_UPDATE",
  //       payload: {
  //         id,
  //         error: "Enrichment error"
  //       }
  //     });
  //     retryLeft--;
  //   }
  // }

  // fetch lyrics

  return () => {
    myWorker.terminate();
  };
};

export default loadNewTrackService;
