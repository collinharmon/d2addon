const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const {exec, fork} = require('child_process');
const { lstat } = require('fs');
var config_connections = require('./mysql_connections.js');

const exec_options = {
    cwd: null,
    env: null,
    encoding: 'utf8',
    timeout: 0,
    maxBuffer: 200 * 1024,
    killSignal: 'SIGTERM'
};

const storage = multer.diskStorage({
   destination: './public/uploads/',
   filename: function(req, file, cb){
       cb(null, req.query.username + '_' + file.originalname.substring(0, file.originalname.length-4) + '-' + Date.now() + path.extname(file.originalname));
   } 
});

const upload = multer({
    storage: storage
});

const app = express();

const connection = mysql.createConnection(config_connections.admin);

connection.connect(err => {
    if(err){
        console.log(err);
        return err;
    }
    else{
        console.log("Connect success");
    }
});

app.use(cors());

app.get('/', (req, res) => {
    const { username, password } = req.query;
    /*const GET_USER_QUERY = `select * from users where username = '${username}' and password = '${password}'`;*/
    //const GET_USER_QUERY = `select * from users where password = '${password}'`;
    const GET_USER_QUERY = `select username, password from users where username = '${username}' and password = '${password}'`;
    connection.query(GET_USER_QUERY, (err, results) => {
        if(err){
            console.log("hunnnsnn");
            return res.send(err);
        }
        else {
            console.log(results);
            return res.json(results);
        }
    })
});

app.post('/Createaccount', (req, res) =>{
    const { username, password } = req.query;
    const GET_USER_QUERY = `select username from users where username = '${username}'`;
    const INSERT_USER_QUERY = `insert into users (username, password) values ('${username}', '${password}');`
    connection.query(GET_USER_QUERY, (err, results) => {
        if(err){
            console.log("hunnnsnn");
            return res.send(err);
        }
        else {
            console.log(results.length);
            if(results.length != 0) res.sendStatus(467);
            else{
                connection.query(INSERT_USER_QUERY, (err, results) => {
                    if(err){
                        return res.send(err);
                    }
                    else{
                        res.sendStatus(200);
                    }
                });
            }
        }
    })

});

app.post('/upload', upload.single('thefile'), (req, res) => {
    const {username} = req.query;
    /*const q = req.query;
     *console.log(q.username);
    */

    console.log(req.body);
    console.log(req.file);
    
        childProcess = fork("./fileupload/handlefile.js");
        childProcess.on('message', (msg) => {
            console.log(`PARENT: message from child process is ${msg}`);
        });
        childProcess.send({"filepath":`${__dirname}\\${req.file.path}`});
    /*exec('java -jar C:\\Users\\colli\\d2reader\\out\\artifacts\\d2reader_jar\\d2reader.jar', exec_options, (err, stdout, stderr) => {
        console.log("exec");
        if(stdout){
            console.log("stdout: " + stdout);
        } else if(stderr){
            console.log("stderr: " + stderr);
        }
        //so we can perhaps fork a nodejs process which spawns the java process and inturn will handle the callback
        childProcess = fork("./fileupload/handlefile.js");
        childProcess.on('message', (msg) => {
            console.log(`PARENT: message from child process is ${msg}`);
        });
        childProcess.send({"number":69})
    });*/
    res.sendStatus(200);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));