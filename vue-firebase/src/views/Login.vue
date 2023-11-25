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
                <h1 class="font">登入</h1>
                <strong class="font">帳號</strong>
                <input v-model="User.email" type="text" class="form-control font" id="Email" name="Email"
                  placeholder="請輸入帳號" required>
                <strong class="font">密碼</strong>
                <input v-model="User.password" type="password" class="form-control font" id="Password" name="Password"
                  placeholder="請輸入密碼" required>
                <div class="remember">
                  <label><input type="checkbox"><a class="font">Remember me</a></label>
                  <router-link to="/ForgetPassword">Forget Password?</router-link>
                </div>
                <div style="margin-top: 10px; margin-bottom: 10px;">
                  <button type="submit" class="btn btn-outline-danger">
                    登入
                  </button>
                </div>
                <div>
                  <a class="from-control mr-2 mb-1 mb-sm-0">Don't have an account?</a>
                  <router-link to="/CreateAccount" class="from-control mr-2 mb-1 mb-sm-0">Register</router-link>
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
.remember {
  display: flex;
  justify-content: space-between;
}
.font{
  font-family: 微軟正黑體;
}
</style>
<script>
import { getDatabase, ref as firebaseRef, onValue } from 'firebase/database';
import { firebaseApp } from '@/main';
import { mapActions } from "vuex";

export default {
  beforeRouteEnter(to, from, next) {
    document.title = '登入介面';
    next();
  },
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
      User: {
        email: '',
        password: ''
      },
      yourUid: '',
      errorMessage: null
    };
  },
  methods: {
    ...mapActions(["updateSharedUid"]),
    handleSubmit() {
      const email = this.User.email;
      const password = this.User.password;
      const db = getDatabase(firebaseApp);
      const usersRef = firebaseRef(db, 'Users/');
      
      onValue(usersRef, (snapshot) => {
        const users = snapshot.val();

        const matchedUser = Object.entries(users).find(([key, user]) => user.name === email);

        if (matchedUser) {
          const [, userData] = matchedUser;

          if (userData.password === password) {
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
          this.errorMessage = 'Invalid mail';

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