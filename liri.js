//Sets enviromental letiables into process.env from a .env file.  These values are used within this computer only.
require("dotenv").config();

//These letiables get access to the npm's needed for each of the created functions.
let Spotify = require("node-spotify-api");
let keys = require("./keys.js");
let axios = require("axios");
let moment = require("moment");
let fs = require("fs");
let spotify = new Spotify(keys.spotify);

//argv[2] chooses users actions; argv[3] is input parameter, ie; movie title
let userCommand = process.argv[2];
var userEntry = process.argv[3];

//concatenate multiple words in 2nd user argument
for (var i = 4; i < process.argv.length; i++) {
  userEntry += "+" + process.argv[i];
}

// Writes to the log.txt file
let getArtistNames = function(artist) {
  return artist.name;
};

// Function for running a Spotify search - Command is spotify-this-song
let getSpotify = function(songName) {
  if (songName === undefined) {
    songName = "The sign";
  }
  spotify.search(
    {
      type: "track",
      query: songName
    },
    function(err, data) {
      if (err) {
        console.log("Error occured: " + err);
        return;
      }
      let songs = data.tracks.items;

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
// Function for running a Bands in Town search - Command is concert-this
let getMyBands = function(artist) {
  let queryURL =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";
  axios.get(queryURL).then(function(response) {
    let jsonData = response.data;

    if (!jsonData.length) {
      console.log(artist);
      return;
    }
    console.log("Upcoming concerts for : " + artist + " " + "will be held at ");
    console.log("------------------------------------------------------------");

    for (var i = 0; i < jsonData.length; i++) {
      let show = jsonData[i];
      console.log(
        show.venue.name +
          " " +
          "in " +
          "" +
          show.venue.city +
          ", " +
          (show.venue.region || show.venue.country) +
          " on " +
          moment(show.datetime).format("MM/DD/YYYY")
      );
    }
  });
};

// Function for running a OMDB search via axios - Command is movie-this
let getMovie = function(movieName) {
  if (movieName === undefined) {
    movieName = "Mr Nobody";

    console.log("-----------------------------------");
    console.log("If you haven't watched 'Mr Nobody', then you should:");
    console.log("It's on Netflix");
  }
  let urlHit =
    "http://www.omdbapi.com/?t=" +
    movieName +
    "&y=&plot=full&tomatoes=true&apikey=71f33c86";
  axios.get(urlHit).then(function(response) {
    let jsonData = response.data;

    console.log("Title: " + jsonData.Title);
    console.log("Year: " + jsonData.Year);
    console.log("IMDB Rating: " + jsonData.imdbRating);
    console.log("Rotten Tomatoes Rating: " + jsonData.Ratings[1].Value);
    console.log("Country: " + jsonData.Country);
    console.log("Language: " + jsonData.Language);
    console.log("Plot: " + jsonData.Plot);
    console.log("Actors: " + jsonData.Actors);
  });
};

//Function for running a search via randox.txt file - Command is do-what-it-says
let doWhat = function() {
  fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
      console.log("Error occurred: " + err);
      return;
    }
    //splitting each string in the txt file by the comma
    var dataArray = data.split(",");

    if (dataArray[0] === "spotify-this-song") {
      getSpotify(dataArray[1]);
    } else if (dataArray[0] === "movie-this") {
      getMovie(dataArray[1]);
      //Concert-this is not working
    } else if (dataArray[0] === "concert-this") {
      getMyBands(dataArray[1]);
    } else {
      //if the user entry isn't a valid command
      console.log("I Don't Know That Command...");
    }
  });
};

//Switch command
function mySwitch(userCommand) {
  //choose which statement (userCommand) to switch to and execute
  switch (userCommand) {
    case "concert-this":
      getMyBands(userEntry);
      break;

    case "spotify-this-song":
      getSpotify(userEntry);
      break;

    case "movie-this":
      getMovie(userEntry);
      break;

    case "do-what-it-says":
      doWhat(userEntry);
      break;

    default:
      return console.log(
        "\nI don't know \"" + userCommand + '" as a command.\n'
      );
  }
}
mySwitch(userCommand);
