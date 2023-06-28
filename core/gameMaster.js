const fs = require('fs');
const path = require('path');
const Game = require('../classes/gameClass');
const { writeJSONFile, readJSONFile } = require('../helpers/jsonWriter');
let possibleParticipants;
let currentGame;


// a match will be stored in a JSON file which contains properties
// current game is a GAME that is currently active
// Checks for a current game
// if non found create a new game (JSON)









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
  return currentGame.participants[13];
}
function saveCurrentGameState() {
  writeJSONFile('../files/games', 'game.json', currentGame, true);
}

function removeParticipantInGame(user) {
  console.log("Removing participant: " + user.username);
  return;
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


// Test Function/s

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





module.exports = { checkForGames, randomlySelectAParticipant, removeParticipantInGame, initializeParticipants, addUserToListOfParticipants, checkParticipants, instantiateGame, possibleParticipants }