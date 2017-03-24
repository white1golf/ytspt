
//load all the thing we need
//유튜브만 필요하지만 나중에 쓸 목적으로 다른 것들도 먼저 구현함.
/**
 * var LocalStrategy = require('passport-local').Strategy;
 * var FacebookStrategy = require('passport-facebook').Strategy;
 * var TwitterStrategy = require('passport-twitter').Strategy;
 * var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
 */

    var YoutubeStratetegy = require('passport-youtube-v3').Strategy;
    
    var User = require('../models/user');

    var configAuth = require('./auth');

    module.exports = function(passport) {

        /**
         * 세션을 위해 유저를 serialize함. => 세션에 저장할 정보를 done(null, user)과 같이 
         * 두번째 인자로 넘김. 이때 user객체로 넘어오는 정보는 Strategy 인증함수 authentication()에서 done(null,user)에 의해 리넡된 값이 넘어옴.
         */
        passport.serializeUser(function(user, done){
            console.log('serialize');
            done(null, user);
        });
        
        /**
         * deserialize 함. callback 함수의 첫번째 인자로 넘어온 내용 "user"는 세션에 저장된 사용자 정보.
         * nodejs의 모든 페이지에 접근할 때, 로그인이 되어 있을 경우 모든 사용자 페이지를 접근할 경우 deserializeUser가 발생.
         * 
         * 예제의 경우 
         * passport.serializeUser(function(user,done){
         * done(null,user.id)
         * });
         * 
         *passport.deserializeuser(funtion(id,done){
             User.findByID(id, function(err,user{
                 done(err, user);


                 
             }))
         })
         * 
        passport.deserializeUser(function(user,done){
            console.log('deserialize');
            //아래의 코드 때문에 문제가 발생함. 아마 제대로된 데이터베이스 셋팅부터 먼저 해야 할듯.
            //User.findById(id, function(err, user){
                done(null, user);
            });
   

        /**
         * local login이나 다른 인증에 대한 소스가 들어갈 자리. 지금은 제외
         */

         /**
          * Youtube
          */
          console.log(configAuth.youtubeAuth.callbackURL);
          
          passport.use(new YoutubeStratetegy({
              clientID: configAuth.youtubeAuth.clientID,
              clientSecret: configAuth.youtubeAuth.clientSecret,
              callbackURL: configAuth.youtubeAuth.callbackURL,
              scope:['https://www.googleapis.com/auth/youtube.readonly']
          }, 
          function(accessToken, refreshToken, profile, done){
                
                //process.nextThick(function()){}을 통해 이 함 수 내부에서 코드를 구현 필요하는
                //예제가 존재 하는데 그 이유가 뭔지 잘 이해가 안감. process.nextThick()에 대한 설명이 필요한듯./

                //    User.findOne({'youtube.id':profile.id}, function(err,user){
                //        //에러 발생 시
                //        if (err)
                //             return done(err);
                //         // user가 존재할 때
                //         if (user){

                //             //유저가 존재한다면 로그인 시킴.
                //             return done(null, user);
                            
                //         }else {
                //             //에러는 아니고 유저가 존재하지 않을 시 새로운 유저 정보를 생성함.
                //             var newUser = new User();

                //             newUser.youtube.id = profile.id;
                //             newUser.youtube.token = accessToken;
                //             newUser.youtube.name = profile.displayName;
                //             //newUser.youtube.email = profile.email[0].value; // 첫번째 이메일을 보냄.

                //             //새 유저 정보 저장
                //             newUser.save(function(err){
                //                 if(err)
                //                     throw err;
                //                 return done(null, newUser);
                //             });
                //         }

                //    });
                
                /**
                 * ReferenceError: done is not defined 에러가 발생하여 테스트 코드 작성함.
                 */
                //console.log('accessToken'+ accessToken);
                //console.log('refreshToken'+ refreshToken);
                //console.log('got authentication for: %j', profile);
                done(null, profile);
          }));
    }