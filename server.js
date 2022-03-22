const express = require('express');
const app = express();

app.use(express.static('public'));

const http = require('http');

const server = http.createServer(app);
const io = require("socket.io")(server);

const state = {
    fps: 60,
    gridWidth: 16,
    gridHeight: 9,
    angle: 0.0,
    world: {
        players: {}
    }
};

var map = require('./map');
state.world.map = map.map;

function addPlayer(clientID){
    state.world.players[clientID] = {
        posX: 0,
        posY: 0
    };
}

function removePlayer(clientID){
    delete state.world.players[clientID];
}

app.get('/', (req, res) => {
    console.log("new visitor");

    //res.send("Hello");
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', client => {
    let clientID = client.id;
    console.log("new connection " + clientID);    
    addPlayer(clientID);

    //client.emit('init', JSON.stringify(state), clientID);
    
    const intervalID = setInterval(() => {
        state.angle = state.angle + 0.01;
        client.emit('update', { state: JSON.stringify(state), id: clientID });
    }, 1000 / state.fps);
    

    client.on('test', (msg) => {
        console.log("a client send: ");
        console.log(msg);

        //send to all clients
        io.emit('test', msg);
    });

    client.on('translate', (sens) => {
        console.log(clientID + " translation: " + sens);
        if(sens == 'ArrowUp'){
            state.world.players[clientID].posY = state.world.players[clientID].posY - 1;
        }else if(sens == 'ArrowDown'){
            state.world.players[clientID].posY = state.world.players[clientID].posY + 1;
        }else if(sens == 'ArrowLeft'){
            state.world.players[clientID].posX = state.world.players[clientID].posX - 1;
        }else if(sens == 'ArrowRight'){
            state.world.players[clientID].posX = state.world.players[clientID].posX + 1;
        }        
    });

    client.on('disconnect', () => { 
        console.log("disconnection " + clientID);
        removePlayer(clientID);
     });
});

server.listen(49153, () => {
    console.log('listening on *:49153');
});

