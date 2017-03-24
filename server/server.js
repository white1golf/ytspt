/**
 * 17.2.23
 * 새로이 쓴 server.js
 */

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var configDB = require('./config/database.js');

//express 셋업
app.use(bodyParser.urlencoded({extended: true}));   // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json());//for parsing application/json
app.use(express.static( path.join(__dirname, '/../client')) );
app.set('json space', 2);
app.use(morgan('dev')); //console창에 모든 log를 보여줌.(구체적 셋팅은 morgan 공식 문서 참고)
//쿠키 읽기(auth를 위해 필요함) cookieParser내부에 값은 secret 값으로 cookie를 암호화 할때 사용됨.
app.use(cookieParser('white1golf')); //쿠키 읽기(auth를 위해 필요함) cookieParser내부에 값은 secret 값으로 cookie를 암호화 할때 사용됨.
//passportjs 를 위한 미들웨어 사용
app.use(session({secret: 'Idontknowwhatthepurposeofthis'})); //세션 시크릿이라는데 정확히 뭔지 모르겠음.
app.use(passport.initialize()); //connect나 express 계열의 앱에서는 passport를 initialize하기 위해 반드시 필요함.
app.use(passport.session()); // 지속적인 로그인 세션을 지원하려면 해당 미들웨어를 사용해야함.
app.use(flash()); // 세션에 저장된 플레쉬 메시지를 사용하기 위해 connect-flash를 사용함.

//설정 지정
var mongoose = require('mongoose');
mongoose.connect(configDB.url,function(err){
    if(err){
        console.log('mongoose connection error: ' + err);
        throw err;
    }
    
});

require('./config/passport')(passport); //passport와 관련된 기본 설정을 함. 예)Strategy 설정.


/**
 * routes
 */

require('./routes/routes.js')(app, passport); //앱과 passport에 routes정보를 세팅함.

//포트 설정
var port = process.env.PORT || 8080;

app.listen(port, function(){
    console.log('server listening on ', port);
})

