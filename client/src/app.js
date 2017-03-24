'use strict';

//jsdoc으로 변경 필요.


var yt = {
	apiUrl: 'https://www.googleapis.com/youtube/v3/',
	apiLIst: {
		channels: 'channels?'
	},
	apiKey: "AIzaSyCHihot0DqcuSTmciWSJhDrWxDoQkf5j4Q"
};
yt.getSnippetUrl = function (creator) {
	return yt.apiUrl + 'channels?part=snippet&forUsername=' + creator + '&fields=items(id%2Csnippet(description%2Cthumbnails(default%2Chigh)%2Ctitle))&key=' + yt.apiKey;
}, yt.getStatisticsUrl = function (creator) {
	return yt.apiUrl + 'channels?part=statistics&forUsername=' + creator + '&fields=items(statistics(subscriberCount%2CvideoCount%2CviewCount))&key=' + yt.apiKey;
};

//TODO: 명시적으로 크리에이터를 자바 배열로 가지는데 ajax 통신으로 고치기 
//대도서관, 윰댕, 김이브, 대정령
var creators = ['BuzzBean11', 'yumcast11', 'evesojin', 'eowjdfudshrghk'];
//앱의 정보를 담는 객체
var app = {
	scopetest: true,
	isLoading: true,
	//pending은 사전적으로 "기다리고있음"을 의미함.
	hasRequestPending: false,
	visibleCards: {},
	selectedCreator: [],
	spinner: document.querySelector('.loader'),
	cardTemplate: document.querySelector('.cardTemplate'),
	container: document.querySelector('.main'),
	creatorsInfo: []
	//addDialog: document.querySelector('.dialog-container'),
};
/****************************************************************
 *
 * 이벤트 리스너 등록.
 * 버튼등의 UI 를 추가시 필요. 현재는 특별한 버튼 및 기능이 없기에 표시만. 
 *
 ****************************************************************/
/****************************************************************
 *
 * 화면 갱신 메소드. 
 *
 ****************************************************************/

//개별 카드 등록 메소드
app.updateCreatorCard = function (creatorInfo) {
	var card = app.visibleCards[creatorInfo.id];
	//존재하지 않을 시
	if (!card) {
		card = app.cardTemplate.cloneNode(true);
		card.classList.remove('cardTemplate');
		card.querySelector('.creator-key').textContent = creatorInfo.id;
		card.removeAttribute('hidden');
		app.container.appendChild(card);
		app.visibleCards[creatorInfo.key] = card;
	}

	var imgNode = document.createElement("IMG");
	imgNode.setAttribute('src', creatorInfo.snippet.thumbnails.default.url); //88*88 사이즈 이미지.
	imgNode.setAttribute('width', "66px");
	imgNode.setAttribute('height', "66px");
	imgNode.setAttribute('class','img-circle'); //둥그런 이미지
	card.querySelector('.thumnail').appendChild(imgNode);
	//card.querySelector('.rank').textContent = "1";
	card.querySelector('.name').textContent = creatorInfo.snippet.title;
	//card.querySelector('.detail-description p').textContent = creatorInfo.snippet.description; 제거 
	//정규표현식을 이용한 , 표현.
	card.querySelector('.subscribers .value').textContent = creatorInfo.statistics.subscriberCount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	card.querySelector('.total-view .value').textContent = creatorInfo.statistics.viewCount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	console.log("sbscribers: " + creatorInfo.statistics.subscriberCount);
	//로딩바 숨기기.
	if (app.isLoading) {
		app.spinner.setAttribute('hidden', true);
		app.container.removeAttribute('hidden');
		app.isLoading = false;
	}
};
/****************************************************************
*
* 데이타를 다루기 위한 method 추가.
*
****************************************************************/
//Promise화된 XMLHttpRequest
function get(url) {
	return new Promise(function (resolve, reject) {
		var req = new XMLHttpRequest();
		req.open('GET', url);
		req.onload = function () {
			if (req.status == 200) {
				resolve(req.response);
			} else {
				reject(Error(req.statusText));
			}
		};
		req.onerror = function () {
			reject(Error("Network Error"));
		};
		req.send();
	});
}

//JSON parser를 이용해 객체화 하는 promise
app.getJSON = function (url) {
	return get(url).then(JSON.parse).catch(function (err) {
		console.log("getJSON failed for", url, err);
		//err 객체를 throw 하므로 promise의 catch 구문에서 이를 판별할 수 있음.
		throw err;
	});
};
app.getCreatorInfo = function (creator) {
	//title, description, image url( default 88 x88, high 240 x 240)
	var snippetUrl = yt.getSnippetUrl(creator);
	var statisticUrl = yt.getStatisticsUrl(creator);
	//serviceworker와 관련된 코드 삽입 필요.
	app.hasRequestPending = true;
	var creatorInfo = {};
	//return이 promise.all 이면 역시 프로미서블
	return Promise.all([app.getJSON(snippetUrl).then(function (response) {
		creatorInfo.snippet = response.items[0].snippet;
		//채널id
		creatorInfo.id = response.items[0].id;
	}), app.getJSON(statisticUrl).then(function (response) {
		creatorInfo.statistics = response.items[0].statistics;
	})]).then(function () {
		app.creatorsInfo.push(creatorInfo);
		app.hasRequestPending = false;
		console.log('[App] Creator Info Updated From Network');
	});
};

//각 creator에 대해 모든 프로미스가 끝났을 때 then으로 일을 수행.
Promise.all(creators.map(app.getCreatorInfo)).then(function (v) {
	console.log('[App] all promises done');
	//크리에이터 정보 배열을 내림차순으로 정렬
	console.log('[App] app.creatorsInfo=' + JSON.stringify(app.creatorsInfo[0].statistics));
	app.creatorsInfo.sort(function (a, b) {
		var aVal = parseInt(a.statistics.subscriberCount);
		var bVal = parseInt(b.statistics.subscriberCount);
		if (aVal < bVal) return 1;else if (aVal > bVal) return -1;else return 0;
	});
	app.creatorsInfo.map(app.updateCreatorCard);
});

//TODO: localStorage를 사용하여 정보 저장
//TODO: serviceworker를 사용하여 인터넷접속이 없어도 프로그램 동작하도록 설정.
