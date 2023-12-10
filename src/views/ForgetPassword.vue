<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <router-link to="/" style="font-size:50px;">MageSurvivor</router-link>
  <div class="Home">
    <div class="container">
      <div class="p-5 wrapper">
        <div class="row justify-content-center">
          <div class="col col-12 col-sm-6">
            <div class="jumbotron">
              <form @submit.prevent="handleSubmit">
                <h1>找回密碼</h1>
                <strong>電子信箱</strong>
                <input v-model="User.email" type="text" class="form-control" id="forgot" name="Mail" placeholder="請輸入帳號"
                  required>
                <strong class="font">帳號</strong>
                <input v-model="User.name" type="text" class="form-control font" id="Name" name="Name" placeholder="請輸入帳號"
                  required>
                <div style="margin-top: 10px; margin-bottom: 10px;">
                  <button type="submit" class="btn btn-outline-danger">
                    發送信件
                  </button>
                </div>
                <div>
                  <a class="from-control mr-2 mb-1 mb-sm-0 font">I recalled my password. Return to</a>
                  <router-link to="/" class="from-control mr-2 mb-1 mb-sm-0">Login</router-link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { firebaseApp } from '@/main';

export default {
  data() {
    return {
      User: {
        email: '',
        name: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      const email = this.User.email;
      const name = this.User.name;
      const auth = getAuth(firebaseApp);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      localStorage.setItem('forget', true);
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert('已發送重設郵件至您的電子郵件地址，請檢查您的郵件。');
        })
        .catch((error) => {
          alert('發送重設郵件失敗：' + error.message);
        })
    }
  }
}
</script>