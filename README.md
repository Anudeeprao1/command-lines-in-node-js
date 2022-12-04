# Command Lines In Node JS
In this repo following commands are implemented

 Following commands must work :
 1. cd <directory_name> - Should work same as bash shell.
 2. pwd - Prints current working directory.
 3. ls <directory_name> - Should work same as bash shell. Support for flags is not required.
 4. <path_to_binary> <args>- When path to a binary is provided, that binary should be spawned    as a child process. The binary must receive all the arguments passed as space separated      like arg1 arg2 ….
 5. fg <pid> - Brings the background process with process id <pid> to foreground.
 6. exit - Closes the shell.

Following key combination should work :
 1. Ctrl + C - Sends a SIGINT to the spawned process.
 2. Ctril + Z - Sends spawned process that is currently in foreground to the background.          Prints it’s pid after setting the current process as background process.

## Installation

Command Lines In Node JS requires [Node.js](https://nodejs.org/) v10+ to run.

Install the dependencies and devDependencies and start the server.

```sh
npm i
npm i nodemon -g
```

## License

MIT


