<template>
  <v-content>
    <v-layout align-center justify-center fill-height>
      <v-flex xl4 md6 sm10 xs11>
        <v-card>
          <v-toolbar dark color="primary title" elevation-12>登 录</v-toolbar>
          <v-card-text>
            <v-form ref="loginForm" v-model="valided" lazy-validation>
              <v-text-field v-model="name" label="username" required :rules="[rules.nameIsRequire, rules.max]" :counter="10" :error="showMatch"></v-text-field>
              <v-text-field v-model="password" label="password" required type="password" :error="showMatch"></v-text-field>
            </v-form>
          </v-card-text>
          <v-layout justify-end>
            <v-btn color="primary" @click="submit" :disable="!valided">登录</v-btn>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
import { login } from '@/utils/api_helper.js'

export default {
  data() {
    return {
      rules: {
        nameIsRequire: v => !!v || 'Name is required',
        max: v => (v && v.length <= 10) || 'Name must be less than 10 characters',
      },
      name: '',
      password: '',
      valided: false,
      showMatch: false,
    }
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    submit() {
      if (this.valided && this.password !== '') {
        login({
          username: this.name,
          password: this.password,
        }).then((data) => {
          if (data.username) {
            this.$store.commit('CHANGE_USER', data);
            this.$router.push({
              path: '/main'
            });
          } else {
            this.showMatch = true;
          }
        })
      }
    }
  },
  watch: {
    name() {
      if (this.showMatch) this.showMatch = false;
    },
    password() {
      if (this.showMatch) this.showMatch = false;
    }
  }
}

</script>
<style scoped>
</style>