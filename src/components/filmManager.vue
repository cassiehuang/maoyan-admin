<template>
  <v-container>
    <v-toolbar>
      <v-text-field placeholder="ID/电影名称" v-model="searchText"></v-text-field>
      <v-icon @click="search">search</v-icon>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-icon @click="addsheet=true">add</v-icon>
    </v-toolbar>
    <v-card>
      <v-data-table :headers="headers" :items="films" :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination" :total-items="totalItems">
        <template slot="items" slot-scope="props">
          <td style="font-size:26px;cursor:pointer" @click="addToRecommand(props.item)" class="text-xs-center">
            <span v-if="!props.item.isRecommand">+</span>
          </td>
          <td>{{props.item.title}}</td>
          <td>{{props.item.id}}</td>
          <td style="word-wrap:break-word;max-width: 370px">{{props.item.img}}</td>
          <td v-html="props.item.grade"></td>
          <td>{{catItems[(props.item.catId + 25) % 26].text}}</td>
          <td>{{sourceItems[(props.item.sourceId + 18) % 19].text}}</td>
          <td>{{timeItems[(props.item.timeId + 15) % 16].text}}</td>
          <td>
            <span @click="deleteFilm(props.item)">
              <i class="icon iconfont icon-delete"></i>
            </span>
            <span @click="modifyFilm(props.item)">
              <i class="icon iconfont icon-edit"></i>
            </span>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-card>
      <v-alert v-model="alert.show" :type="alert.type" dismissible class="info-box">{{ alert.text }}</v-alert>
    </v-card>
    <v-bottom-sheet v-model="addsheet">
      <v-card class="input-box">
        <v-layout justify-center>
          <v-flex md8 lg6>
            <v-text-field v-model="input.title" placeholder="电影名字"></v-text-field>
            <v-text-field v-model="input.grade" placeholder="得分"></v-text-field>
            <v-text-field v-model="input.img" placeholder="海报地址"></v-text-field>
            <v-select v-model="input.catId" :items="catItems" label="类型"></v-select>
            <v-select v-model="input.sourceId" :items="sourceItems" label="区域"></v-select>
            <v-select v-model="input.timeId" :items="timeItems" label="年代"></v-select>
            <v-btn color="primary" @click="clearInput">清除</v-btn>
            <v-btn color="primary" @click="submitInput">添加</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-bottom-sheet>
    <v-bottom-sheet v-model="editsheet">
      <v-card class="input-box">
        <v-layout justify-center>
          <v-flex md8 lg6>
            <v-text-field v-model="modifyForm.title" placeholder="电影名字"></v-text-field>
            <v-text-field v-model="modifyForm.grade" placeholder="得分"></v-text-field>
            <v-text-field v-model="modifyForm.img" placeholder="海报地址"></v-text-field>
            <v-select v-model="modifyForm.type" :items="typeItems" label="上映类型"></v-select>
            <v-select v-model="modifyForm.catId" :items="catItems" label="类型"></v-select>
            <v-select v-model="modifyForm.sourceId" :items="sourceItems" label="区域"></v-select>
            <v-select v-model="modifyForm.timeId" :items="timeItems" label="年代"></v-select>
            <v-btn color="primary" @click="backInput">还原</v-btn>
            <v-btn color="primary" @click="updateInput">修改</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import { queryFilms, queryRecommand, addRecommand, addFilms, deleteFilms, updateFilms } from '@/utils/api_helper.js'
import filmType from '@/data/filmType.json'

export default {
  data() {
    return {
      films: [],
      headers: [
        {
          text: '加入推荐列表',
          value: 'addToRecommand',
          width: '6%',
          align: 'right',
          sortable: false,
        },
        {
          text: '电影名字',
          value: 'filmName',
          width: '12%',
          sortable: false,
        },
        {
          text: 'ID',
          value: 'filmId',
          width: '10%',
          sortable: false,
        },
        {
          text: '海报',
          value: 'filmImage',
          width: '30%',
          sortable: false,
        },
        {
          text: '得分',
          value: 'grade',
          width: '5%',
          sortable: false,
        },
        {
          text: '类型',
          value: 'catId',
          width: '6%',
          sortable: false,
        },
        {
          text: '地区',
          value: 'sourceId',
          width: '8%',
          sortable: false,
        },
        {
          text: '时间',
          value: 'timeId',
          width: '8%',
          sortable: false,
        },
        {
          text: '编辑电影',
          value: 'deleteFile',
          width: '15%',
          sortable: false,
          align: 'left',
        }
      ],
      searchText: '',
      rowsPerPageItems: [10, 20],
      pagination: {
        rowsPerPage: 10,
        page: 1,
      },
      totalItems: 0,
      alert: {
        show: false,
        type: "success",
        text: "加入推荐列表成功",
      },
      addsheet: false,
      editsheet: false,
      input: {
        title: '',
        grade: '',
        img: '',
        catId: 2,
        sourceId: 2,
        timeId: 2,
      },
      modifyForm: {
        title: '',
        grade: '',
        img: '',
      },
      oldForm: null,
      typeItems: filmType.type,
      catItems: filmType.cat,
      sourceItems: filmType.source,
      timeItems: filmType.time,
      dataDisable: false,
    }
  },

  components: {},

  computed: {
    curType() {
      return parseInt(this.$route.params.type, 10);
    }
  },

  mounted() {
    this.getFilms();
  },

  methods: {
    search() {
      if (!this.searchText) return;
      if (this.searchText.replace(/[0-9]*/, '').length === 0) {
        this.getFilms({ id: parseInt(this.searchText) });
      } else {
        this.getFilms({ keyword: this.searchText });
      }
    },
    getFilms(args = {}) {
      if (!args.id && !args.keyword) {
        args.limit = this.pagination.rowsPerPage;
        args.skip = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      }
      args.type = this.curType;
      queryFilms(args).then((data) => {
        if (data.count) {
          this.totalItems = data.count
          this.films = data.data.slice();
        }
        this.dataDisable = false;
      }).catch(() => {
        this.dataDisable = false;
      })
    },
    deleteFilm(obj) {
      deleteFilms({ id: obj.id }).then((result) => {
        if (result === 'delete ok') {
          this.getFilms();
        }
      })
    },
    modifyFilm(obj) {
      this.oldForm = obj;
      this.modifyForm = JSON.parse(JSON.stringify(obj));
      this.editsheet = true;
    },
    addToRecommand(obj) {
      queryRecommand({ id: obj.id }).then((result) => {
        if (result.count === 0) {
          obj.time = new Date();
          addRecommand(obj).then((data) => {
            if (data === 'insert ok') {
              this.alert = {
                show: true,
                type: "success",
                text: "加入推荐列表成功",
              }
            }
          })
        } else if (result.count > 0) {
          this.alert = {
            show: true,
            type: "info",
            text: "已经在推荐列表内",
          }
        }
      })
    },
    clearInput() {
      this.input = {
        title: '',
        grade: '',
        img: '',
        catId: 2,
        sourceId: 2,
        timeId: 2,
      }
    },
    submitInput() {
      if (this.input.title && this.input.grade && this.input.img) {
        let data = this.input;
        data.time = new Date();
        data.type = this.curType;
        addFilms(data).then((result) => {
          if (result === 'insert ok') {
            this.alert = {
              show: true,
              type: "success",
              text: "添加电影成功",
            }
            this.getFilms();
            this.clearInput();
          } else {
            this.alert = {
              show: true,
              type: "error",
              text: "添加电影失败",
            }
          }
        })
      }
    },
    backInput() {
      this.modifyForm = JSON.parse(JSON.stringify(this.oldForm));
    },
    updateInput() {
      let obj = this.modifyForm;
      obj.time = new Date();
      delete obj._id;
      updateFilms(obj).then((data) => {
        if (data === 'update ok') {
          this.editsheet = false;
          this.alert = {
            show: true,
            type: "success",
            text: "修改成功",
          }
          this.getFilms();
        }
      })
    }
  },
  watch: {
    searchText(newValue) {
      if (newValue === '' && !this.dataDisable) {
        this.getFilms();
      }
    },
    pagination: {
      deep: true,
      immediate: false,
      handler: function () {
        if(!this.dataDisable) {
          this.getFilms();
        }    
      }
    },
    curType() {
      this.films = [];
      this.dataDisable = true;
      this.searchText = '';
      this.addSheet = false;
      this.editsheet = false;
      this.pagination = {
        rowsPerPage: 10,
        page: 1,
      };
      this.getFilms();
    }
  }
}

</script>
<style scoped>
.info-box {
  position: fixed;
  bottom: 0px;
  right: 50px;
  left: 350px;
  z-index: 1000;
}
.input-box {
  padding: 80px 60px;
}
.icon {
  color: red;
  font-size: 20px;
  cursor: pointer;
  display: inline-block;
  margin: 0 5px;
}
@media (max-width: 1263px) {
  .info-box {
    bottom: 0px;
    right: 0px;
    left: 0px;
    z-index: 1000;
  }
}
</style>