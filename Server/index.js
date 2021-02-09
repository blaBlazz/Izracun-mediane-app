const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const MOMENT= require( 'moment' );

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'mediandb',
    timezone: 'Europe/Ljubljana',
});

db.connect((err) => {
    if (err) throw err;
    console.log('Successfully connected to mediandb!');
});

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));

app.post("/api/mediana/calculate", (req, res) => {
    if (!req.body.numbers || req.body.numbers.length < 1) {
        res.status(400).send('Numbers are required!');
        return;
    };

    // Median calculation and timestamp
    const numbersList = req.body.numbers.sort((a, b) => {return a - b});
    const mid = Math.ceil(numbersList.length / 2);
    const mediana = numbersList.length % 2 == 0 ? (numbersList[mid] + numbersList[mid - 1]) / 2 : numbersList[mid - 1];
    
    let datetime = MOMENT().format('YYYY-MM-DD  HH:mm:ss.000');

    // Inserting median into database 
    const sqlInsert = "INSERT INTO median(CREATED_AT, MEDIANA) VALUES(?, ?)";
    db.query(sqlInsert, [datetime, mediana], (err, result) => {
        if (err) throw err;
        res.send(datetime + 'm' + mediana.toString());
    });
    
});

app.get("/api/mediana/get", (req, res) => {
    const sqlSelect = "SELECT CREATED_AT, MEDIANA FROM median";
    db.query(sqlSelect, (err, result) => {
        res.send(result);
    });
}); 

// PORT
const port = process.env.PORT || 5501;
app.listen(port, () => console.log(`Listening on port ${port} ...`));