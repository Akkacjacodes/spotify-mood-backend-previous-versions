import express from 'express';


const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());


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