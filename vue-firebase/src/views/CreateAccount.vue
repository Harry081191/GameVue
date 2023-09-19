<template>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
      integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <nav>
      <router-link to="/">Register Account</router-link>
    </nav>
    <div class="CreateAccount">
      <div class="container">
        <div class="p-5 wrapper">
          <div class="row justify-content-center">
            <div class="col-6">
              <div class="jumbotron">
                <form @submit.prevent="handleSubmit">
                  <h1>登入</h1>
                  <strong>帳號</strong>
                  <input v-model="username" type="text" class="form-control" id="Username" name="Username"
                    placeholder="請輸入帳號">
                  <strong>密碼</strong>
                  <input v-model="password" type="password" class="form-control" id="Password" name="Password"
                    placeholder="請輸入密碼">
                  <div class="remember">
                    <label><input type="checkbox">Remember me</label>
                    <router-link to="/ForgetPassword">Forget Password?</router-link>
                  </div>
                  <div style="margin-top: 10px; margin-bottom: 10px;">
                    <button type="submit" class="btn btn-outline-danger">
                      登入
                    </button>
                  </div>
                  <div>
                    <a class="from-control mr-2 mb-1 mb-sm-0">Don't have an account?</a>
                    <router-link to="/CreateAccount">Register</router-link>
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
  <style scoped>
  .remember {
    display: flex;
    justify-content: space-between;
  }
  </style>
  <script>
  import { getDatabase, ref as firebaseRef, onValue } from 'firebase/database';
  import { firebaseApp } from '@/main';
  import { mapActions} from "vuex";
  
  export default {
    mounted() {
      const db = getDatabase(firebaseApp);
      const dataRef = firebaseRef(db, 'Users/');
  
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        this.data = data; // Store the data in the component's data property
      });
    },
    data() {
      return {
        data: {},
        yourUid: '',
        errorMessage: null
      };
    },
    methods: {
      ...mapActions(["updateSharedUid"]),
      handleSubmit() {
        const username = this.username;
        const password = this.password;
        const db = getDatabase(firebaseApp);
        const usersRef = firebaseRef(db, 'Users/');
  
        onValue(usersRef, (snapshot) => {
          const users = snapshot.val();
  
          const matchedUser = Object.entries(users).find(([key, user]) => user.Username === username);
  
          if (matchedUser) {
            const [, userData] = matchedUser;
  
            if (userData.Password === password) {
              const userId = matchedUser[0];
              this.updateSharedUid(userId);
              this.$router.push({
                name: 'Home',
                params: {
                  userId: userId
                }
              });
            } else {
              this.errorMessage = 'Invalid password';
  
              this.$toast.error(this.errorMessage, {
                position: 'top',
                duration: 3000,
                dismissible: true,
              });
  
              this.errorMessage = '';
            }
          } else {
            this.errorMessage = 'Invalid username';
  
            this.$toast.error(this.errorMessage, {
              position: 'top',
              duration: 3000,
              dismissible: true,
            });
  
            this.errorMessage = '';
          }
        });
      }
    },
  };
  </script>