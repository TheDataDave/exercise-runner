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
const absoluteFilePath = path.resolve(process.cwd(), filePath);

// Read the content of the exercises.js file
const fileContent = fs.readFileSync(absoluteFilePath, 'utf-8');

// Add export statements to the functions
const modifiedContent = fileContent.replace(/function\s+(\w+)/g, 'export function $1');

// Create a temporary file with the modified content
const tempFilePath = path.resolve(process.cwd(), 'temp_exercises.js');
fs.writeFileSync(tempFilePath, modifiedContent);

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
        console.log(`\n${funcName} executed successfully.`);
        console.log('-'.repeat(25));
        passedFunctions.push(funcName);
    } catch (error) {
        console.error(`Error executing ${funcName}:`);
        console.error(`Error message: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
        failedFunctions.push(funcName);
    }
};

// Execute the function from the imported module
const runFunction = async () => {
    try {
        const exercises = await importTempFile();
        // console.log('Imported exercises:', exercises); // Debugging line

        if (command === '--run') {
            if (typeof exercises[func] === 'function') {
                executeFunction(exercises[func], func);
            } else {
                console.log(`Unknown function: ${func}. Please use one of the functions defined in the file.`);
            }
        } else {
            console.log('Running all exercises...');
            for (const funcName in exercises) {
                if (typeof exercises[funcName] === 'function') {
                    executeFunction(exercises[funcName], funcName);
                }
            }
        }

        // Print passes and fails
        console.log('='.repeat(25));
        console.log(`Passes: ${passedFunctions.length}, Fails: ${failedFunctions.length}`);
        console.log('='.repeat(25));

    } catch (error) {
        console.error('An error occurred while importing the module:');
        console.error(`Error message: ${error.message}`);
        console.error(`Stack trace: ${error.stack}`);
    } finally {
        // Clean up the temporary file
        fs.unlinkSync(tempFilePath);
    }
};

runFunction();