const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const addFilms = require('./src/utils/api_helper.js').addFilms;
const addCinemas = require('./src/utils/api_helper.js').addCinemas;

const base_url = 'http://maoyan.com';

const urls = ['/films?showType=1&offset=0', '/films?showType=1&offset=0'];

axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36';
/* const httpGet = (url,catId) => {
   return axios.get(url+'?showType=3&catId='+catId).then((res) => {
    let $ = cheerio.load(res.data);
    let data = [];
    $('.movie-list dd').each((idx, element) => {
      $element = $(element);
      let id = $element.find('.movie-item > a').attr('data-val').replace(/[^0-9]/ig, "");
      let img = $element.find('.movie-item .movie-poster img').last().attr('data-src');
      let title = $element.find('.movie-item-title').attr('title');
      let grade = $element.find('.channel-detail-orange').html();
      if((id === undefined || id === '' ) || 
          (img === undefined || img === '') || 
          (title === undefined || title === '') || 
          (grade === undefined || grade === '')) {
        return null;
      }
      data.push({
        oldId: id,
        img,
        title, 
        grade,
        time: new Date(),
        type:3,
        catId: catId,
        sourceId: Math.floor(Math.random()*18),
        timeId: Math.floor(Math.random()*9),
      })
    });
    return data;
  }).catch((err) => {
    fs.writeFile('myProjectLogs.txt', err);
  })
};
for (var i = 1; i < 25;i++) {
  httpGet('http://maoyan.com/films',i).then((data) => {
  if(data.length == 0){
    return;
  }
  console.log(data.length);
  //addFilms(data);
  data.forEach((val) => {
    addFilms(val);
  })
  }).catch((err) => {
    fs.writeFile('myProjectLogs.txt', err);
  })
} */
const httpGet = (url) => {
  return axios.get(url).then((res) => {
   let $ = cheerio.load(res.data);
   let data = [];
   $('.cinemas-list .cinema-cell').each((idx, element) => {
     $element = $(element);
     let name = $element.find('.cinema-name').text();
     let address = $element.find('.cinema-address').text();
     if((name === undefined || name === '' ) || 
         (address === undefined || address === '')) {
       return null;
     }
     data.push({
       name,
       address,
       brandId: Math.floor(Math.random()*18),
       areaId: Math.floor(Math.random()*30),
       hallId: Math.floor(Math.random()*10),
     })
   });
   return data;
 }).catch((err) => {
   fs.writeFile('myProjectLogs.txt', err);
 })
};
for (var i = 0; i < 12;i++) {
 httpGet('http://maoyan.com/cinemas?offset='+ i * 12).then((data) => {
 if(data.length == 0){
   return;
 }
 console.log(data.length);
 data.forEach((val) => {
  addCinemas(val);
 })
 }).catch((err) => {
   fs.writeFile('myProjectLogs.txt', err);
 })
}

/* const httpGet = url => {
  return axios
    .get(url)
    .then(res => {
      let $ = cheerio.load(res.data);
      let result = {};
      $('.tags-line').each((idx, element) => {
        $element = $(element);
        let data = [];
        $element.find('.tags a').each((index, el) => {
          let name = $(el).text();
          data[index] = {
            text: name,
            id: index
          };
        });
        if (idx == 0) {
          result.brand = data;
        } else if (idx == 1) {
          result.area = data;
        } else {
          result.hall = data;
        }
      });
      return result;
    })
    .catch(err => {
      fs.writeFile('myProjectLogs.txt', err);
    });
};
httpGet('http://maoyan.com/cinemas')
  .then(result => {
    fs.writeFile('cinemas.json', JSON.stringify(result));
  })
  .catch(err => {
    fs.writeFile('myProjectLogs.txt', err);
  }); */
