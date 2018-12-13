const axios = require('axios');
axios.defaults.withCredentials = true;

const auth = () => {
  return axios.post('http://localhost:3333/auth').then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const login = (data) => {
  return axios.post('http://localhost:3333/login/admin',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const logout = () => {
  return axios.post('http://localhost:3333/logout').then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const addAdmin = (data) => {
  if (!data) {
    return ;
  }
  return axios.post('http://localhost:3333/admin/add',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const queryAdmin = (data = {}) => {
  return axios.get('http://localhost:3333/admin/query',{
    params: {
      data,
    }
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const addUser = (data) => {
  if (!data) {
    return ;
  }
  return axios.post('http://localhost:3333/user/add',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const queryUser = (data = {}) => {
  return axios.get('http://localhost:3333/user/query',{
    params: {
      data,
    }
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const deleteAdmin = (data) => {
  if (!data) {
    return new Promise((resolve) => {
      resolve('need args');
    });
  }
  return axios.post('http://localhost:3333/admin/delete',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const addFilms = (data) => {
  if (!data) {
    return ;
  }
  return axios.post('http://localhost:3333/films/add',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const queryFilms = (data = {}) => {
  return axios.get('http://localhost:3333/films/query',{
    params: {
      data,
    }
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const updateFilms = (data = {}) => {
  return axios.post('http://localhost:3333/films/update',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const deleteFilms = (data) => {
  if (!data) {
    return new Promise((resolve) => {
      resolve('need args');
    });
  }
  return axios.post('http://localhost:3333/films/delete',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const addRecommand = (data) => {
  if (!data) {
    return ;
  }
  return axios.post('http://localhost:3333/recommand/add',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const queryRecommand = (data = {}) => {
  return axios.get('http://localhost:3333/recommand/query',{
    params: {
      data,
    }
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const deleteRecommand = (data) => {
  if (!data) {
    return new Promise((resolve) => {
      resolve('need args');
    });
  }
  return axios.post('http://localhost:3333/recommand/delete',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const updateRecommand = (data = {}) => {
  return axios.post('http://localhost:3333/recommand/update',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const addCinemas = (data) => {
  if (!data) {
    return ;
  }
  return axios.post('http://localhost:3333/cinemas/add',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const queryCinemas = (data = {}) => {
  return axios.get('http://localhost:3333/cinemas/query',{
    params: {
      data,
    }
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const deleteCinemas = (data) => {
  if (!data) {
    return new Promise((resolve) => {
      resolve('need args');
    });
  }
  return axios.post('http://localhost:3333/cinemas/delete',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
const updateCinemas = (data = {}) => {
  return axios.post('http://localhost:3333/cinemas/update',{
    data: data,
  }).then((res) => {
    return res.data;
  }).catch((err) => {
    return err;
  })
};
export { auth, login, logout, addAdmin, queryAdmin, deleteAdmin, addFilms, queryFilms, deleteFilms, updateFilms, addRecommand, queryRecommand, 
  deleteRecommand, updateRecommand, addCinemas, addUser, queryUser, queryCinemas, deleteCinemas, updateCinemas }