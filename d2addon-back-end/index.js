const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const {exec, fork} = require('child_process');
const { lstat } = require('fs');
//const {doQuery, pool} = require('./mysqlConnector');
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
    });
});

app.post('/Createaccount', (req, res) =>{
    const { username, password } = req.query;
    const GET_USER_QUERY = `select username from users where username = '${username}'`;
    const INSERT_USER_QUERY = `insert into users (username, password) values ('${username}', '${password}');`
    connection.query(GET_USER_QUERY, (err, results) => {
        if(err){
            console.log("hunnnsnn");
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
    
    exec(`java -jar C:\\Users\\colli\\d2reader\\out\\artifacts\\d2reader_jar\\d2reader.jar ${__dirname}\\${req.file.path}`, exec_options, (error, stdout, stderr) => {
      var filename = `${__dirname}\\${req.file.path}`;
      filename = filename.replace(/^.*[\\\/]/, '');
      filename = __dirname + "\\fileupload\\json\\" + filename.substring(0, filename.length-4); 
      try{
        const fs = require('fs');
        const stashData = fs.readFileSync(filename + ".json", 'utf8');
        let queryInfo = processStashData(JSON.parse(stashData), username);
        console.log("loop count: " + queryInfo[0]);
        for(i = 0; i < queryInfo[0]; i++){
          itemFilename = filename + "__" + (i+1) + ".json";
          console.log(itemFilename);
          const itemData = fs.readFileSync(itemFilename, 'utf8');
          processItemQueries(JSON.parse(itemData), username, queryInfo[1]);
        }
      } catch(err) {
        console.error(err);
        res.sendStatus(469);
      }


    } );
    
    res.sendStatus(200);
});


const processStashData = (data, username) => {
    /*need to get the newly created stashe's primary key by selecting on stashOwner. reason why i cant select on userID is because they may own x>0 amount of personal stashes*/
    var stashOwner = data.isShared ? `shared` : `${data.stashOwner}`;
    const sqlStashCreateQuery = `insert into stashes (stashOwner, numStashes, sharedGold, numItems, userID, isShared) 
                                    values (\'` + stashOwner + `\', ${data.numStashes}, ${data.sharedGold}, ${data.numItems},  (SELECT id from users where username = '${username}'), ${data.isShared});`;
    console.log(sqlStashCreateQuery);
    /*will have to query on stashOwner and userID to see if uploaded stash has an older version uploaded. if so then drop stash and every item and re-upload*/
    connection.query(sqlStashCreateQuery, (err, results) => {
        if(err){
            return res.send(err);
        }
        else{
            console.log("stash insert SUCCESS");
        }
    });
    numQueries = 0;
    if(data.numItems == 0) return [numQueries, stashOwner];
    
    numQueries = data.numItems / 1000;
    if(data.numItems % 1000 == 0) return [numQueries, stashOwner];
    else return [Math.floor(numQueries+1), stashOwner];
}

const processItemQueries = (data, username, stashOwner) => {
    const sqlQuery = `insert into items (StashID, itemType, html, itemName, baseItemName, itemCategory,` + 
                        `itemKind, width, height, socketed, totalSockets, socketsFilled, level, quality, ethereal,` + 
                            `throwable, stackable, identified, currentDurability, maxDurability, defense, block, chanceBlock,` + 
                                `initDefense, requiredLevel, requiredStrength, requiredDexterity, stashPage, setName, setID)` + 
                                        `values ` + data.Items.map((item) => 
    {
        var querySelectStashID = `(SELECT stashID from stashes where stashOwner = '${stashOwner}' and userID = (SELECT id from users where username = '${username}'))`;

        var itemQuery = `(` + querySelectStashID + `, '${item.itemType}', '${cleanString(item.html)}', '${cleanString(item.itemName)}', '${cleanString(item.baseItemName)}',` +
                            `'${item.itemCategory}', '${item.itemKind}', ${item.width}, ${item.height}, ${item.socketed}, ${item.totalSockets},` + 
                                `${item.socketsFilled}, ${item.level}, '${item.quality}', ${item.ethereal}, ${item.throwable},  ${item.stackable},` + 
                                    `${item.identified}, ${item.currDur}, ${item.maxDur}, ${item.defense}, ${item.cBlock}, ${item.iBlock}, ${item.initDef},` +
                                        `${item.reqLvl}, ${item.reqStr},  ${item.reqDex},  ${item.stashPage},  '${cleanString(item.setName)}', ${item.setID}` + `)`;
        return itemQuery;
    }).join(', ');


    connection.query(sqlQuery, (err, results) => {
        if(err){
           console.log(err);
        }
        else{
            console.log("LARGE INSERT SUCCESS\n");
        }
    });
};

const cleanString = (str) => {
    if(str)
    {
      str = str.replace(/'/g, '\\\'');
    }
    return str;
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));