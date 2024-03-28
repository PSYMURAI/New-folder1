// express 
const express = require('express');
const app = express();

// const redis = require('ioredis');
// const client = redis.createClient('redis://redis:6379');

//jwt
const jwt = require('jsonwebtoken');

// body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());

// cors 
const cors = require('cors');
app.use(cors());

//mysql 
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'db',
    user: 'root',
    password: 'pass@123',
    database: 'app'
});

connection.connect();


app.get('/', (req, res) => {
    res.send('Hello World, we are indians!');
});

const port = 80;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});