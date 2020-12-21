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
socketio.on(
  "connection", 
  (userSocket) => {
    console.log("Socket connected with socket id -> ", userSocket.id)
    userSocket.on("send_message", (data) => {
      console.log(data)
      userSocket.broadcast.emit("receive_message", data); 
      userSocket.emit(
        'send_message_sendback',
        {
          message: "CALLBACK FROM SERVER"
        }
      );
    })
  }
);

http.listen(
  PORT || process.env.PORT,
  () => {
    console.log('Server is running at port ' + PORT);
  }
);


ngrok.connect({
    addr: 3000
  })
    .then( 
      url => {
        console.log('ngrok url -> ', url);
      }
    )