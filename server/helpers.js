/*HELPERS FOR BACKEND*/ 

//FUNCTIONS FOR MAKING RANDOM USERNAMES:
const Words = require('./words.js');

function capitalizeWord(word){
    return word[0].toUpperCase() + word.slice(1);
  }
  
  function randomNumber(length_needed){
    let randomNumber = "";
    for (let i = 0; i < length_needed; i++){
      randomNumber = randomNumber + Math.floor(Math.random() * 10).toString();
    }
    return randomNumber;
  }
  
  function randomNoun(){
    const lengths = ['three', 'four', 'five', 'six', 'seven', 'eight'];
    const length_to_use = lengths[Math.floor(Math.random() * lengths.length)];
    const nouns_to_choose = Words.nouns[length_to_use];
    return nouns_to_choose[Math.floor(Math.random() * nouns_to_choose.length)];
  
  }
  
  function randomAdjective(){
    const lengths = ['three', 'four', 'five', 'six', 'seven', 'eight'];
    const length_to_use = lengths[Math.floor(Math.random() * lengths.length)];
    const adjs_to_choose = Words.adjs[length_to_use];
    return adjs_to_choose[Math.floor(Math.random() * adjs_to_choose.length)];
  }
  
  function createUsername(){
    const noun = randomNoun();
    const adj = randomAdjective();
    const number = randomNumber(16-noun.length-adj.length);
    return capitalizeWord(adj)+capitalizeWord(noun)+number;
  }
  //CONVERT GOOGLE PICTURE TO CORRECT SIZE:

  function convpic(SIZE_, picture){
    if (picture.split('/')[picture.split('/').length - 2] === 's96-c'){
      let arr = picture.split('/');
      arr[arr.length - 2] = arr[arr.length - 2][0]+SIZE_+arr[arr.length - 2].substring(3);
      return arr.join('/');
    }else if (picture.split('=')[picture.split('=').length - 1] === 's96-c'){
      let arr = picture.split('=');
      arr[arr.length-1] = arr[arr.length - 1][0]+SIZE_+arr[arr.length - 1].substring(3);
      return arr.join('=');
    }else{
      return picture;
    }
  }

  function convertDate(stamp){
    const d = new Date(stamp);
    const AMPM = d.toLocaleTimeString().split(' ')[1]
    const minutes = d.toLocaleTimeString().split(' ')[0].split(":")[0] + ':' + d.toLocaleTimeString().split(' ')[0].split(":")[1]
    const date = d.toLocaleDateString().split("/");
    return date[0]+"/"+date[1]+"/"+date[2] + ' ' + minutes+AMPM;
  }

  module.exports = {
      createUsername,
      convpic,
      convertDate,
  }