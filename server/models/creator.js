//creator 모델
var mongoose = require('mongoose');
//카테고리 상수 호출. 여기선 필요하지 않을 듯.


//에러 발생중. export 관련 문제. category 내부 살필것.
//var category = require('category');
var creatorSchema = mongoose.Schema({
    name:{
        type:String,
        required: true,
        unique: true
    },
    category: Number,
    ranking: Number,
    rkInCategory: Number,
    subscriber: Number,
    totalViewCount: Number,
    description: String
    //추후 추가 예정.
});

module.exports =  mongoose.model('Creator', creatorSchema);
