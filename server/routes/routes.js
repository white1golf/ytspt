
var fs = require('fs');
/**
 * 라우트에 대한 설정. 현재는 특별한 클라이언트 페이지가 없기 때문에 JSON 정보를 보냄
 */
module.exports = function(app, passport) {

    /**
     * 해당 라우트를 임의로 접근한 것이 아닌 인증되어 연결된 것이 맞는 지 확인.
     * node에서는 hoisting이 어떤 정책을 따르는지 모르겠어서 안전하게 최상위에서 정의함.
     */
    function ensureAuthenticated(req, res, next){

        //참일 때는 계속 진행. req.isAuthenticated()함수는 passport에서 지원 하는 것.
        if(req.isAuthenticated())
            return next();
        
        //거짓일 때 실패 리다이렉션
        res.redirect('/');
    };

    //모든 요청 시간 표시.
    app.use(function(req, res, next){
        console.log('Time: %d', Date.now());
        next();
    });

    //애플리케이션 레벨 오류처리 미들웨어 
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        res.status(500).send('Something broke!');
    });

    app.get('/',function(req,res){
            res.sendFile('index.html');
    });

    //TODO: 예제 확인해보기 근데 req.flash의 정체를 모르겠음.
    //http://blog.naver.com/rwans0397/220680181786
    //이거 참고해보기
    app.get('/profile', ensureAuthenticated, function(req,res){
        res.json(req.user);
    });

    app.get('/failure', function(req,res){
        res.setHeader('Content-Type', 'application/json');
        res.json({
            test: 'failure'
        });
    });

    app.get('/login', function(req,res){
        res.sendFile()
        
    });

    app.get('/auth/youtube', passport.authenticate('youtube'));
    app.get('/auth/youtube/callback' , passport.authenticate('youtube'
    ,{
        successRedirect     :   '/profile',
        failureRedirect     :   '/failure'
    }
    ));

}