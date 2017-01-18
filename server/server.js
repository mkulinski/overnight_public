const express = require('express');

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const userController = require('./controllers/userController');

const mongoURI = 'mongodb://localhost:27017/overnight';
mongoose.connect(mongoURI);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client')));

let userPool = [];

io.on('connection', (socket) => {
  // send currently connected client info to dashboard
  socket.on('getInitialClients', () => {
    io.emit('addNewClient', userPool);
  });
  // add new client info to userPool and database
  socket.on('connected-client', (data) => {
    const client = socket.id;
    const newClient = {};
    const newData = {};

    newData.lat = data.lat;
    newData.long = data.long;

    newClient[client] = newData;

    userPool.push(newClient);
    // send new client info to dashboard
    io.emit('addNewClient', userPool);
    // write to database after real-time connections finished
    userController.createUser(data);
  });
  // on disconnect removes client from userPool and sends info to dashboard
  socket.on('disconnect', () => {
    const socketId = socket.id;
    const newUserPool = userPool.filter(item => !item[socketId]);
    userPool = newUserPool;
    io.emit('clientDisconnected', { delete: socketId });
  });
});

server.listen(3111, () => {
  console.log('server running');
});
