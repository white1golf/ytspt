/**
 * 17.2.23
 * 예전에 만들어 뒀던 server.js 의 기본 코드. 기능을 추가하고 기능상 구조적으로 분리하기
 * 위해 새로운 server.js를 만들었음. 이 코드는 혹시 몰라서 남겨둠.
 */

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var path = require('path');



app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'../client'))
//포트 설정
var port = process.env.PORT || 8080;

var mongoose = require('mongoose');

//TODO 몽구스 디스크립션인가 만들어야함.
mongoose.connect('mongodb://localhost/test');

//var Creator = require('./models/creator');

//router 생성. 각 경로마다 method 생성 및 미들웨어 사용할 수 있음.
var router = express.Router();

//이 middleware를 이용해 사용하자 해당 api를 사용하기에 합당한 권한을 가지고 있는지
//등을 판단 할 수있음. 현재는 단순히 log를 보여주기만 함.
router.use(function(req, res, next){
    console.log('Someting is happening.');
    next();
});

// GET http://localhost:8080/api 
router.get('/', function(req, res, next){
    res.json({
        message: '테스트 성공',
        message1: 'res.json 테스트용',
        message2: {
            nested1: '이것은 네스티드',
            nested2: '이것은 네스티드2',
        }
    })
});

//app.route()를 이용하면 라우트 경로에 대하여 체인 가능한 라우트 핸들러 작성 가능.
app.route('/creators')
    //POST http://localhost:8080/api/creators
    .post(function(req, res, next){
        // req에 새로운 
    //    var creator = new Creator();
        
    })
    //GET http://localhost:8080/api/creators
    .get(function(req,res, next){
        //모든 creators 
        // Creator.find(function(err, creators){
        //     if(err) return console.error(err);
        //     res.json(creators);
        // });
    });

//애플리케이션 레벨 오류처리 미들웨어 
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

//use 메서드를 통해 api라는 경로에 대해 router를 등록.
app.use('/api', router);


app.listen(port, function(){
    console.log('server listening on ', port);
})

