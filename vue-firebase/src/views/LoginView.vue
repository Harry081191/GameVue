<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
  <nav>
    <router-link to="/" style="font-size: 50px">MageSurvivor</router-link>
  </nav>
  <div class="LoginView">
    <div class="container">
      <div class="p-5 wrapper">
        <div class="row justify-content-center">
          <div class="col col-12 col-sm-6">
            <div class="jumbotron">
              <form @submit.prevent="handleSubmit">
                <h1 class="font">登入</h1>
                <strong class="font">帳號</strong>
                <input v-model="User.name" type="text" class="form-control font" id="Name" name="Name" placeholder="請輸入帳號"
                  required />
                <strong class="font">密碼</strong>
                <input v-model="User.password" type="password" class="form-control font" id="Password" name="Password"
                  placeholder="請輸入密碼" required />
                <div class="remember">
                  <router-link to="/ForgetPassword" style="margin-left: auto;">Forget Password?</router-link>
                </div>
                <div style="margin-top: 10px; margin-bottom: 10px">
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
}

.font {
  font-family: 微軟正黑體;
}
</style>
<script>
import { getDatabase, ref as firebaseRef, onValue, get, set, } from "firebase/database";
import { firebaseApp } from "@/main";

export default {
  beforeRouteEnter(to, from, next) {
    document.title = "登入介面";
    next();
  },
  mounted() {
    const db = getDatabase(firebaseApp);
    const dataRef = firebaseRef(db, "Users/");
    const rememberedUser = localStorage.getItem("rememberedUser");
    if (rememberedUser) {
      this.User = JSON.parse(rememberedUser);
      console.log(this.User);
      this.handleSubmit();
    }
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      this.data = data; // Store the data in the component's data property
    });
  },
  data() {
    return {
      data: {},
      User: {
        name: "",
        password: "",
      },
      yourUid: "",
      errorMessage: null,
    };
  },
  methods: {
    handleSubmit() {
      const name = this.User.name;
      const password = this.User.password;
      const db = getDatabase(firebaseApp);
      const usersRef = firebaseRef(db, "Users/");
      onValue(usersRef, (snapshot) => {
        const users = snapshot.val();
        const userImage = "https://firebasestorage.googleapis.com/v0/b/game-ab172.appspot.com/o/93cec08278a893ac.png?alt=media&token=b8785e2a-0017-4160-b015-4c6799b2adb2";
        const userAvailable = true;
        const matchedUser = Object.entries(users).find(
          ([key, user]) => user.name === name
        );
        const officialRef1 = firebaseRef(db, `Users/${name}/UserImage`);
        const officialRef2 = firebaseRef(db, `Users/${name}/UserAvailable`);
        if (matchedUser) {
          const [, userData] = matchedUser;

          if (userData.password === password) {
            const userId = matchedUser[0];
            get(firebaseRef(db, `Users/${name}/UserImage`)).then((snapshot) => {
              const UserImage = snapshot.val();
              if (UserImage === null) {
                set(officialRef1, userImage);
              }
            });
            get(firebaseRef(db, `Users/${name}/Manager`)).then((snapshot) => {
              const UserManager = snapshot.val();
              get(firebaseRef(db, `Users/${name}/UserAvailable`)).then(
                (snapshot) => {
                  const UserAvailable = snapshot.val();
                  if (UserAvailable === null && UserManager === null) {
                    set(officialRef2, userAvailable);
                  }
                  if (UserAvailable || UserManager || UserAvailable === null) {
                    this.$router.push({
                      name: "HomeView",
                    });
                  } else {
                    this.errorMessage = "Account blocked";
                    this.$toast.error(this.errorMessage, {
                      position: "top",
                      duration: 3000,
                      dismissible: true,
                    });
                    this.errorMessage = "";
                  }
                }
              );
            });
          } else {
            this.errorMessage = "Invalid password";
            this.$toast.error(this.errorMessage, {
              position: "top",
              duration: 3000,
              dismissible: true,
            });
            this.errorMessage = "";
          }
        } else {
          this.errorMessage = "Invalid account";
          this.$toast.error(this.errorMessage, {
            position: "top",
            duration: 3000,
            dismissible: true,
          });
          this.errorMessage = "";
        }
      });
      localStorage.setItem("rememberedUser", JSON.stringify(this.User));
    },
  },
};
</script>
