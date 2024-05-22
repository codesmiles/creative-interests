#!/usr/bin/env node

// this command line is used to count the number of words in a file
// chmod +x ccwc.js && sudo mv ccwc.js /usr/local/bin/ccwc

const fs = require("fs");
const path = require("path");

// read the file
const readFile = (filename, type = null) => {
  return fs.readFileSync(filename, type);
};

// step 1
/**
 * Counts the number of bytes of a file.
 *
 * @param {string} filename - The path to the file to be read.
 * @returns {number} The number of bytes in the file.
 * @throws {Error} If the file does not exist.
 */
function countBytes(filename) {
  try {
    const data = readFile(filename);
    return data.length;
  } catch (error) {
    console.error(`ccwc: ${filename}: No such file or directory`);
    process.exit(1);
  }
}

// step 2
/**
 * Counts the number of lines in a file.
 *
 * @param {string} filename - The path to the file to be read.
 * @returns {number} The number of lines in the file.
 * @throws {Error} If the file does not exist.
 */
function countLines(filename) {
  try {
    const data = readFile(filename, "utf8");
    const lines = data.split(/\r\n|\r|\n/);
    return lines.length - 1;
  } catch (error) {
    console.error(`ccwc: ${filename}: No such file or directory`);
    process.exit(1);
  }
}

// step 3
/**
 * Counts the number of words in a file.
 *
 * @param {string} filename - The path to the file to be read.
 * @returns {number} The number of words in the file.
 * @throws {Error} If the file does not exist.
 */
function countWords(filename) {
  try {
    const data = readFile(filename, "utf8");
    const words = data.split(/\s+/);
    const wordCount = words ? words.length : 0;
    return wordCount;
  } catch (error) {
    console.error(`ccwc: ${filename}: No such file or directory`);
    process.exit(1);
  }
}

/**
 * Counts the number of characters in a file.
 *
 * @param {string} filename - The path to the file to be read.
 * @returns {number} The number of characters in the file.
 * @throws {Error} If the file does not exist.
 */
function countCharacters(filename) {
  try {
    const data = readFile(filename, "utf8");
    return data.split("").length;
  } catch (error) {
    console.error(`ccwc: ${filename}: No such file or directory`);
    process.exit(1);
  }
}

/**
 * Main function that processes the command line arguments and calls the appropriate function based on the provided command.
 *
 * @param {Array} args - The command line arguments provided by the user.
 * @param {Array} commands - An array of valid commands that the program can process.
 *
 * @returns {void} - This function does not return any value. It prints the result of the processed command to the console.
 */
function main() {
  const args = process.argv.slice(2);
  const commands = ["-c", "-l"];
  
    if(args.length == 1) {
      console.log(`${countBytes(args[0])} ${countLines(args[0])} ${countWords(args[0])} ${countCharacters(args[0])} ${args[0]}`);
      process.exit(1);
    }

  switch (args[0]) {
    case "-c":
      console.log(`${countBytes(args[1])} ${args[1]}`);
      break;

    case "-l":
      console.log(`${countLines(args[1])} ${args[1]}: `);
      break;
    case "-w":
      console.log(`${countWords(args[1])} ${args[1]}`);
      break;
    case "-m":
      console.log(`${countCharacters(args[1])} ${args[1]}`);
      break;
    default:
      console.error(`Unknown command: ${args[0]}`);
      break;
  }
}

main();