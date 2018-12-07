//set any environment variables with the dotenv package:
require('dotenv').config();
const keys = require('./keys.js');
const Spotify = require('node-spotify-api');
const fs = require('fs');
const request = require('request');


//code required to import the keys.js file and store it in a variable
const spotify = new Spotify(keys.spotify);
let command = process.argv[2];
let argument = process.argv[3], queryUrl, body;


//New function called newConcert
function newConcert(){

    queryURL = `https://rest.bandsintown.com/artists/${argument}/events?app_id=codingbootcamp`;
    request(queryURL, function (error, response, body) {
        //If the request is successful
        if (!error && response.statusCode === 200) {
            body = JSON.parse(body);
            console.log(`Venue Name: ${body[0].venue.name}`);
            console.log(`Venue Location: ${body[0].venue.city},${body[0].venue.country}`);
        }
        else {
            console.log('Error has occured: ' + error);
        };
    });
}
//New function called newSong
function newSong(){
    let artists = '', query;
    if (argument) {
        query = { type: 'track', query: argument };
    }
    else {
        query = { type: 'track', query: 'What\'s My Age Again' }
    }
    spotify.search(query, function (err, data) {
        if (err) {
            return console.log('Error has occurred' + err);
        }
        body = data.tracks.items[0];
        body.artists.forEach(artist => {
            artists += artist.name;
        });
        console.log(`Artist(s): ${artists}`);
        console.log(`Song Name: ${body.name}`);
        console.log(`Preview Link: ${body.external_urls.spotify}`);
        console.log(`Album: ${body.album.name}`);
    });
   
}
//New function called newSong
function newMovie(){
    if (argument) {
        queryUrl = `http://www.omdbapi.com/?t=${argument}&apikey=trilogy`;
    } else {
        queryUrl = `http://www.omdbapi.com/?i=tt0485947&apikey=trilogy`;
    }

    request(queryUrl, function (error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            // Parsing for dot walking.
            body = JSON.parse(body);
            console.log(`Title: ${body.Title}`);
            console.log(`Year: ${body.Year}`);
            console.log(`IMDB Rating: ${body.Ratings[0].Value}`);
            console.log(`Rotten Tomatoes Rating: ${body.Ratings[1].Value}`);
            console.log(`Country: ${body.Country}`);
            console.log(`Language: ${body.Language}`);
            console.log(`Plot: ${body.Plot}`);
            console.log(`Actors: ${body.Actors}`);
        } else {
            console.log('Error occurred: ' + error);
        }
    });

}
//new function called doWhatItSays()
function doWhatItSays(){
    fs.readFile("./random.txt", "utf8", function(error, data){
        if (error) {
            return console.log('Error has occurred' + error);
        }
        else{
            var textString = data.split(",");
            var command = textString[0].trim();
            var param = textString[1].trim();

            if(command === 'spotify-this-song'){
                newSong(param);
            }
        }
    })


}
//Declaring function concert-this
switch (command.toLocaleLowerCase()) {
    case 'concert-this':
    newConcert();
        break;
//Declaring function spotify-this-song
    case 'spotify-this-song':
        newSong();
        break;
//Declaring function movie-this
    case 'movie-this':
        newMovie();
        break;
//Declaring function do-what-it-say
    case 'do-what-it-says':
        doWhatItSays();
        break;
    default:
        console.log('Invalid command!');
        break;
}



