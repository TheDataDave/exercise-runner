# Runner.js

## Installation
To use `runner.js`, download it to a directory accessible by Node.js. Ensure it's in the same directory or a parent directory of the JavaScript file containing the functions you want to run (e.g., `exercises.js`).

---

## Description

### Non-Technical Explanation
`runner.js` is a utility script that makes it easy to run functions from another JavaScript file. Whether you want to test all the functions or just one, this script handles the process for you. It’s especially useful for quickly verifying code without modifying the original file.

### Technical Explanation
`runner.js` is a Node.js script that dynamically imports functions from a specified JavaScript file by creating a temporary modified version of the file with export statements. It can:
- Execute all functions in the file.
- Execute a specific function when specified via a command-line argument.
- Converts all functions to async functions and runs them concurrently, may get weird results if function called pauses execution outside of async e.g. promises.all() in a synchronous function

The script also logs which functions executed successfully and handles errors for failed functions.

---

## CLI Usage

### Run All Functions
To execute all functions in a JavaScript file:
1. Open a terminal.
2. Navigate to the directory containing `runner.js` and the target JavaScript file.
3. Use the command:
   ```sh
   node runner.js <file-path>
   ```
   Replace `<file-path>` with the path to your JavaScript file (e.g., `exercises.js`).

### Run a Specific Function
To run a specific function:
1. Open a terminal.
2. Navigate to the directory containing `runner.js` and the target JavaScript file.
3. Use the command:
   ```sh
   node runner.js <file-path> --run <function-name>
   ```
   Replace `<file-path>` with the path to your JavaScript file (e.g., `exercises.js`) and `<function-name>` with the name of the function you want to execute (e.g., `exercise_01`).

---

## Example

### Example Input File: `exercises.js`
```javascript
function exercise_01() {
    console.log('Hello, world!');
}

function exercise_02() {
    console.log('Goodbye, world!');
}
```

### Commands to Run

1. Run All Functions:
   ```sh
   node runner.js exercises.js
   ```

2. Run a Specific Function:
   ```sh
   node runner.js exercises.js --run exercise_01
   ```

### Example Output
**For All Functions:**
```
-------------------------
Running exercise_01:

Hello, world!

exercise_01 executed successfully.
-------------------------
Running exercise_02:

Goodbye, world!

exercise_02 executed successfully.
-------------------------
=========================
Passes: 2, Fails: 0
=========================
```

**For a Specific Function (`exercise_01`):**
```
-------------------------
Running exercise_01:

Hello, world!

exercise_01 executed successfully.
-------------------------
=========================
Passes: 1, Fails: 0
=========================
```

---

## Features
- **Dynamic Function Import:** Automatically modifies the target file to make functions accessible.
- **Error Handling:** Reports errors for functions that fail during execution.
- **Temporary File Cleanup:** Ensures temporary files are deleted after execution.

---

## Troubleshooting
1. **Unknown Function Error:** Ensure the function name matches exactly, including case sensitivity.
2. **Permission Denied:** Verify you have write permissions in the directory for temporary file creation.
3. **Invalid File Path:** Provide a valid relative or absolute path to the JavaScript file.

For additional help, refer to the usage examples above.

---

## TODO
### Planned Enhancements
1. **Support for External Files:**
   - Implement functionality to handle string templates file handling e.g. fs.readFile(`${path}/file.txt`)

These enhancements aim to make `runner.js` more robust and versatile, supporting a wider range of use cases.
