var Bing = require('node-bing-api')({ accKey: "2f563a1a6c854a808046ae268ab97ddc" });
var request = require('request');
var https = require('https');

var BingImg = {};
BingImg.getImage = function (solution, cb) {
	var options = {
	  hostname: 'api.cognitive.microsoft.com',
	  port: 443,
	  path: `/bing/v5.0/images/search?q="${solution}"`,
	  method: 'POST',
	  headers: {'Ocp-Apim-Subscription-Key': '2f563a1a6c854a808046ae268ab97ddc',
	  			'Content-Type': "multipart/form-data"}
	};
	console.log('about to call http')
	var req = https.request(options, (res) => {
	  // console.log('statusCode:', res.statusCode);
	  // console.log('headers:', res.headers);
	   var textChunk = '';
	  res.on('data', (chunk) => {
	    textChunk += chunk.toString();
	  });
	  res.on('end', ()=> {
	  	textChunk = JSON.parse(textChunk);
	  	// console.log('textChunk: ',textChunk.value[0].contentUrl)
	  	cb(textChunk.value[0].contentUrl);
	  	// console.log('textChunk: ',textChunk.value[0].contentUrl)
	  })
	});
	req.end();
};

module.exports = BingImg;
