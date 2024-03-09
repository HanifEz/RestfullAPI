const express = require('express');
const Pool = require('pg').Pool;
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const authRouter = require('./utils/authRouter')
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use(express.json());
app.use(bodyParser.json());
app.use('/auth', authRouter);


const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'homework2',
    password: 'hanif123222',
    port: 5432,
});

module.exports = pool;

