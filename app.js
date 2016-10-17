// Server Side Code
var express = require('express'); //include express framework
var app = express();              //init express
var server = require('http').createServer(app); //Create http server
var io = require('socket.io').listen(server);   //Include sockets and listen to server
var nicknames = [];     //Array of nicknames currently connected

server.listen(3000);    //Make Server listen on port 3000

// route for default page
app.get('/', function(req, res){
  res.sendFile( __dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  console.log("A user connected");
  socket.on('send_message', function(data){
    io.sockets.emit('new_message', {msg: data, nick: socket.nickname}); //Sends to everyone
    //socket.broadcast.emit'(new_msg', data) // Sends to everyone except me
  });

  socket.on("valid_nickname", function(data, callback){
    // If nickname not in array it is free to use
    if(nicknames.indexOf(data) === -1){
      callback(true);
      socket.nickname = data;
      nicknames.push(data);
      io.sockets.emit('usernames', nicknames);
    } else {
      //Nickname has been used
        callback(false);
    }
  });

  socket.on("disconnect", function(data){
    if(socket.nickname){
      nicknames.splice(nicknames.indexOf(socket.nickname),1);  //Remove Nickname from array
      io.sockets.emit('usernames', nicknames);  //Update Nicknames with removed element
    }
  });
});
