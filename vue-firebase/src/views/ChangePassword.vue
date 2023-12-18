<template>
  <div class="LoginView font">
    <nav class="navbar navbar-expand-lg navbar-light bg-dark">
      <div class="container-fluid">
        <div>
          <router-link to="/HomeView" style="color: #ffffff;">MageSurvivor</router-link>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto"> <!-- 使用 ml-auto 使選項靠右對齊 -->
            <li class="nav-item">
              <router-link to="/HomeView" class="nav-link" style="color: #ffffff;">首頁</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/Officialnotificationarea" class="nav-link" style="color: #ffffff;">官方公告</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/Playertalkarea" class="nav-link" style="color: #ffffff;">討論區</router-link>
            </li>
            <li class="nav-item">
              <a href="https://firebasestorage.googleapis.com/v0/b/game-ab172.appspot.com/o/MageSurvivor-1205.rar?alt=media&token=7f1b51d9-8eeb-4d62-93bf-126b8c71992e"
                target="_blank" class="nav-link" style="color: #ffffff;">下載遊戲</a>
            </li>
            <li class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false" style="color: #ffffff;">
                會員選單
              </a>
              <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                <router-link to="/ChangePassword" class="nav-link" style="color: #ffffff;">更改密碼</router-link>
                <router-link to="/EmailVerification" class="nav-link" style="color: #ffffff;">綁定電子郵件</router-link>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown"
        aria-haspopup="true" aria-expanded="false">
        Dropdown button
      </button>
      <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <a class="dropdown-item" href="#">Action</a>
        <a class="dropdown-item" href="#">Another action</a>
        <a class="dropdown-item" href="#">Something else here</a>
      </div>
    </div>

    <div class="container">
      <div class="p-5 wrapper">
        <div class="row justify-content-center">
          <div class="col col-12 col-sm-6">
            <div class="jumbotron">
              <form @submit.prevent="handleSubmit">
                <h1 class="font">變更密碼</h1>

                <strong>帳號</strong>
                <input v-model="User.name" type="text" class="form-control font" id="Name" name="Name" placeholder="請輸入帳號"
                  required />
                <strong>密碼</strong>
                <input v-model="User.password" type="password" class="form-control font" id="Password" name="Password"
                  placeholder="請輸入密碼" required />
                <strong>新密碼:</strong>
                <input v-model="User.newPassword" type="password" class="form-control font" id="newPassword"
                  placeholder="請輸入新密碼" required />
                <div style="margin-top: 10px; margin-bottom: 10px">
                  <button type="submit" class="btn btn-outline-danger font">
                    變更
                  </button>
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

<script>
import { getDatabase, ref, update, get } from "firebase/database";

export default {
  data() {
    return {
      User: {
        name: "",
        password: "",
        newPassword: "",
      },
      userExists: false,
      errorMessage: "",
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const db = getDatabase();
        const userRef = ref(db, `Users/${this.User.name}`);
        const userSnapshot = await get(userRef);

        if (userSnapshot.exists()) {
          const storedPassword = userSnapshot.val().password;

          if (this.User.password === storedPassword) {
            const newPassword = this.User.newPassword;
            await this.changePassword();
          } else {
            this.errorMessage = "密碼錯誤";
          }
        } else {
          this.errorMessage = "使用者不存在";
        }
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    },
    async changePassword() {
      try {
        const db = getDatabase();
        const userRef = ref(db, `Users/${this.User.name}`);

        if (this.User.newPassword.length >= 6) {
          await update(userRef, {
            password: this.User.newPassword,
          });

          this.errorMessage = "密碼變更成功";
        } else {
          this.errorMessage = "密碼字數需大於六個字";
        }

      } catch (error) {
        console.error("Error changing password:", error.message);
        this.errorMessage = "Error changing password. Please try again.";
      }
    },
  },
};
</script>

<style>
.font {
  font-family: 微軟正黑體;
}
</style>
