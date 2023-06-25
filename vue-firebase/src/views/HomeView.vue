<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    
  <nav>
    <router-link to="/">遊戲名</router-link>
  </nav>
  <div class="home">
    <div class="container">
      <div class="p-5 wrapper">
        <div class="row justify-content-center">
          <div class="col-6">
            <div class="jumbotron">
              <form @submit.prevent="handleSubmit">
                <h1>登入</h1>
                <strong>帳號</strong>
                <input v-model="username" type="text" class="form-control" id="Username" name="Username"
                  placeholder="請輸入帳號或電子郵件">
                <strong>密碼</strong>
                <input v-model="password" type="password" class="form-control" id="Password" name="Password"
                  placeholder="請輸入密碼">
                <div class="d-grid gap-2 col-6 mx-auto">
                  <div class="d-grid gap-2 d-md-flex justify-content-center"
                  style="margin-top: 10px; margin-bottom: 10px;">
                    <button type="submit" class="btn btn-outline-danger">
                      登入
                    </button>
                  </div>
                  <a class="d-grid gap-2 d-md-flex justify-content-center a1"
                    style="margin-top: 10px; margin-bottom: 10px;">
                    <router-link to="/ForgetPassword">Forget Password?</router-link>
                  </a>
                  <a class="d-grid gap-2 d-md-flex justify-content-center a2" style="margin-top: 10px;">
                    <router-link to="/CreateAccount">Create Account?</router-link>
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="data">
      <ul>
        <li v-for="(item, key) in data" :key="key">
          {{ key }}: {{ item }}
        </li>
      </ul>
    </div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  </div>
</template>

<script>
import HelloWorld from '@/components/HelloWorld.vue';
import { getDatabase, ref as firebaseRef, onValue } from 'firebase/database';
import { firebaseApp } from '@/main';

export default {
  methods: {
    handleSubmit() {
      this.$nextTick(() => {
        const username = this.username;
        const password = this.password;
        const userMap = {
          "123": "User1",
          "456": "User2"
        };
        // Access the Firebase Realtime Database
        const db = getDatabase(firebaseApp);
        const usersRef = firebaseRef(db, 'Users/');

        let user = null; // 清除上一次驗證的結果

        // 監聽 'users' 路徑下的數據
        onValue(usersRef, (snapshot) => {
          const users = snapshot.val();

          // 驗證用戶名稱和密碼是否匹配
          user = Object.values(users).find((user) => user.Username === username && user.Password === password);

        });
        if (user) {
          const userId = userMap[user.Username];
          this.$router.push({
            name: 'Login',
            params: {
              userId: userId
            }
          });
        } else {
          // 登入失敗，顯示錯誤訊息
          this.errorMessage = 'Invalid username or password';

          // 使用懸浮視窗顯示錯誤訊息
          this.$toast.error(this.errorMessage, {
            position: 'top',
            duration: 3000,
            dismissible: true,
            // 其他選項...
          });
        }
      });
    }
  },
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data() {
    return {
      data: {}
    };
  },
  mounted() {
    // Access the Firebase Realtime Database
    const db = getDatabase(firebaseApp);
    const dataRef = firebaseRef(db, 'Users/');

    // Listen for changes in the 'data' node
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      this.data = data; // Store the data in the component's data property
    });
  }
};
</script>