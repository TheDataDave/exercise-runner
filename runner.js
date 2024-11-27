/**
 * @description
 * This script is used to run the exercises defined in the exercises.js file. Designed to be run from the CLI.
 * The script takes two command line arguments:
 * 1. The path to the exercises.js file.
 * 2. (Optional) An optional command to run a specific function from the file.
 * 
 * Usage:
 * node runner.js <file-path> [--run <function-name>]
 * @param {string} filePath - The path to the exercises.js file.
 * @param {string} [command] - The type of command to run. (Optional) // --run
 * @param {string} [func] - The name of the function to run. (Optional)
 * 
 * @example
 * // Run all functions in the file
 * node runner.js exercises.js
 * 
 * @example
 * // Run the exercise_01 function
 * node runner.js exercises.js --run exercise_01
 *  
 * @author David AKA TheDataDave
 */
import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { createRequire } from 'module';

// Create a require function for the current module
const require = createRequire(import.meta.url);

// Get the command line arguments
const args = process.argv.slice(2);
const filePath = args[0];
const command = args[1];
const func = args[1] === '--run' ? args[2] : undefined;

if (!filePath) {
    console.log('Usage: node runner.js <file-path> [--run <function-name>]');
    process.exit(1);
}

// Resolve the file path relative to the current working directory
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const absoluteFilePath = path.resolve(__dirname, filePath);
const tempFileDirectoryPath = path.resolve(path.dirname(absoluteFilePath));
const tempFilePath = path.join(tempFileDirectoryPath, 'temp.js');

// Function to read file content
function readFileContent(filePath) {
    return fs.readFileSync(filePath, 'utf-8');
}

// Function to ensure top-level functions are exported
function exportTopLevelFunctions(content) {
    return content.replace(/^(async\s+)?function\s+\w+/gm, (match, p1, offset, string) => {
        const isTopLevel = string.lastIndexOf('\n', offset) === offset - 1;
        return isTopLevel ? `export ${match}` : match;
    });
}

// Function to ensure top-level classes are exported
function exportTopLevelClasses(content) {
    return content.replace(/^class\s+\w+/gm, (match, offset, string) => {
        const isTopLevel = string.lastIndexOf('\n', offset) === offset - 1;
        return isTopLevel ? `export ${match}` : match;
    });
}

function replaceReadFilePaths(content) {
    const regex = /\.readFile\(['"]([^'"]+\/)?([^'"]+)['"]/g;
    return content.replace(regex, (match, dirPath = '', fileName) => {
        const relativePath = path.join(tempFileDirectoryPath, fileName).replace(/\\/g, '/');
        return `.readFile('${relativePath}'`;
    });
}

// Main function to refactor the file
function refactorFile(filePath) {
    let content = readFileContent(filePath);

    content = exportTopLevelFunctions(content);
    content = exportTopLevelClasses(content);
    content = replaceReadFilePaths(content);

    fs.writeFileSync(tempFilePath, content, 'utf-8');

    let fsc = readFileContent(tempFilePath);
    console.log(fsc);
}

// Dynamically import the temporary file
const importTempFile = async () => {
    const exercises = await import(pathToFileURL(tempFilePath).href);
    return exercises;
};

// Arrays to store the names of passed and failed functions
const passedFunctions = [];
const failedFunctions = [];

// Helper function to execute a function and handle errors
const executeFunction = (func, funcName) => {
    try {
        console.log('-'.repeat(25));
        console.log(`Running ${funcName}:\n`);
        func();
        console.log(`${funcName} passed\n`);
        passedFunctions.push(funcName);
    } catch (error) {
        console.log(`${funcName} failed\n`);
        console.error(error);
        failedFunctions.push(funcName);
    }
};

// Utility to determine if a function is a class
function isClass(fn) {
    return typeof fn === 'function' && /^\s*class\s+/.test(fn.toString());
}

// Main execution logic
(async () => {
    // Refactor the file before running
    refactorFile(absoluteFilePath);
    const exercises = await importTempFile();

    // Filter out exported classes
    const nonClassExports = Object.entries(exercises).filter(([_, value]) => !isClass(value));

    if (command === '--run' && func) {
        if (exercises[func] && !isClass(exercises[func])) {
            executeFunction(exercises[func], func);
        } else {
            console.log(`Function ${func} not found or is a class`);
        }
    } else if (!command) {
        for (const [funcName, func] of nonClassExports) {
            executeFunction(func, funcName);
        }
    } else {
        console.log(`Invalid command supplied: ${command}`);
    }

    console.log('Passed functions:', passedFunctions);
    console.log('Failed functions:', failedFunctions);
    // Cleanup tempfile
    fs.unlinkSync(tempFilePath);
})();
