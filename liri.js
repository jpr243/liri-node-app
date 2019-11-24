//Sets enviromental variables into process.env from a .env file.  These values are used within this computer only.
require("dotenv").config();

//These variables get access to the npm's needed for each of the created functions.
var Spotify = require("node-spotify-api");
var keys = require("./keys.js");
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var spotify = new Spotify(keys.spotify);

var getArtistNames = function(artist) {
  return artist.name;
};

var getSpotify = function(songName) {
  if (songName === undefined) {
    songName = "What's my age again";
  }
  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log(err);
        return;
      }
      var songs = data.tracks.items;

      for (var i = 0; i < songs.length; i++) {
        console.log(i);
        console.log("artist(s): " + songs[i].artists.map(getArtistNames));
        console.log("song name: " + songs[i].name);
        console.log("preview song: " + songs[i].preview_url);
        console.log("album: " + songs[i].album.name);
        console.log("-----------------------------------");
      }
    }
  );
};
var getMyBands = function(artist) {
  var queryURL =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";
  axios.get(queryURL).then(function(response) {
    var jsonData = response.data;

    if (!jsonData.length) {
      console.log(artist);
      return;
    }
    console.log("Upcoming concerts for : " + artist);
    for (var i = 0; i < jsonData.length; i++) {
      var show = jsonData[i];
      console.log(
        show.venue.city +
          "," +
          (show.venue.region || show.venue.country) +
          " at " +
          show.venue.name +
          " " +
          moment(show.datetime).format("DD/MM/YYYY")
      );
    }
  });
};
var getMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";
  }
  var urlHit =
    "http://www.omdbapi.com/?t=" +
    movieName +
    "&y=&plot=full&tomatoes=true&apikey=71f33c86";
  axios.get(urlHit).then(function(response) {
    var jsonData = response.data;

    console.log("Title: " + jsonData.Title);
    console.log("Year: " + jsonData.Year);
    console.log("Rated: " + jsonData.Rated);
    console.log("IMDB Rating: " + jsonData.imdbRating);
    console.log("Country: " + jsonData.Country);
    console.log("Language: " + jsonData.Language);
    console.log("Plot: " + jsonData.Plot);
    console.log("Actors: " + jsonData.Actors);
    console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
  });
};
