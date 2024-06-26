import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

let origins = [
  "https://a3e2d23b-5002-4170-8367-7eff2bf885dd.e1-us-cdp-2.choreoapps.dev",
  "https://c5c09e16-156c-4f13-92bb-b98a1ac69c9a.e1-us-cdp-2.choreoapps.dev",
  "https://f0cbb6d2-37d8-4407-af6c-059fd5d9ff1f.e1-us-cdp-2.choreoapps.dev",
  "https://f0cbb6d2-37d8-4407-af6c-059fd5d9ff1f.e1-us-cdp-2.choreoapps.dev",
  "https://60c6ef1e-8ec9-40fd-856b-502073f4e6d1.e1-us-cdp-2.choreoapps.dev",
];

console.log(`Environment: ${process.env.NODE_ENV}`);

if (process.env.NODE_ENV === "dev") {
  origins = ["http://localhost:5173"];
}

const corsOptions = {
  origin: origins,
  optionsSuccessStatus: 200, // For legacy browsers
};

app.use(cors(corsOptions));

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

if (!client_id || !client_secret) {
  console.error(
    "Spotify client ID or secret is undefined. Check your environment variables."
  );
  process.exit(1);
}

async function getSpotifyToken() {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      body: "grant_type=client_credentials",
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Error fetching Spotify token:", error);
    throw new Error("Failed to fetch Spotify token");
  }
}

app.get("/api/newpopular", async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const spotifyResponse = await fetch('https://api.spotify.com/v1/browse/featured-playlists', {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await spotifyResponse.json();
    res.send(data);
  } catch (error) {
    console.error("Error proxying the playlists request:", error);
    res.status(500).json({ message: "Failed to fetch playlists from Spotify" });
  }
});

app.get("/greeting", (req, res) => {
  res.json({
    success: true,
    message: "Hello, World",
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
