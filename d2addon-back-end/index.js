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
            console.log("Error on Create Account query");
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

app.post('/Getitems', (req, res) =>{
    console.log(req.query);
    const {sqlQuery} = req.query;

    connection.query(sqlQuery, (err, results) => {
        if(err){
            console.log("Error on getItem query");
        }
        else {
            //res.sendStatus(200);
            return res.json(results);
        }
    });
});

app.post('/upload', upload.single('thefile'), (req, res) => {
    const {username} = req.query;
    
    exec(`java -jar C:\\Users\\colli\\d2reader\\out\\artifacts\\d2reader_jar\\d2reader.jar ${__dirname}\\${req.file.path}`, exec_options, (error, stdout, stderr) => {
        var filename = `${__dirname}\\${req.file.path}`;
        filename = filename.replace(/^.*[\\\/]/, '');
        filename = __dirname + "\\fileupload\\json\\" + filename.substring(0, filename.length-4); 

        const fs = require('fs');
        const stashData = fs.readFileSync(filename + ".json", 'utf8');

        var jsonStashData = JSON.parse(stashData);

        processStashData(jsonStashData, username)
        .then( ( results ) => {
            var numQueries = 0;
            if(jsonStashData.numItems == 0){
                /* no items to process */
                res.sendStatus(200);
            } else numQueries = jsonStashData.numItems / 1000;
            
            /* In case a user has 10K+ items in their stash it's preferred not to insert all at once. Broken into 1K segments to more easily spot query error if ever occurs  */
            if( jsonStashData.numItems % 1000 != 0 ){
                numQueries = Math.floor(numQueries+1);
            }
            
            for(i = 0; i < numQueries; i++){
                let itemFilename = filename + "__" + (i+1) + ".json";
                console.log(itemFilename);
                const itemData = fs.readFileSync(itemFilename, 'utf8');
                processItemQueries( JSON.parse(itemData), username, jsonStashData.stashOwner )
                .then( ( results ) => {
                    console.log("LARGE INSERT SUCCESS\n");
                })
                .catch( err => {
                    console.error(err);
                    res.sendStatus(469);
                })
            }
            res.sendStatus(200);
        })
        .catch( err => {
            console.error(err);
            res.sendStatus(469);
        });
    });
});


const processStashData = (data, username) => {
    /*need to get the newly created stash's primary key by selecting on stashOwner. reason why i cant select on userID is because they may own x>0 amount of personal stashes*/
    //var stashOwner = data.isShared ? `shared` : `${data.stashOwner}`;
    //var stashOwner = data.stashOwner;

    return new Promise( (resolve, reject) => {
        const stashExistQuery = `select stashID from stashes where userID = (SELECT id from users where username = '${username}') and stashOwner = '${data.stashOwner}'`;
        connection.query(stashExistQuery, (err, results) => {
            if(err){
                return reject(err);
            }
            else{
                if(results.length > 0){ /* stash exists so drop items and update fields */
                    var stashID = results[0].stashID;
                    const dropItemsFromStash = `delete from items where stashID = ${stashID}`;
                    connection.query(dropItemsFromStash, (err, results) => {
                        if(err){
                            return reject(err);
                        }
                        else{
                            console.log("Dropped all items in stash:\nusername: " + username + "\nstashOwner: " + data.stashOwner + "\nstashID: " + stashID);
                            const stashCreateOrUpdateQuery = `update stashes set numStashes = ${data.numStashes}, sharedGold = ${data.sharedGold}, numItems = ${data.numItems} where stashID = ${stashID}`;
                            connection.query(stashCreateOrUpdateQuery, (err, results) => {
                                if(err){
                                    return reject(err);
                                }
                                else{
                                    console.log("stash update SUCCESS");
                                    resolve(results);
                                }
                            });
                        }
                    });
                }
                else{ /* Stash doesn't exist so insert a new one */
                    console.log("Stash doesnt exist inserting new one...");
                    const stashCreateOrUpdateQuery = `insert into stashes (stashOwner, numStashes, sharedGold, numItems, userID, isShared) 
                                                    values ('` + data.stashOwner + `', ${data.numStashes}, ${data.sharedGold}, ${data.numItems},  
                                                        (SELECT id from users where username = '${username}'), ${data.isShared});`;
                    connection.query(stashCreateOrUpdateQuery, (err, results) => {
                        if(err){
                            return reject(err);
                        }
                        else{
                            console.log("stash insert SUCCESS");
                            resolve(results);
                        }
                    });
                }
            }
        });

    } );
    /*const stashExistQuery = `select stashID from stashes where userID = (SELECT id from users where username = '${username}') and stashOwner = '${data.stashOwner}'`;
    connection.query(stashExistQuery, (err, results) => {
        if(err){
            return new Error("Failed on stashExistQuery");
        }
        else{
            if(results.length > 0){ // stash exists so drop items and update fields 
                const dropItemsFromStash = `delete from items where stashID = ${results[0].stashID})`;
                connection.query(dropItemsFromStash, (err, results) => {
                    if(err){
                        return new Error("Failed on Stash items Drop");
                    }
                    else{
                        console.log("Dropped all items in stash:\nusername: " + username + "\nstashOwner: " + data.stashOwner + "\nstashID: " + results[0].stashID);
                        const stashCreateOrUpdateQuery = `update stashes set numStashes = ${data.numStashes}, sharedGold = ${data.sharedGold}, numItems = ${data.numItems} where stashID = ${results[0].stashID}`;
                        connection.query(stashCreateOrUpdateQuery, (err, results) => {
                            if(err){
                                return new Error("Failed on Stash Update query");
                            }
                            else{
                                console.log("stash update SUCCESS");
                            }
                        });
                    }
                });
            }
            else{ //* Stash doesn't exist so insert a new one 
                console.log("Stash doesnt exist inserting new one...");
                const stashCreateOrUpdateQuery = `insert into stashes (stashOwner, numStashes, sharedGold, numItems, userID, isShared) 
                                                values ('` + data.stashOwner + `', ${data.numStashes}, ${data.sharedGold}, ${data.numItems},  
                                                    (SELECT id from users where username = '${username}'), ${data.isShared});`;
                connection.query(stashCreateOrUpdateQuery, (err, results) => {
                    if(err){
                        return new Error("Failed on Stash Insert query");
                    }
                    else{
                        console.log("stash insert SUCCESS");
                    }
                });
            }
        }
    });*/

    /*const sqlStashCreateQuery = `insert into stashes (stashOwner, numStashes, sharedGold, numItems, userID, isShared) 
                                    values (\'` + stashOwner + `\', ${data.numStashes}, ${data.sharedGold}, ${data.numItems},  (SELECT id from users where username = '${username}'), ${data.isShared});`;
    console.log(sqlStashCreateQuery);*/

    /*will have to query on stashOwner and userID to see if uploaded stash has an older version uploaded. if so then drop stash and every item and re-upload*/

    /*let numQueries = 0;
    if(data.numItems == 0) return [numQueries, data.stashOwner];
    
    /* In case a user has 10K+ items in their stash it's preferred not to insert all at once. Broken into 1K segments to more easily spot query error if ever occurs  
    numQueries = data.numItems / 1000;
    if(data.numItems % 1000 == 0) return [numQueries, data.stashOwner];
    else return [Math.floor(numQueries+1), data.stashOwner];*/
    //equivalent? -> else return [Math.cieling(numQueries), stashOwner];
}

const processItemQueries = (data, username, stashOwner) => {
    return new Promise( (resolve, reject) => {
        const sqlQuery = `insert into items (StashID, itemType, html, itemName, baseItemName, itemCategory,` + 
                            `itemKind, bodyLocation1, bodyLocation2, width, height, socketed, totalSockets, socketsFilled,` + 
                                `level, quality, ethereal, throwable, stackable, identified, currentDurability, maxDurability, defense,` +
                                    `block, chanceBlock, initDefense, requiredLevel, requiredStrength, requiredDexterity, stashPage, setName, setID)` + 
                                        `values ` + data.Items.map((item) => 
        {
            var querySelectStashID = `(SELECT stashID from stashes where stashOwner = '${stashOwner}' and userID = (SELECT id from users where username = '${username}'))`;

            var itemQuery = `(` + querySelectStashID + `, '${item.itemType}', '${cleanString(item.html)}', '${cleanString(item.itemName)}', '${cleanString(item.baseItemName)}',` +
                                `'${item.itemCategory}', '${item.itemKind}', '${item.bodyLocation1}', '${item.bodyLocation2}', ${item.width}, ${item.height}, ${item.socketed}, ${item.totalSockets},` + 
                                    `${item.socketsFilled}, ${item.level}, '${item.quality}', ${item.ethereal}, ${item.throwable},  ${item.stackable},` + 
                                        `${item.identified}, ${item.currDur}, ${item.maxDur}, ${item.defense}, ${item.cBlock}, ${item.iBlock}, ${item.initDef},` +
                                            `${item.reqLvl}, ${item.reqStr},  ${item.reqDex},  ${item.stashPage},  '${cleanString(item.setName)}', ${item.setID}` + `)`;
            return itemQuery;
        }).join(', ');


        connection.query(sqlQuery, (err, results) => {
            if(err){
                console.log("error alert");
                return reject(err);
            }
            else{
                resolve( results );
            }
        });
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