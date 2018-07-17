var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var session = require('express-session')({
  secret:'keyboard cat',
  cookie:{maxAge:800000}
});
var iosession = require('express-socket.io-session')(session,{autoSave:true});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var server = require("http").Server(app);
var io = require('socket.io')(server);
server.listen(3000);

let firstSocket;
io.use(iosession);
io.on("connection",function (socket) {

  socket.on('req',function (data,cb) {
    // console.log("接收到了请求"+data);
    cb(data);
  })

  socket.on("say",data=>{
    const num = ++socket.handshake.session.num;
    // socket.handshake.session.save();
    // io.emit('newsay',data + " --创建时间:"+new Date());
    io.emit('newsay','num = '+num);
  });
  // if (firstSocket) {
  //   console.log("firstSocket === socket",firstSocket === socket);
  // }else {
  //   firstSocket = socket;
  // }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// module.exports = app;
