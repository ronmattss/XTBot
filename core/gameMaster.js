const fs = require('fs');
const path = require('path');
const Game = require('../classes/gameClass');
const { writeJSONFile, readJSONFile } = require('../helpers/jsonWriter');
let possibleParticipants;
let currentGame;
let previousIndex = -1;


// a match will be stored in a JSON file which contains properties
// current game is a GAME that is currently active
// Checks for a current game
// if non found create a new game (JSON)



// EVENT RANDOMIZER
function getRandomCategory(categories) {
  const categoryKeys = Object.keys(categories);
  const randomIndex = Math.floor(Math.random() * categoryKeys.length);
  return categoryKeys[randomIndex];
}

function getRandomEvent(events) {
  const randomIndex = Math.floor(Math.random() * events.length);
  return events[randomIndex];
}



// Select a random event from the chosen category
//const randomEvent = getRandomEvent(events, randomCategory);

// console.log('Random Category:', randomCategory);
// console.log('Random Event:', randomEvent);
//


function TriggerARandomEvent() {
  const events = readJSONFile("../files/events", "events.json");

  const randomCategory = getRandomCategory(events);
  const randomEvent = getRandomEvent(events[randomCategory]);
  console.log("Random Event:", randomEvent);
  let randomizeEvent = randomEvent;

  return randomizeEvent;
}


function getPossibleParticipants() {
  return possibleParticipants;
}

function checkForGames() {
  currentGame = readJSONFile('../files/games', 'game.json');
  if (currentGame != undefined || currentGame != null) {
    console.log("Loaded previous game");
  }
  else {
    console.log("no games found!");
  }
}

async function checkCurrentGames(interaction) {
  const channelId = '400627470048428042'; // Replace with the ID of the channel you want to send the message to
  const channel = interaction.guild.channels.cache.get(channelId);
  if (currentGame == undefined) {
    await channel.send("There are no current games Active!");
  }
  else {
    await channel.send("Starting current game...");
    // start setInterval function Invoking
    // load all events
  }

}

async function startGame(interaction) {
  const channelId = '400627470048428042'; // Replace with the ID of the channel you want to send the message to
  const channel = interaction.guild.channels.cache.get(channelId);
  if (currentGame == undefined) {
    await channel.send("No current Game detected");
    return;
  }
  // do stuff
  // Invoke an intro event
  // start setInterval function
}

function instantiateGame(gameName, gameLength) {
  if (currentGame == undefined) {
    let newGame = new Game(gameName, getPossibleParticipants(), gameLength);
    //console.log(newGame.participants);
    currentGame = newGame;
    console.log("Created a new game, please use command startgame to start the current game. Game will not start if there are few participants");
    saveCurrentGameState();
    return currentGame;
  }
  console.log("There is an on-going game");
  return currentGame;
}

// Functions for the currentGame

function randomlySelectAParticipant() {
  return getRandomElement(currentGame.participants, previousIndex);
}
function saveCurrentGameState() {
  writeJSONFile('../files/games', 'game.json', currentGame, true);
}



function removeParticipantInGame(user) {
  console.log("Removing participant: " + user.username);
  console.log(currentGame.checkParticipants())
  for (let i = 0; i < currentGame.checkParticipants.length; i++) {
    const participant = currentGame.checkParticipants[i];

    if (participant.username === user.username) {
      // Remove the participant from the array
      currentGame.checkParticipants.splice(i, 1);
      console.log("Participant removed successfully.");
      return true;
    }
  }

  console.log("Participant not found.");
  return false;
}

// Functions for game events





// end functions for game events


// Functions for Randomizing things
function getRandomElement(array, excludedIndex) {
  const availableIndices = array
    .map((_, index) => index)
    .filter(index => index !== excludedIndex);

  const randomIndex = Math.floor(Math.random() * availableIndices.length);
  return array[availableIndices[randomIndex]];
}



// Functions for all Participant operations

// initialize the possibleParticipants whenever the bot starts
function initializeParticipants() {
  possibleParticipants = readJSONFile('../files/participants', 'participants.json');
  //console.log(possibleParticipants);
  if (possibleParticipants == undefined || possibleParticipants.length == 0) {
    writeJSONFile('../files/participants', 'participants.json', possibleParticipants, true);
    console.log("use the command \" \"\\Join game \" to be a participant\"");
  }
  console.log("Current participant/s no. : " + possibleParticipants.length);
}


// Basically this will just add participants to the possibleParticipants List
function addUserToListOfParticipants(user) {
  console.log("adding user: " + user.username);
  for (const element of possibleParticipants) {
    // check if user is already a participant
    if (element.username === user.username) {
      console.log("Already a Participant");
      return false;
    }
  }
  console.log("Adding participant...");
  possibleParticipants.push(user);
  writeJSONFile('../files/participants', 'participants.json', possibleParticipants, true);
  // save to JSON
  return true;
}

//TODO: EVENT and SETinterval FUNCTIONS

function GameStartEvent() { }
function GameUpdateEvent() { } // set interval?
function GameExitEvent() { }

let functionsToInvoke = [];
let intervalId; // Declare a variable to store the interval ID
let updateCount = 0;

function updateInvokeCount() {
  updateCount++;
}

// WHEN YOU CALL THIS FUNCTION REMOVE IT FROM THE ARRAYLIST
function removeResetterFunction() {
  reset(5,invokeFunctions);
  removeElement(functionsToInvoke,removeResetterFunction);
}

// This is called every update ()
function invokeFunctions() {
  functionsToInvoke.forEach((func) => {
    func();
  });
}

function resetInterval(minutes, callBack) {
  clearInterval(intervalId); // Clear the existing interval
  createIntervalInMinutes(callBack, minutes); // Create a new interval with the updated time
}

functionsToInvoke.push(updateInvokeCount);
functionsToInvoke.push(removeResetterFunction);



// STARTS EVENT INVOKING 
function createIntervalInMinutes(callBack, minutes) {
  const milliseconds = minutes * 60 * 1000;
  intervalId = setInterval(callBack, milliseconds);
}

// RESETS THE INTERVAL
function reset(minutes, callBack) {
  setTimeout(() => {
    resetInterval(minutes, callBack); // Reset the interval to 10 minutes
  }, 10 * 60 * 1000);
}





// Reset Event Invoking 


// Test Function/s

// Array helper
function removeElement(array, element) {
  const index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

function checkParticipants(client) {
  const guild = client.guilds.cache.get('400626052197646336');
  // guild.members.cache.forEach(member => console.log(member.user.username)); 
  const channel = client.channels.cache.get('400627470048428042');
  const role = guild.roles.cache.get('750348631042949120');

  if (!role) {
    console.log('Role not found.');
    return;
  }

  possibleParticipants = readJSONFile('../files/participants', 'participants.json');

  // Fetch all members and filter by role
  if (possibleParticipants == null) {
    guild.members.fetch()
      .then(members => {
        const membersWithRole = members.filter(member => member.roles.cache.has(role.id));
        console.log(`Members with the role "${role.name}":`);

        const usernames = membersWithRole.map(member => member.user);
        console.log(usernames);

        writeJSONFile('../files/participants', 'participants.json', usernames, true)
      })
      .catch(console.error);
  }



}





module.exports = { TriggerARandomEvent, checkForGames, checkCurrentGames, randomlySelectAParticipant, removeParticipantInGame, initializeParticipants, addUserToListOfParticipants, checkParticipants, instantiateGame, possibleParticipants }