<template>
  <v-container>
    <v-toolbar>
      <v-text-field placeholder="ID/影院名称" v-model="searchText"></v-text-field>
      <v-icon @click="search">search</v-icon>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-icon @click="addsheet=true">add</v-icon>
    </v-toolbar>
    <v-card>
      <v-data-table :headers="headers" :items="cinemas" :rows-per-page-items="rowsPerPageItems" :pagination.sync="pagination">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.id}}</td>
          <td>{{ props.item.name}}</td>
          <td>{{ props.item.address}}</td>
          <td>{{ props.item.brandId}}</td>
          <td>{{ props.item.areaId}}</td>
          <td>{{ props.item.hallId}}</td>
          <td>
            <span @click="delCinemas(props.item)">
              <i class="icon iconfont icon-delete"></i>
            </span>
            <span @click="modifyCinemas(props.item)">
              <i class="icon iconfont icon-edit"></i>
            </span>
          </td>
        </template>
      </v-data-table>
    </v-card>
    <v-bottom-sheet v-model="addsheet">
      <v-card class="input-box">
        <v-layout justify-center>
          <v-flex md8 lg6>
            <v-text-field v-model="addInput.name" placeholder="影院名字"></v-text-field>
            <v-text-field v-model="addInput.grade" placeholder="影院地址"></v-text-field>
            <v-select v-model="input.catId" :items="brandItems" label="影院品牌"></v-select>
            <v-select v-model="input.sourceId" :items="areaItems" label="影院区域"></v-select>
            <v-select v-model="input.timeId" :items="hallItems" label="影厅类型"></v-select>
            <v-btn color="primary" @click="clearAddInput">清除</v-btn>
            <v-btn color="primary" @click="submitAddInput">添加</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-bottom-sheet>
    <v-bottom-sheet v-model="editsheet">
      <v-card class="input-box">
        <v-layout justify-center>
          <v-flex md8 lg6>
            <v-text-field v-model="modifyInput.name" placeholder="影院名字"></v-text-field>
            <v-text-field v-model="modifyInput.address" placeholder="影院地址"></v-text-field>
            <v-select v-model="modifyInput.brandId" :items="brandItems" label="影院品牌"></v-select>
            <v-select v-model="modifyInput.areaId" :items="areaItems" label="影院区域"></v-select>
            <v-select v-model="modifyInput.hallId" :items="hallItems" label="影厅类型"></v-select>
            <v-btn color="primary" @click="backEditInput">还原</v-btn>
            <v-btn color="primary" @click="submitEditInput">修改</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-bottom-sheet>
  </v-container>
</template>

<script>
import { queryCinemas, deleteCinemas, updateCinemas, addCinemas } from '@/utils/api_helper.js'
import cinemas from '@/data/cinemas.json'

export default {
  data() {
    return {
      headers: [
        {
          text: '影院ID',
          width: '6%',
          value: 'id',
        },
        {
          text: '影院名称',
          width: '16%',
          sortable: false,
          value: 'name',
        },
        {
          text: '影院地址',
          width: '34%',
          sortable: false,
          value: 'address',
        },
        {
          text: '影院品牌',
          width: '6%',
          sortable: false,
          value: 'brandId',
        },
        {
          text: '影院地区',
          width: '6%',
          sortable: false,
          value: 'areaId',
        },
        {
          text: '影厅类型',
          width: '6%',
          sortable: false,
          value: 'hallId'
        },
        {
          text: '编辑影院',
          width: '15%',
          sortable: false,
          align: 'left',
        }
      ],
      cinemas: [],
      rowsPerPageItems: [10, 20],
      pagination: {
        page: 1,
        rowsPerPage: 10,
      },
      addSheet: false,
      editSheet: false,
      searchText: '',
      modifyInput: null,
      oldObj: null,
      addInput: {
        name: '',
        address: '',
        brandId: 2,
        hallId: 2,
        areaId: 2,
      },
      brandItems: cinemas.brand,
      areaItems: cinemas.area,
      hallItems: cinemas.hall,
    }
  },

  components: {},

  computed: {},

  mounted() {
    this.getCinemas();
  },

  methods: {
    search() {
      if (!this.searchText) return;
      if (this.searchText.replace(/[0-9]*/, '').length === 0) {
        this.getCinemas({ id: parseInt(this.searchText) });
      } else {
        this.getCinemas({ keyword: this.searchText });
      }
    },
    getCinemas() {
      queryCinemas({ limit: 10 }).then((data) => {
        if (data.count) {
          this.cinemas = data.data.slice();
        }
      })
    },
    delCinemas(obj) {
      deleteCinemas({id: obj.id}).then((data) => {
        if (data === 'delete ok') {
          this.getCinemas();
        }
      })
    },
    modifyCinemas(obj) {
      this.editSheet = true;
      this.modifyInput = JSON.parse(JSON.stringify(obj));
      this.oldObj = obj;
    },
    backEditInput() {
      this.modifyInput = JSON.parse(JSON.stringify(this.oldObj));
    },
    submitEditInput() {
      delete this.modifyInput._id;
      updateCinemas(this.modifyInput).then((data) => {
        if (data === 'update ok') {
          this.getCinemas();
          this.editSheet = false;
        }
      })
    },
    clearAddInput() {
      this.addInput = {
        name: '',
        address: '',
        brandId: 2,
        hallId: 2,
        areaId: 2,
      }
    },
    submitAddInput() {
      addCinemas(this.addInput).then((data) => {
        if (data === 'insert ok') {
          this.getCinemas();
        }
      })
    }
  },
  watch: {
    searchText(newValue) {
      if (newValue === '') {
        this.getCinemas();
      }
    },
    pagination: {
      deep: true,
      immediate: false,
      handler: function () {
        this.getCinemas();    
      }
    },
  }
}

</script>
<style scoped>
.icon {
  color: red;
  font-size: 20px;
  cursor: pointer;
  display: inline-block;
  margin: 0 5px;
}
</style>