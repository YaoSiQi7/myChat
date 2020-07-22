/*
 * @Author: your name
 * @Date: 2020-07-17 08:25:28
 * @LastEditTime: 2020-07-20 16:02:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \myChat\server.js
 */
var express = require("express")
  app = express()
  server = require('http').createServer(app)
  io = require("socket.io").listen(server)
  users = [];
//html
app.use('/',express.static(__dirname + "/www"));
//端口
server.listen(process.env.PORT || 8000);
//socket
io.sockets.on('connection', (socket) => {
  //新用户进入
  socket.on('login', (username) => {
    if (users.includes(username)) {
      socket.emit("昵称已存在")
    } else {
      socket.username = username;
      users.push(username);
      socket.emit("loginSuccess");
      socket.broadcast.emit('system', username, users.length, 'login');
    }
  });
  //用户离开
  socket.on('disconnect',()=>{
    if(socket.username != null){
      users.splice(users.indexOf(socket.username),1);
      socket.broadcast.emit('system',socket.username,users.length,'logout');
    }
  });
  //接收到新消息
  socket.on('post',()=>{
    console.log(1)
    // socket.broadcast.emit('newMsg',socket.username,msg,color);
  });
  //接收到新图片
  socket.on('img',(imgData,color)=>{
    socket.broadcast.emit('newImg',socket.username,imgData,color);
  })
})
