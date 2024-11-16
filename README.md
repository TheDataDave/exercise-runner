# Runner.js

## Description

### Non-Technical Explanation

`runner.js` is a script that helps you run functions from another JavaScript file. You can use it to run all the functions in the file or just a specific one. This can be useful for testing or executing specific pieces of code without having to manually call each function.

### Technical Explanation

`runner.js` is a Node.js script that dynamically imports and executes functions from a specified JavaScript file. It reads the file, modifies it to export the functions, creates a temporary file with the modified content, and then imports and runs the functions. The script can run all functions or a specific function based on command line arguments.

### CLI Usage

To run all functions in a JavaScript file:

1. Open a terminal or command prompt.
2. Navigate to the directory containing `runner.js` and your JavaScript file.
3. Run the following command:

   ```sh
   node runner.js <file-path>

Replace <file-path> with the name of your JavaScript file (e.g., exercises.js).

## Running a Specific Function
To run a specific function in a JavaScript file:

### Open a terminal or command prompt.
Navigate to the directory containing runner.js and your JavaScript file.

Run the following command:

```node runner.js <file-path> --run <function-name>```

Replace <file-path> with the name of your JavaScript file (e.g., exercises.js) and <function-name> with the name of the function you want to run (e.g., exampleFunction).

## Running All Functions
To run all functions in exercises.js, use the command:

```node runner.js <file-path>```

## Example
Assume you have a file named exercises.js with the following content:
```
function exercise_01() {
    console.log('Hello, world!');
}

function exercise_02() {
    console.log('Goodbye, world!');
}
```

### Run Command

```node runner.js path/to/your/code/exercises.js```

Output
The script will display the output of each function in the terminal. It will also provide a summary of the number of functions that passed and failed.

Example Output:
```
Running exercise_01...
exercise_01 executed successfully.
----------------------------------------
Running exercise_02...
exercise_02 executed successfully.
----------------------------------------
Passes: 2, Fails: 0
----------------------------------------
```
