import * as musicMetadata from "music-metadata-browser";
function getAlbumArt(metadata) {
  try {
    const ref = metadata.common.picture[0];
    if (ref && ref.data && ref.format) {
      const base64Data = btoa(String.fromCharCode.apply(null, ref.data));
      return "data:image/png;base64," + base64Data;
    }
  } catch (error) {
    return "";
  }
}
export const extractMetadata = async function(file) {
  let metadata;
  try {
    metadata = await musicMetadata.parseBlob(file);
    if (metadata) {
      return {
        metadata,
        albumArt: getAlbumArt(metadata),
        title: metadata.common.title,
        artist: metadata.common.artist,
        duration: metadata.format.duration,
        explicit: metadata.common.explicit
      };
    }
  } catch (error) {
    console.log("Failed to load metadata", error);
  }
  return null;
};

export default file => cb => {
  // sadly webpack sucks at making web worker work, so we parse things inline
  // const queue = [];
  // const workerPool = [];

  // if (window.Worker) {
  //   const scheduleWork = () => {
  //     const freeWorkers = workerPool.filter(worker => worker.idle);
  //     if (freeWorkers.length > 0) {
  //       freeWorkers.forEach(worker => {
  //         const job = queue.shift();
  //         if (job) {
  //           console.log(`Assigning job ${job} to worker ${worker}`);
  //           worker.ref.postMessage(job);
  //           worker.idle = false;
  //         }
  //       });
  //     }
  //   };

  //   // const maxWorker = navigator.hardwareConcurrency || 3;
  //   const maxWorker = 1;
  //   // prepare a pool of worker
  //   for (let i = 0; i < maxWorker; i++) {
  //     const worker = {
  //       ref: new SecondWorker(),
  //       id: i,
  //       idle: true
  //     };
  //     workerPool.push(worker);
  //   }
  //   workerPool.forEach(worker => {
  //     // worker.ref.onmessage = e => {
  //     //   console.log("job cmpleted", e);
  //     //   debugger;
  //     //   cb({
  //     //     type: "JOB_COMPLETE",
  //     //     payload: {
  //     //       ...e.data
  //     //     }
  //     //   });
  //     //   worker.idle = true;
  //     //   scheduleWork();
  //     // };
  //     worker.ref.onmessage = console.log;
  //   });

  //   onEvent(event => {
  //     // register received job.
  //     // distribute task if there is freeworker, else put in queue
  //     if (event.type === "REGISTER_JOB") {
  //       const { fileArray } = event.payload;
  //       queue.push(fileArray.map(file => ({ file, id: file.name })));

  //       scheduleWork();
  //     }
  //   });
  // } else {
  //   console.log(
  //     "Worker feature is not available. Processing file in mainthread!"
  //   );
  // register received job.
  // distribute task if there is freeworker, else put in queue
  extractMetadata(file).then(metadata => {
    cb({
      type: "JOB_COMPLETE",
      payload: { ...metadata, id: file.name }
    });
  });
  return () => {};
};
// export default () => (cb, onEvent) => {
//   if (Worker) {
//     onEvent(e => {
//       if (e.type === "REGISTER_JOB") {

//       }
//     });
//   }
// };

// // }

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
