const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'DeckardCain',
    password: '$tay@WhileAndL!sten',
    database: 'd2'
});

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
                        console.log("hunnnsnn");
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));