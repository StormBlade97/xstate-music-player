/* Collection of audio related functions */
import * as musicMetadata from "music-metadata-browser";
export function getObjectUrl(blob) {
  return URL.createObjectURL(blob);
}
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
export function parseDuration(duration = 0) {
  const sec = duration % 60;
  const min = Math.floor(duration / 60);
  return `${min}:${("0" + sec).slice(-2)}`;
}
export async function extractAudioMetadata(blob) {
  const metadata = await musicMetadata.parseBlob(blob);
  return metadata;
}

const loadNewTrackService = (blob, id) => async cb => {
  const src = URL.createObjectURL(blob);
  const audioElem = new Audio(src);
  const metadata = await musicMetadata.parseBlob(blob);

  cb({
    type: "CHILD_UPDATE",
    payload: {
      id,
      src,
      audioElem,
      metadata,
      albumArt: getAlbumArt(metadata),
      title: metadata.common.title,
      artist: metadata.common.artist,
      duration: parseDuration(metadata.format.duration)
    }
  });
  // enrich data
  // fetch lyrics
  cb({
    type: "LOAD_TRACK_SUCCESS",
    id
  });
  return () => {};
};

export default loadNewTrackService;
