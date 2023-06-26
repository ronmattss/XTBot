const fs = require('fs');
const path = require('path');

function readJSONFile(folderPath, fileName) {
    try {
        const absoluteFolderPath = path.join(__dirname, folderPath);
        const filePath = path.join(absoluteFolderPath, fileName);
        const fileData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        console.error('Error reading JSON file:', error);
        return null;
    }
}

function writeJSONFile(folderPath, fileName, data) {
    try {
        const absoluteFolderPath = path.join(__dirname, folderPath);
        const filePath = path.join(absoluteFolderPath, fileName);
        const jsonData = JSON.stringify(data, null, 2);
        fs.writeFileSync(filePath, jsonData);
        console.log('JSON file written successfully.');
    } catch (error) {
        console.error('Error writing JSON file:', error);
    }
}


function getAllJSONFilesInFolder(folderPath) {
    try {
        const absoluteFolderPath = path.join(__dirname, folderPath);
        const files = fs.readdirSync(absoluteFolderPath);

        const jsonFiles = files.filter((file) => path.extname(file) === '.json');

        return jsonFiles;
    } catch (error) {
        console.error('Error reading JSON files:', error);
        return [];
    }
}

// const folderPath = 'data/jsonfiles'; // Update with the folder location, relative to the project root

// try {
//     const jsonFiles = getAllJSONFilesInFolder(folderPath);
//     console.log(jsonFiles);
// } catch (error) {
//     console.error('Error:', error);
// }

// Test functions 

function addDummyJSON(folderPath, fileName) {
    try {
        const absoluteFolderPath = path.join(__dirname, folderPath);
        const filePath = path.join(absoluteFolderPath, fileName);

        const dummyData = {
            id: generateRandomID(),
            name: generateRandomName(),
            age: generateRandomAge(),
        };

        if (fs.existsSync(filePath)) {
            // File already exists, update the file
            const existingData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            const updatedData = { ...existingData, ...dummyData };
            const jsonData = JSON.stringify(updatedData, null, 2);
            fs.writeFileSync(filePath, jsonData);
            console.log('Dummy JSON file updated successfully.');
          } else {
            // File does not exist, create a new file
            const jsonData = JSON.stringify(dummyData, null, 2);
            fs.writeFileSync(filePath, jsonData);
            console.log('Dummy JSON file created successfully.');
          }
        } catch (error) {
          console.error('Error adding dummy JSON:', error);
        }
}

// Generate a random alphanumeric ID
function generateRandomID() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = '';
    for (let i = 0; i < 8; i++) {
        id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return id;
}

// Generate a random name
function generateRandomName() {
    const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace'];
    return names[Math.floor(Math.random() * names.length)];
}

// Generate a random age between 18 and 60
function generateRandomAge() {
    return Math.floor(Math.random() * (60 - 18 + 1)) + 18;
}

module.exports = { readJSONFile, writeJSONFile, addDummyJSON };