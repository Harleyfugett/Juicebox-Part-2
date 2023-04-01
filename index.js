require('dotenv').config();
const express = require('express');
const server = express();
const morgan = require('morgan');

const {client } = require('./db');

server.use(morgan('dev'));

server.use(express.json());

server.use((req, res, next) => {
    next();
  });

server.use('/api', (req, res, next) => {
    next();
});
  
const apiRouter = require('./routes');
server.use('/api', apiRouter);


client.connect();
server.listen(3000, () => {
  console.log('The server is up on port 3000')
});