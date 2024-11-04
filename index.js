const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3000;

let cors = require('cors');
let sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');

app.use(cors());
app.use(express.json());

//app.use(express.static('static'));

let db;

(async () => {
  db = await open({
    filename: './tracks_database.sqlite',
    driver: sqlite3.Database,
  });
})();

//Function which returns all tracks from the database
async function getAllTracks() {
  let query = 'SELECT * FROM tracks';
  let response = await db.all(query, []);

  return { tracks: response };
}

//Endpoint 1: Retrieve All Tracks
app.get('/tracks', async (req, res) => {
  try {
    let result = await getAllTracks();

    if (result.tracks.length === 0) {
      return res.status(404).json({ message: 'No tracks found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function which returns tracks for a given artist from the database
async function getTracksByArtist(artist) {
  let query = 'SELECT * FROM tracks WHERE artist = ?';
  let response = await db.all(query, [artist]);

  return { tracks: response };
}

//Endpoint 2: Retrieve Tracks by Artist
app.get('/tracks/artist/:artist', async (req, res) => {
  try {
    let artist = req.params.artist;
    let result = await getTracksByArtist(artist);

    if (result.tracks.length === 0) {
      return res.status(404).json({ message: 'No tracks found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function which returns tracks for a given genre from the database
async function getTracksByGenre(genre) {
  let query = 'SELECT * from tracks WHERE genre = ?';
  let response = await db.all(query, [genre]);

  return { tracks: response };
}

//Endpoint 3: Retrieve Tracks by Genre
app.get('/tracks/genre/:genre', async (req, res) => {
  try {
    let genre = req.params.genre;
    let result = await getTracksByGenre(genre);

    if (result.tracks.length === 0) {
      return res.status(404).json({ message: 'No tracks found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

//Function which returns tracks for a given release year from the database
async function getTracksByReleaseYear(year) {
  let query = 'SELECT * FROM tracks WHERE release_year = ?';
  let response = await db.all(query, [year]);

  return { tracks: response };
}

//Endpoint 4: Retrieve Tracks by Release Year
app.get('/tracks/release_year/:year', async (req, res) => {
  try {
    let year = req.params.year;
    let result = await getTracksByReleaseYear(year);

    if (result.tracks.length === 0) {
      return res.status(404).json({ message: 'No tracks found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
