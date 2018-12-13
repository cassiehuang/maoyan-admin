const crypto = require('crypto');
const md5 = crypto.createHash('md5');
const addAdmin = require('./src/utils/api_helper.js').addAdmin;
const addUser = require('./src/utils/api_helper.js').addUser;
const queryAdmin = require('./src/utils/api_helper.js').queryAdmin;
const deleteAdmin = require('./src/utils/api_helper.js').deleteAdmin;
const addFilms = require('./src/utils/api_helper.js').addFilms;
const queryFilms = require('./src/utils/api_helper.js').queryFilms;
const updateFilms = require('./src/utils/api_helper.js').updateFilms;
const deleteFilms = require('./src/utils/api_helper.js').deleteFilms;
const addRecommand = require('./src/utils/api_helper.js').addRecommand;
const queryRecommand = require('./src/utils/api_helper.js').queryRecommand;
const deleteRecommand = require('./src/utils/api_helper.js').deleteRecommand;

/* deleteFilms().then((data) => {
  console.log(data);
}); */

addUser({username: 'test', password: md5.update('xyz'+'123456'+ 'abc').digest('hex')}).then((data) => {
  console.log(data);
});
/* deleteAdmin({username: 'cassie'}).then((data) => {
  console.log(data);
}); */

/* queryFilms({'id': '1205514'}).then((data) => {
  if(data.length === 0) {
    return;
  }
  addRecommand(data).then((result) => {
    console.log(result);
  })
}); */

// deleteRecommand({'id': '1205514'}).then((data) => {
//   console.log(data);
// });

// queryFilms({ type: 3 }).then((data) => {
//   data.data.forEach((value, idx) => {
//     delete value._id;
//     value.grade = Math.floor(Math.random()*7+3)+'.'+ Math.floor(Math.random()*9);
//     updateFilms(value).then((result) => {
//       console.log(result);
//     })
//   })
// })