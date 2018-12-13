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
      <v-data-table :headers="headers" :items="recommands">
        <template slot="items" slot-scope="props">
          <td>{{props.item.title}}</td>
          <td>{{props.item.id}}</td>
          <td>{{props.item.recommand_img || '还没有'}}</td>
          <td v-html="props.item.grade"></td>
          <td>
            <v-btn color="warning" @click="toggleRecommand(props.item)">{{props.item.isShow ? '是': '否'}}</v-btn>
          </td>
          <td>
            <span @click="deleteRecommands(props.item)">
              <i class="icon iconfont icon-delete"></i>
            </span>
            <span @click="modifyRecommands(props.item)"><i class="icon iconfont icon-edit"></i></span>
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
            <v-text-field placeholder="ID/电影名称" v-model="inputText"></v-text-field>
            <table class="table">
              <tr v-for="item in updateData" :key="item.id">
                <td>{{item.title}}</td>
                <td>{{item.id}}</td>
                <td v-html="item.grade"></td>
              </tr>
            </table>
            <v-btn color="primary" @click="inputSearch">查询</v-btn>
            <v-btn color="primary" @click="submitInput">确认添加</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-bottom-sheet>
    <v-bottom-sheet v-model="editsheet">
      <v-card class="input-box">
        <v-layout justify-center>
          <v-flex md8 lg6>
            <v-text-field placeholder="推荐位海报" v-model="edit.text"></v-text-field>
            <v-btn color="primary" @click="submitImg">确认添加</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import { queryFilms, queryRecommand, addRecommand, deleteRecommand, updateRecommand} from '@/utils/api_helper.js'

export default {
  data() {
    return {
      recommands: [],
      headers: [
        {
          text: '电影名字',
          value: 'filmName',
          width: '12%',
        },
        {
          text: 'ID',
          value: 'filmId',
          width: '10%',
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
          width: '10%',
        },
        {
          text: '是否展示',
          value: 'isShow',
          width: '10%'
        },
        {
          text: '删除',
          value: 'deleteRecommand',
          width: '10%'
        }
      ],
      alert: {
        show: false,
        type: "success",
        text: "加入推荐列表成功",
      },
      searchText: '',
      addsheet: false,
      editsheet: false,
      inputText: '',
      updateData: [],
      edit: {
        text: '',
        id: null,
      }
    }
  },

  components: {},

  computed: {},

  mounted() {
    this.getRecommands();
  },

  methods: {
    search() {
      if (!this.searchText) return;
      if (this.searchText.replace(/[0-9]*/, '').length === 0) {
        this.getRecommands({ id: parseInt(this.searchText) });
      } else {
        this.getRecommands({ keyword: this.searchText });
      }
    },
    getRecommands(args = {}) {
      queryRecommand(args).then((data) => {
        this.recommands = data.data.slice();
      })
    },
    deleteRecommands(obj) {
      deleteRecommand({ id: obj.id }).then((data) => {
        if (data === 'delete ok') {
          this.alert = {
            show: true,
            type: "success",
            text: "从推荐列表删除成功",
          }
          this.getRecommands();
        }
      })
    },
    toggleRecommand(obj) {
      updateRecommand({ id: obj.id, isShow: !obj.isShow }).then((data) => {
        if (data === 'update ok') {
          this.getRecommands();
        }
      })
    },
    submitInput() {
      if (this.updateData.length != 0) {
        addRecommand(this.updateData[0]).then((data) => {
          if (data === 'insert ok') {
            this.alert = {
              show: true,
              type: "success",
              text: "加入推荐列表成功",
            }
            this.getRecommands();
          }
        })
      } else {
        this.alert = {
              show: true,
              type: "info",
              text: "请确认该电影存在",
            }
      }
    },
    inputSearch() {
      if (!this.inputText) return;
      if (this.inputText.replace(/[0-9]*/, '').length === 0) {
        queryFilms({ id: parseInt(this.inputText) }).then((data) => {
          this.updateData = data.data.slice();
        })
      } else {
        queryFilms({ keyword: this.inputText }).then((data) => {
          this.updateData = data.data.slice();
        })
      }
    },
    modifyRecommands(obj) {
      this.editsheet = true;
      this.edit.id = obj.id;
    },
    submitImg() {
      updateRecommand({ id: this.edit.id, recommand_img: this.edit.text }).then((data) => {
        if (data === 'update ok') {
          this.alert = {
            show: true,
            type: "success",
            text: "海报添加成功",
          }
          this.editsheet = false;
          this.edit.id = null;
          this.edit.text = '';
          this.getRecommands();
        }
      })
    }
  },
  watch: {
    searchText(newValue) {
      if (newValue === '') {
        this.getRecommands();
      }
    },
    inputText() {
      this.updateData = [];
    }
  },
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
.table > tr > td {
  padding: 20px 50px 20px 0;
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