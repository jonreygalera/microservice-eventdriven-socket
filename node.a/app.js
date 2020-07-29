const express = require('express');
const bodyParser = require('body-parser');
const ioClient = require('socket.io-client');
const URL = 'http://localhost';

const connected = [];

const serverSocket = (http) => {
    const io = require('socket.io')(http);
    io.on('connection', (socket) => {
        connected.push(socket.id);
        console.log('Node A[Server]Connected:' + connected.length);
    });

    io.on('disconnect', (socket) => {
        connected.splice(connected.indexOf(socket.id), 1);
        console.log('Node A[Server]Connected:' + connected.length);
    });
}

const clientSocket = () => {
    processor();
}

function processor(){
    let socket = ioClient.connect(`${URL}:3000`, {
        reconnection: true
    });

    socket.on('connection', () => {
        console.log('Processor[Client]:connected!');
    });

    socket.on('disconnect', () => {
        console.log('Processor[Client]:disconnected!');
    })
}


async function startServer(){

    const app = express();
    const PORT = 3001;
    const URL = 'http://localhost';

    try {
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
        const http = require('http').createServer(app);

        http.listen(PORT,(err) => {
            console.log(`Server connected! ${URL}:${PORT}`);
            serverSocket(http);
            clientSocket();
        });
    }catch(err){
        console.log(err);
    }

}

startServer();