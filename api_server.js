const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const insertData = require('./src/utils/database_helper.js').insertData;
const deleteData = require('./src/utils/database_helper.js').deleteData;
const queryData = require('./src/utils/database_helper.js').queryData;
const updateData = require('./src/utils/database_helper.js').updateData;
const incrementId = require('./src/utils/database_helper.js').incrementId;

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false, //刚被创建没有被修改，是否保持到storage中
    secure: true,
    name: 'sid', //session id 的名字，默认是connect.id
    cookie: { maxAge: 60 * 1000 * 30 }
  })
);

const salt1 = 'xyz';
const salt2 = 'abc';
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE');
  next();
});
app.post('/auth', (req, res) => {
  if (req.session.user) {
    let result = {
      username: req.session.user.username,
    };
    if (req.session.user.type) {
      result.type = req.session.user.type;
    }
    res.end(JSON.stringify(result));
  } else {
    res.end(JSON.stringify({isLogin: false}));
  }
});
app.post('/logout', (req, res) => {
  delete req.session;
  res.end("logout");
});
app.post('/login/*', (req, res) => {
  let args = req.body.data;
  if (args.username && args.password) {
    args.password = crypto
      .createHash('md5')
      .update(salt1 + args.password + salt2)
      .digest('hex');
  } else {
    res.end(JSON.stringify({status: -1, message: 'data error'}));
    return;
  }
  if ( req.url === '/login/user' ) {
    queryData(args, 'user')
    .then(data => {
      if (data.count === 0) {
        res.end(JSON.stringify({status: -1, message: 'not matched'}));
      } else {
        req.session.user = data.data[0];
        let result = {
          username: data.data[0].username,
        };
        res.end(JSON.stringify(result));
      }
    })
    .catch(err => {
      res.end(err);
    })
  } else if (req.url === '/login/admin' ) {
    queryData(args, 'admin')
    .then(data => {
      if (data.count === 0) {
        res.end(JSON.stringify({status: -1, message: 'not matched'}));
      } else {
        req.session.user = data.data[0];
        let result = {
          username: data.data[0].username,
          type: data.data[0].type
        };
        res.end(JSON.stringify(result));
      }
    })
    .catch(err => {
      res.end(err);
    })
  }
  ;
});
app.post('/admin/add', (req, res) => {
  insertData(req.body.data, 'admin').then(data => {
    res.end(data);
  });
});
app.get('/admin/query', (req, res) => {
  queryData(JSON.parse(req.query.data), 'admin')
    .then(data => {
      res.end(JSON.stringify(data));
    })
    .catch(err => {
      res.end(err);
    });
});
app.post('/user/add', (req, res) => {
  insertData(req.body.data, 'user').then(data => {
    res.end(data);
  });
});
app.get('/user/query', (req, res) => {
  queryData(JSON.parse(req.query.data), 'user')
    .then(data => {
      res.end(JSON.stringify(data));
    })
    .catch(err => {
      res.end(err);
    });
});
app.post('/admin/delete', (req, res) => {
  deleteData(req.body.data, 'admin').then(data => {
    res.end(data);
  });
});
app.post('/films/add', (req, res) => {
  incrementId('films').then((result) => {
    if (result.id) {
      req.body.data.id = result.id;
      insertData(req.body.data, 'films').then(data => {
        res.end(data);
      });
    } else {
      res.end('添加失败');
    }
  });
});
app.post('/films/delete', (req, res) => {
  deleteData(req.body.data, 'films').then(data => {
    res.end(data);
  });
});
app.get('/films/query', (req, res) => {
  queryData(JSON.parse(req.query.data), 'films')
    .then(data => {
      res.end(JSON.stringify(data));
    })
    .catch(err => {
      res.end(err);
    });
});
app.post('/films/update', (req, res) => {
  let query = {id: req.body.data.id};
  updateData(query, req.body.data, 'films').then(data => {
    res.end(data);
  });
});
app.post('/recommand/add', (req, res) => {
  insertData(req.body.data, 'recommand').then(data => {
    res.end(data);
  });
});
app.get('/recommand/query', (req, res) => {
  queryData(JSON.parse(req.query.data), 'recommand')
    .then(data => {
      res.end(JSON.stringify(data));
    })
    .catch(err => {
      res.end(err);
    });
});
app.post('/recommand/delete', (req, res) => {
  deleteData(req.body.data, 'recommand').then(data => {
    res.end(data);
  });
});
app.post('/recommand/update', (req, res) => {
  let query = {id: req.body.data.id};
  updateData(query, req.body.data, 'recommand').then(data => {
    res.end(data);
  });
});
app.post('/cinemas/add', (req, res) => {
  incrementId('cinemas').then((result) => {
    if (result.id) {
      req.body.data.id = result.id;
      insertData(req.body.data, 'cinemas').then(data => {
        res.end(data);
      });
    } else {
      res.end('添加失败');
    }
  });
});
app.get('/cinemas/query', (req, res) => {
  queryData(JSON.parse(req.query.data), 'cinemas')
    .then(data => {
      res.end(JSON.stringify(data));
    })
    .catch(err => {
      res.end(err);
    });
});
app.post('/cinemas/delete', (req, res) => {
  deleteData(req.body.data, 'cinemas').then(data => {
    res.end(data);
  });
});
app.post('/cinemas/update', (req, res) => {
  let query = {id: req.body.data.id};
  updateData(query, req.body.data, 'cinemas').then(data => {
    res.end(data);
  });
});
app.listen(3333);
