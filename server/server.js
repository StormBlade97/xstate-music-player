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
  let retryLeft = 1;
  const { CLIENT_ID, CLIENT_SECRET } = process.env;
  const token = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
  while (retryLeft > 0) {
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
      setTimeout(authSpotify, expires_in * 1000);
    } catch (error) {
      console.error(error.response);
      retryLeft--;
    }
    await new Promise(resolve => {
      setTimeout(resolve, 20000);
    });
  }
  console.error("All retries to auth failed. Aborting");
}
app.use("/search", async (req, res) => {
  const { q } = req.query;
  axios
    .get(
      `https://kgsearch.googleapis.com/v1/entities:search?query=${q}&key=${process.env.GOOGLE_API_KEY}&limit=1&indent=True`
    )
    .then(r => {
      res.json(r.data);
    })
    .catch(() => res.send(500));
});
app.use(
  "/album-arts",
  async (request, response, next) => {
    const { q } = request.query;
    try {
      const { body } = await spotifyApi.searchTracks(q);
      const { id, name, album } = body.tracks.items[0];
      const { images, artists } = album;
      response.json({ id, images, artists, name });
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
