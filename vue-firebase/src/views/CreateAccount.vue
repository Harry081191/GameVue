<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <nav>
    <router-link to="/" style="font-size:50px;">MageSurvivor</router-link>
  </nav>
  <div class="Home">
    <div class="container">
      <div class="p-5 wrapper">
        <div class="row justify-content-center">
          <div class="col col-12 col-sm-6">
            <div class="jumbotron">
              <form @submit.prevent="handleSubmit">
                <h1 class="font">註冊帳號</h1>
                <strong class="font">帳號</strong>
                <input v-model="User.name" type="text" class="form-control font" id="Username" name="Username"
                  placeholder="請輸入帳號" required>
                <strong class="font">密碼</strong>
                <input v-model="User.password" type="password" class="form-control font" id="Password" name="Password"
                  placeholder="請輸入密碼" required>
                <div style="margin-top: 10px; margin-bottom: 10px;">
                  <button type="submit" class="btn btn-outline-danger font">
                    註冊
                  </button>
                </div>
                <div>
                  <a class="from-control mr-2 mb-1 mb-sm-0 font">I have the account return to</a>
                  <router-link to="/" class="from-control mr-2 mb-1 mb-sm-0">Login</router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  </div>
</template>

<style>
.font {
  font-family: 微軟正黑體;
}
</style>

<script>
import {
  getDatabase,
  ref as firebaseRef,
  onValue,
  set,
  child,
  get,
} from 'firebase/database';
import { firebaseApp } from '@/main';

export default {
  data() {
    return {
      User: {
        name: '',
        password: ''
      },
    };
  },
  computed: {
    isInvalidPassword() {
      return this.User.password.length < 6;
    },
  },
  methods: {
    async handleSubmit() {
      try {
        const db = getDatabase(firebaseApp);
        const name = this.User.name;

        const userRef = firebaseRef(db, `Users/${name}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          this.errorMessage = '用戶已存在，請使用其他用戶名稱。';
          return;
        }

        if (this.isInvalidPassword) {
          this.errorMessage = '密碼不能小於六個字。';
          return;
        }

        const password = this.User.password;
        set(userRef, {
          name: name,
          password: password,
        });

        this.$router.push({ name: 'Login' });

        console.log('User registered successfully!');
      } catch (error) {
        this.errorMessage = error.message;
        console.error('Error registering user:', error);
      }
    },
  },
};
</script>
