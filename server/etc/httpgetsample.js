/**
 * 서버에서 유튜브 api 호출하는 기능. 아래의 api 들은 특별한 인증이 필요 없고 apiKey만으로 호출함 
 * */
var https = require('https');
var creators = ['BuzzBean11', 'yumcast11', 'evesojin', 'eowjdfudshrghk'];
var creatorsInfo = [];

var yt = {
	apiUrl: 'https://www.googleapis.com/youtube/v3/',
	apiLIst: {
		channels: 'channels?'
	},
	apiKey: "AIzaSyBcsEZwlHVXDMBwTjt4FfEmmuH7guyH4Ac"
	
};
yt.getSnippetUrl = function (creator) {
	return yt.apiUrl + 'channels?part=snippet&forUsername=' + creator + '&fields=items(id%2Csnippet(description%2Cthumbnails(default%2Chigh)%2Ctitle))&key=' + yt.apiKey;
}, yt.getStatisticsUrl = function (creator) {
	return yt.apiUrl + 'channels?part=statistics&forUsername=' + creator + '&fields=items(statistics(subscriberCount%2CvideoCount%2CviewCount))&key=' + yt.apiKey;
};

function get(url){
	return new Promise(function (resolve, reject){
		https.get(url, (res)=>{
			res.setEncoding('utf-8');
			//설명에서는 resume()을 호출하면 'data' 상태로 된다지만 정확한 개념이 이해가지 않음.
			res.resume();
			res.on('data', (chunk)=>{
				resolve(chunk);
			});
		}).on('error',(e)=>{
			reject(e.message);
		});
	});
};


// http.get('http://www.google.com/index.html', (res) => {
// console.log(`Got response: ${res.statusCode}`);
// // consume response body
// res.resume();
// }).on('error', (e) => {
// console.log(`Got error: ${e.message}`);
// });

//JSON parser를 이용해 객체화 하는 promise
function getJSON(url) {
	return get(url).then(JSON.parse).catch(function (err) {
		console.log("getJSON failed for", url, err);
		//err 객체를 throw 하므로 promise의 catch 구문에서 이를 판별할 수 있음.
		throw err;
	});
};

function getCreatorInfo(creator) {
	//title, description, image url( default 88 x88, high 240 x 240)
	var snippetUrl = yt.getSnippetUrl(creator);
	var statisticUrl = yt.getStatisticsUrl(creator);
	var creatorInfo = {};
	//return이 promise.all 이면 역시 프로미서블
	return Promise.all([getJSON(snippetUrl).then(function (response) {
		creatorInfo.snippet = response.items[0].snippet;
		//채널id
		creatorInfo.id = response.items[0].id;
	}), getJSON(statisticUrl).then(function (response) {
		creatorInfo.statistics = response.items[0].statistics;
	})]).then(function () {
	    creatorsInfo.push(creatorInfo);
		console.log('[http] Creator Info Updated From Network');
	});
};

//각 creator에 대해 모든 프로미스가 끝났을 때 then으로 일을 수행.
Promise.all(creators.map(getCreatorInfo)).then(function (v) {
	console.log('[http] all promises done');
	//크리에이터 정보 배열을 내림차순으로 정렬
	console.log('[http] creatorsInfo=' + JSON.stringify(creatorsInfo[0].statistics));
	creatorsInfo.sort(function (a, b) {
		var aVal = parseInt(a.statistics.subscriberCount);
		var bVal = parseInt(b.statistics.subscriberCount);
		if (aVal < bVal) return 1;else if (aVal > bVal) return -1;else return 0;
	});
	creatorsInfo.map((idx)=>{
		console.log(JSON.stringify(idx));
	});
});
