const { Socket } = require('dgram');
const ngrok =require('ngrok');
const app = require('express')()
const http = require('http').createServer(app)

let PORT = 3000;

app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})

// http.listen(
//   PORT,
//   () => {
//     console.log('Server is running at port ' + PORT);
//   }
// )

//Socket Logic
const socketio = require('socket.io')(http)


// authentication documentation ->  https://socket.io/docs/v4/middlewares/
// SOCKET.IO AUTHENTICATION MIDDLEWARE
socketio.use((socket, next) => {
  console.log('Socket.io middleware')
  // console.log('socket.request -> ', socket.request)
  console.log('socket.request._query -> ', socket.request._query)
  console.log('socket.request._query.token -> ', socket.request._query.token)
  // following "_verify" method is your verification. Imagine :)
  const _verify = () => { return true; }
  if ( _verify() ) {
    next();
  } else {
    next(new Error("I didnt like your Authentication Parameters. Invalid!"));
  }
});


socketio.on(
  "connection", 
  (userSocket) => {
    console.log("Socket connected with socket id -> ", userSocket.id)
    userSocket.on("send_message", (data) => {
      console.log('userSocket.on -> "send_message" -> data -> ',  data)
      // to other users
      userSocket.broadcast.emit("receive_message", data); 
      // send back to user itself
      userSocket.emit(
        'send_message_sendback',
        {
          // message: "CALLBACK FROM SERVER",
          message: data,
        }
      );
    });
  }
);

http.listen(
  PORT || process.env.PORT,
  () => {
    console.log('Server is running at port ' + PORT);
  }
);


// ngrok.connect({
//     addr: 3000
//   })
//     .then( 
//       url => {
//         console.log('ngrok url -> ', url);
//       }
//     )