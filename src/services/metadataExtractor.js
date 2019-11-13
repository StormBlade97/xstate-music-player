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
  extractMetadata(file).then(metadata => {
    cb({
      type: "JOB_COMPLETE",
      payload: { ...metadata, id: file.name }
    });
  });
  return () => {};
};
