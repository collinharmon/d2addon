const {execSync} = require('child_process');
const exec_options = {
    cwd: null,
    env: null,
    encoding: 'utf8',
    timeout: 0,
    maxBuffer: 200 * 1024,
    killSignal: 'SIGTERM'
};

process.on('message', msg=>{

  //console.log("CHILD: message received from parent process", msg);
  testIt(msg.filepath);
  process.exit();
});

const testIt = (filepath) =>{


  //so other way would be to have the main Node.js process handle the process exits for the java spawns.
  //this way the main node.js process will simply spawn a child thread for every fileset to deal with
  //it seems good from an abstraction point of view, keep all the file operation business away from the main Node.JS thread.
  //process.send(`java -jar C:\\Users\\colli\\d2reader\\out\\artifacts\\d2reader_jar\\d2reader.jar ${__dirname}\\${filepath}`);
  //will implement other way and test metrics
  execSync(`java -jar C:\\Users\\colli\\d2reader\\out\\artifacts\\d2reader_jar\\d2reader.jar ${filepath}`, exec_options, (err, stdout, stderr) => {
      console.log("exec");
      process.send("In exec");
      if(stdout){
          console.log("from child stdout: " + stdout);
          process.send(stdout);
      } else if(stderr){
          console.log("from child stderr: " + stderr);
          process.send(stderr);
      }
      //process.exit();
      //so we can perhaps fork a nodejs process which spawns the java process and inturn will handle the callback
      /*childProcess = fork("./fileupload/handlefile.js");
      childProcess.on('message', (msg) => {
          console.log(`PARENT: message from child process is ${msg}`);
      });
      childProcess.send({"number":69})*/
  });

};