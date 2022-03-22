importScripts('/socket.io/socket.io.js');

const socket = io();

// // send message to server
// function emitMessage(name, msg){
//     socket.emit('test', { pseudo: name, message: msg });
// }

// send event to server
function emitEvent(event, data){
    socket.emit(event, data);
}

//receive event from main script
onmessage = function(e) {
    
    var event = e.data[0];

    if(event === "chatMessage"){
        //emitMessage(e.data[1], e.data[2]);
        emitEvent(event, { pseudo: e.data[1], message: e.data[2] });
    }
    else if(event === "translate"){
        //socket.emit(event, e.data[1]);
        emitEvent(event, e.data[1]);
    }
    
}

//receive event from server
socket.on('test', (msg) => {
    postMessage(["chatMessage", msg]);    
});

// socket.on('init', (state, id) => {
//     postMessage(["initWebGL", JSON.parse(state), id]); 
// });

socket.on('update', (data) => {
    postMessage(["update", data]); 
});
