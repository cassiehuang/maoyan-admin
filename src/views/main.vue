<template>
  <div>
    <v-toolbar app clipped-left color="primary">
      <v-toolbar-side-icon @click.native="drawer = ! drawer"></v-toolbar-side-icon>
      <v-toolbar-title>My Project Admin</v-toolbar-title>
    </v-toolbar>
    <v-navigation-drawer app v-model="drawer" clipped>
      <v-list>
        <v-list-group v-for="(item, idx) in items" :key="idx" v-model="item.active">
          <v-list-tile slot="activator">
            {{ item.title }}
          </v-list-tile>
          <v-list-tile v-for="(subitem) in item.subItem" :key="subitem.action" :class="{on: subitem.action === $route.path}" class="subNav">
            <v-list-tile-content @click="goTo(subitem.action)">
              <v-list-tile-title class="subTitle">{{ subitem.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-content>
      <router-view></router-view>
    </v-content>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [],
      drawer: true,
    }
  },
  computed: {},

  mounted() {
    this.initItems();
  },

  methods: {
    initItems() {
      if (this.$store.state.user.type === 'super') {
        this.items.push({
          title: '管理员',
          subItem: [
            {
              title: 'show administrator',
              action: 'show',
            },
            {
              title: 'add administrator',
              action: 'add',
            },
            {
              title: 'delete administrator',
              action: 'delete',
            }
          ]
        });
        this.items.push({
          title: '影院管理',
          subItem: [
            {
              title: '各地影院',
              action: '/cinemasManager',
            }
          ]
        });
      }
      this.items.push({
        title: '电影管理',
        active: true,
          subItem: [
            {
              title: '推荐位',
              action: '/recommandManager',
            },
            {
              title: '正在热映',
              action: '/filmManager/1',
            },
            {
              title: '即将上映',
              action: '/filmManager/2'
            },
            {
              title: '已经下映',
              action: '/filmManager/3'
            },
          ]
      })
    },
    goTo(to) {
      this.$router.push({
        path: to
      })
    },
  },
  watch: {

  }
}

</script>
<style scoped>
.subTitle {
  cursor: pointer;
}
.subNav:hover {
  background: #ececec;
}
.on {
  background: #acacac !important;
  color: #fff;
}
</style>