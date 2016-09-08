var fs = require('fs');

var wordList = fs.readFileSync('server/models/complexWords.txt').toString().split(' ');

module.exports = {
    randomComplexWord: function(){
       var index = Math.floor(Math.random() * wordList.length);
       return wordList[index];
    }
};