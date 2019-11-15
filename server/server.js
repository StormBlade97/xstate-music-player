require("dotenv").config();
const express = require("express");
const app = express();
const proxy = require("http-proxy-middleware");
const SpotifyWebApi = require("spotify-web-api-node");
const axios = require("axios");

let access_token = null;
let expires_in = null;

let spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET
});

function handleError(error, request, response) {
  console.log(error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = error.response;
    response.status(status).send(data);
  } else if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    response.send(500);
  } else {
    // Something happened in setting up the request that triggered an Error
    response.send(500);
  }
}

/* getToken */
async function authSpotify() {
  const { CLIENT_ID, CLIENT_SECRET } = process.env;
  const token = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  try {
    const { data } = await axios({
      url: `https://accounts.spotify.com/api/token?grant_type=client_credentials`,
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    access_token = data.access_token;
    expires_in = data.expires_in;
    spotifyApi.setAccessToken(access_token);
    console.log("Authentication successful");
    setTimeout(authSpotify, expires_in * 1000);
  } catch (error) {
    console.error(error.response);
    setTimeout(authSpotify, 5000);
  }
}
app.use("/search", async (req, res, next) => {
  const { q } = req.query;
  try {
    const { body } = await spotifyApi.searchTracks(q);
    const tracks = body.tracks.items;

    return res.json(
      tracks.map(t => {
        t.spotifyId = t.id;
        delete t.id;
        delete t.album.available_markets;
        delete t.available_markets;
        t.artistString = t.album.artists.map(a => a.name).join(" & ");
        return t;
      })
    );
  } catch (error) {
    return next(error);
  }
});
app.use(
  "/enrichment",
  async (request, response, next) => {
    const { trackId } = request.query;
    try {
      const { body: track } = await spotifyApi.getTrack(trackId);
      const [
        { body: albumRsp },
        { body: trackAnalysisRsp }
      ] = await Promise.all([
        spotifyApi.getAlbumTracks(track.album.id),
        spotifyApi.getAudioFeaturesForTrack(trackId)
      ]);

      const payload = {
        ...track,
        audioFeature: trackAnalysisRsp
      };
      payload.album = {
        ...track.album,
        ...albumRsp
      };
      payload.spotifyId = payload.id;
      delete payload.id;
      response.status(200).json(payload);
    } catch (error) {
      next(error);
    }
  },
  handleError
);

app.use("*", proxy({ target: "http://localhost:8080", changeOrigin: true }));

app.listen(3000, async () => {
  console.log("App is listening on port 3000");
  authSpotify();
});
