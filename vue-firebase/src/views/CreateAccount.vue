<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <nav>
    <router-link to="/CreateAccount">Register Account</router-link>
  </nav>
  <div class="Home">
    <div class="container">
      <div class="p-5 wrapper">
        <div class="row justify-content-center">
          <div class="col-6">
            <div class="jumbotron">
              <form @submit.prevent="handleSubmit">
                <h1>註冊帳號</h1>
                <strong>電子郵件</strong>
                <input v-model="User.email" type="text" class="form-control" id="Email" name="Email" placeholder="請輸入電子郵件"
                  required>
                <strong>帳號</strong>
                <input v-model="User.username" type="text" class="form-control" id="Username" name="Username"
                  placeholder="請輸入帳號" required>
                <strong>密碼</strong>
                <input v-model="User.password" type="password" class="form-control" id="Password" name="Password"
                  placeholder="請輸入密碼" required>
                <div style="margin-top: 10px; margin-bottom: 10px;">
                  <button type="submit" class="btn btn-outline-danger">
                    註冊
                  </button>
                </div>
                <div>
                  <a class="from-control mr-2 mb-1 mb-sm-0">I have the account return to</a>
                  <router-link to="/" class="from-control mr-2 mb-1 mb-sm-0">Login</router-link>
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
<style></style>
<script>
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getDatabase, ref as firebaseRef, onValue, set } from 'firebase/database';
import { firebaseApp } from '@/main';

export default {
  beforeRouteEnter(to, from, next) {
    document.title = '創建帳號';
    next();
  },
  mounted() {
    const db = getDatabase(firebaseApp);
    const dataRef = firebaseRef(db, 'Users/');

    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      this.dataindex = Object.values(data); // Convert object to array
      this.dataLength = this.dataindex.length; // Store the length
      this.data = data; // Store the data in the component's data property
    });
  },
  data() {
    return {
      data: {},
      dataindex: [],
      User: {
        email: '',
        username: '',
        password: ''
      },
      errorMessage: null,
      UIDnumber: 0,
    };
  },
  methods: {
    handleSubmit() {
      const auth = getAuth(firebaseApp);
      const db = getDatabase(firebaseApp);
      createUserWithEmailAndPassword(auth, this.User.email, this.User.password)
        .then((userCredential) => {
          return sendEmailVerification(userCredential.user);
        })
        .then(() => {
          this.UIDnumber = this.dataLength + 1;
          console.log(this.dataLength);
          const formattedUIDnumber = this.UIDnumber.toString().padStart(7, '0');

          const officialRef1 = firebaseRef(db, `Users/${formattedUIDnumber}/ATK`);
          const officialRef2 = firebaseRef(db, `Users/${formattedUIDnumber}/DFE`);
          const officialRef3 = firebaseRef(db, `Users/${formattedUIDnumber}/HP`);
          const officialRef4 = firebaseRef(db, `Users/${formattedUIDnumber}/MP`);
          const officialRef5 = firebaseRef(db, `Users/${formattedUIDnumber}/LV`);
          const officialRef6 = firebaseRef(db, `Users/${formattedUIDnumber}/SPD`);
          const officialRef7 = firebaseRef(db, `Users/${formattedUIDnumber}/Name`);
          const officialRef8 = firebaseRef(db, `Users/${formattedUIDnumber}/Email`);
          const officialRef9 = firebaseRef(db, `Users/${formattedUIDnumber}/Username`);
          const officialRef10 = firebaseRef(db, `Users/${formattedUIDnumber}/Password`);

          set(officialRef1, 0);
          set(officialRef2, 0);
          set(officialRef3, 0);
          set(officialRef4, 0);
          set(officialRef5, 0);
          set(officialRef6, 0);
          set(officialRef7, ' ');
          set(officialRef8, this.User.email);
          set(officialRef9, this.User.username);
          set(officialRef10, this.User.password);

          this.$router.push({ name: 'Login' });
        })
        .catch((error) => {
          this.errorMessage = error;

          this.$toast.error(this.errorMessage, {
            position: 'top',
            duration: 3000,
            dismissible: true,
          });

          this.User.email = '';
          this.User.username = '';
          this.User.password = '';
          this.errorMessage = '';
        });
    }
  },
};
</script>