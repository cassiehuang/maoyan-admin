const MongoClient = require('mongodb').MongoClient;
const DB_CONN = 'mongodb://localhost:27017/maoyan';

const insertData = (data, tablename) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(DB_CONN, (err, client) => {
      if(err) {
        resolve('error');
        return;
      }
      const db = client.db('maoyan');
      const collection = db.collection(tablename);
      collection.insert(data, (err, result) => {
        if(err) {
          resolve('error');
          return;
        }
        client.close();
        resolve('insert ok');
      })
    })
  })
};
const deleteData = (data, tablename) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(DB_CONN, (err, client) => {
      if(err) {
        resolve('error');
        retur
      }
      const db = client.db('maoyan');
      const collection = db.collection(tablename);
      collection.remove(data, (err, result) => {
        if(err) {
          resolve('error');
          return;
        }
        client.close();
        resolve('delete ok');
      })
    })
  })
};
const queryData = (data, tablename) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(DB_CONN, (err, client) => {
      if(err) {
        reject('error');
        return;
      }
      const db = client.db('maoyan');
      const collection = db.collection(tablename);
      if (data.keyword) {
        data['$text'] =  { $search: data.keyword };
        delete data.keyword;
        collection.find(data).toArray((err, result) => {
          if(err) {
            reject('error');
            return;
          }
          client.close();
          resolve({count: result.length, data: result});
        })   
      } else {
        let limit = data.limit ? data.limit : 999;
        let skip = data.skip ? data.skip : 0;
        let sort = data.sort ? data.sort : {"time": -1};
        delete data.limit;
        delete data.skip;
        delete data.sort;
        let rs = collection.find(data).sort(sort).skip(skip).limit(limit);
        let p1 = new Promise((resolve, reject) => {
          collection.count(data,(err, count) => {
            if (err) {
              reject('error');
            }
            resolve(count);
          });
        })
        let p2 = new Promise((resolve, reject) => {
          collection.find(data).sort(sort).skip(skip).limit(limit).toArray((err, result) => {
            if(err) {
              reject('error');
              return;
            }
            client.close();
            resolve(result);
          })
        })
        Promise.all([p1,p2]).then((value) => {
          resolve({count: value[0], data: value[1]});
        })
      }  
    })
  })
}
const updateData = (query, update, tablename) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(DB_CONN, (err, client) => {
      if(err) {
        resolve('error1');
        return;
      }
      const db = client.db('maoyan');
      const collection = db.collection(tablename);
      collection.updateOne(
        query,
        {$set: update},
        function (err, result) {
          if(err) {
            resolve('error');
            return;
          }
          client.close();
          resolve('update ok');
        }
      )
    })
  })
}
const incrementId = (name) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(DB_CONN, (err, client) => {
      if(err) {
        resolve('error');
        return;
      }
      const db = client.db('maoyan');
      const collection = db.collection('ids');
      collection.findAndModify(
        {name: name},
        [],
        {$inc:{id: 1}},
        {new: true},
        function (err, result) {
          if(err) {
            resolve('error');
            return;
          }
          client.close();
          resolve(result.value);
        }
      )
    })
  })
}

module.exports.insertData = insertData;
module.exports.deleteData = deleteData;
module.exports.queryData = queryData;
module.exports.updateData = updateData;
module.exports.incrementId = incrementId;