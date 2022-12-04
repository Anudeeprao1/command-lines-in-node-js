const fs = require('fs');
const exec  = require('child_process').exec;
const readline = require('readline');
const path=require('path');

var background = [];
var current = null;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function doIO() {
  if(!current) return;
  rl.on('line', (line) => {
    if(current)
      current.stdin.write(line + '\n');
  });
  current.on('close', (code) => {
    console.log(`child process exited with code ${code}.`);
    current.callbacks.resolve();
    delete background[current.pid];
    current = null;
  });
  current.stdout.on('data', (data) => {
    console.log(`stdout: "${data}"`);
  });
  current.stderr.on('data', (data) => {
    console.log(`stderr: "${data}"`);
  });
}

function writeInput(text) {
  if(!current) return;
  current.stdin.write(text);
}

function exitCurrent(code) {
  current.kill(code);
}


function run(command = "") {
  return new Promise((resolve, reject) => {
    if(current) {
      writeInput(command);
      return;
    }
    var comm = command.split(' ');
    if(comm[0] == "cd") {
        if(!fs.existsSync(comm[1]))
        {
            console.log("file doesn't exist ");
        }
        else{
                let currentpath=path.join(__dirname,comm[1]);
                console.log(currentpath);
        }
        rl.close();
    } else if(comm[0] == "ls") {
        if(!fs.existsSync(comm[1]))
        {
             console.log("file doesn't exist ");
        }
        else{

             let filenames = fs.readdirSync(comm[1]);
             filenames.forEach((file) => {
            console.log(file);
            });
            }
            rl.close();   
    } else if(comm[0] == "pwd") {
        const dirName = path.join(__dirname);
        console.log(dirName);
        rl.close();
    } else if(comm[0] == "exit") {
      rl.close();
    } else if(comm[0] == "fg" && isNum(comm[1])) {
      foreground(parseInt(command), callback = {resolve: resolve, reject: reject});
    } else if(comm[0].split('.').pop() == 'exe' && fs.existsSync(comm[0])) {
      curr = exec(command,
      function (error, stdout, stderr) {
        if (error !== null) {
          console.log('exec error:', error);
        }
        if(stderr) {
          // console.error(stderr);
        }
      });
      current = curr;
      current.callbacks = {
        resolve: resolve,
        reject: reject
      }
      console.log("Executing file " + comm[0] + " with process " + current.pid);
      doIO();
    } else {
      console.log("Command not found : " + command);
      resolve();
    }
    
  })
}

function ask() {
  rl.question('>>> ' , command => {
    run(command).then(ask);
  });
}

function sendBackground() {
  if(current) {
    background[current.pid] = current;
    console.log("Running in background : " + current.pid);
    current.callbacks.resolve();
    current = null;
  }
}

function foreground(id, callbacks) {
  if(current) {
    console.log("Already one process with pid " + current.pid + " executing in foreground");
    callbacks.resolve();
  } else if(!background[id]) {
    console.log("Process with process ID " + id + " doesnt exists");
    callbacks.resolve();
  } else {
    console.log("process " + id + " brought foreword");
    current = background[id];
    current.callbacks = callbacks;
  }
}

rl.on("SIGINT", ()=>{
  if(!current && background.length == 0) rl.close();
  else if(current) {
    exitCurrent("SIGINT");
  }
});

process.stdin.on('keypress', (k) => {
  if(k == '\x1a' && current) sendBackground();
});

function isNum(num) {
  return !isNaN(num);
}

ask();