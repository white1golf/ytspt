//사용자에 대한 모델 생성
var mongoose = require('mongoose');

//사용자 정보의 암호화
var bcrypt = require('bcrypt-nodejs');

//youtube만 필요하지만 나머지도 나중에 구현할지 몰라서 냅둠.
var userSchema = mongoose.Schema({
    
    local           :{
        email       : String,
        password    : String,
    },
    facebook        :{
        id          : String,
        token       : String,
        email       : String,
        name        : String,
    },
    twitter : {
        id          : String,
        token       : String,
        displayName : String,
        username    : String
    },
    google          :{
        id          : String,
        token       : String,
        email       : String,
        name        : String
    },
    youtube         :{
        id          : String,
        token       : String,
       // email       : String,
        name        : String
    }
});

    //local strategy를 위한 해쉬 함수인 듯함. 나는 이용하지 않지만 나름 유용할 것 같아서 적어놓음.
    //해쉬 생성
    userSchema.methods.generateHash = function(password){
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8),null);
    };

    //비밀번호가 맞는지 확인
    userSchema.methods.validPassword = function(password){
        return bcrypt.compareSync(password, this.local.password);
    };

    module.exports = mongoose.model('User', userSchema);

