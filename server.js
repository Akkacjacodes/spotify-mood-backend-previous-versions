import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

import dotenv from 'dotenv';
dotenv.config();
const client_id = process.env.SPOTIFY_CLIENT_ID; 
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

if (!client_id || !client_secret) {
  console.error('Spotify client ID or secret is undefined. Check your environment variables.');
  process.exit(1); // Exit the process if the credentials are not set
}

app.use(cors());


async function getSpotifyToken() {
  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64'),
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}


app.get('/nowpopular', async (req, res) => {
  const token = await getSpotifyToken();
  const response = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  console.log(data);
res.send(data);
});

app.get('/greeting', (req, res) => {
  res.json({
    success: true,
    message: "Hello, World"
  })
})



// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});












// // Route for Spotify authentication
// app.get("/authenticate", async (req, res) => {
//   const credentials = Buffer.from(
//     `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
//   ).toString("base64");
//   const spotifyUrl = "https://accounts.spotify.com/api/token";
//   const data = "grant_type=client_credentials";

//   try {
//     const response = await axios.post(spotifyUrl, data, {
//       headers: {
//         Authorization: `Basic ${credentials}`,
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//     });

//     res.json({ accessToken: response.data.access_token });
//     console.log(response.data.access_token);
//   } catch (error) {
//     console.error("Error authenticating with Spotify:", error.response.data);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });