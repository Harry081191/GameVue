<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous" />
  <div class="font">
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
          <ul class="navbar-nav ml-auto">
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

            <li class="nav-item">
              <a href="#" class="nav-link" @click="showAccountOptions = !showAccountOptions"
                style="color: #ffffff; position: relative;">帳號選項</a>
              <ul v-if="showAccountOptions" class="account-options">
                <li>
                  <input type="file" @change="uploadImage" />
                </li>
                <li>
                  <router-link to="/ChangePassword" class="nav-link" style="color: #000000;">更換密碼</router-link>
                </li>
                <li>
                  <router-link to="/EmailVerification" class="nav-link" style="color: #000000;">綁定電子郵件</router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'LoginView' }" class="custom-link evenly-spaced-text"
                    @click="Logout">登出</router-link>
                </li>
              </ul>
            </li>

          </ul>
        </div>
      </div>
    </nav>

    <div>
      <p v-if="bindSuccess" style="color: green">綁定成功</p>
      <p v-if="bindFailure" style="color: red">Error</p>
    </div>

    <div v-if="ChangePassword">
      <h1>Change Password</h1>
      <div v-if="userExists">
        <label for="newPassword">新密碼:</label>
        <input v-model="newPassword" type="password" id="newPassword" required />
        <button @click="changePassword">更改密碼</button>
      </div>
      <div v-else>
        <p>使用者不存在</p>
      </div>
      <div v-if="ChangePasswordSuccess">
        <p>更改成功</p>
      </div>
    </div>
    <p>Email: {{ userEmail }}</p>
    <p>Name: {{ userName }}</p>
  </div>
</template>

<script>
import { getDatabase, ref, update, get } from "firebase/database";
import { getAuth, fetchSignInMethodsForEmail } from "firebase/auth";

export default {
  data() {
    return {
      bindSuccess: false,
      bindFailure: false,
      ChangePassword: false,
      ChangePasswordSuccess: false,
      newPassword: "",
      userExists: false,
    };
  },
  async created() {
    const auth = getAuth();

    const email = localStorage.getItem("userEmail");
    const name = localStorage.getItem("userName");
    const forget = localStorage.getItem("forget");
    this.userEmail = email;
    this.userName = name;

    if (!forget) {
      const db = getDatabase();
      const userRef = ref(db, `Users/${name}`);

      const userSnapshot = await get(userRef);
      const userData = userSnapshot.val();

      if (!userData.email) {
        update(userRef, {
          email: email,
        });
        this.bindSuccess = true;
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("forget");
      } else {
        this.bindFailure = true;
      }
    } else if (forget) {
      this.ChangePassword = true;
      const db = getDatabase();
      const userRef = ref(db, `Users/${name}`);

      get(userRef)
        .then((userSnapshot) => {
          if (userSnapshot.exists()) {
            this.userExists = true;
            console.log("使用者存在");
          } else {
            console.log("該名字的使用者不存在");
          }
        })
        .catch((error) => {
          console.error("獲取使用者時發生錯誤:", error.message);
        });
    } else {
      this.bindFailure = true;
    }
  },
  methods: {
    async changePassword() {
      const name = localStorage.getItem("userName");
      const newPassword = this.newPassword;

      if (newPassword.length >= 6) {
        const db = getDatabase();
        const userRef = ref(db, `Users/${name}`);

        update(userRef, {
          password: newPassword,
        });
        this.ChangePasswordSuccess = true;
        console.log("Password changed successfully!");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
        localStorage.removeItem("forget");
      } else {
        console.error("新密碼必須至少包含六個字元");
        // 可以顯示錯誤消息或執行其他相應的處理
      }
    },
    Logout() {
      localStorage.removeItem("rememberedUser");
    }
  },
};
</script>

<style>
.font {
  font-family: 微軟正黑體;
}

.menu-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-list li {
  margin-right: 15px;
}

.account-options {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #888;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
  list-style-type: none;
  padding: 10px;
  margin: 0;
  margin-top: 0;
  width: max-content;
  line-height: 30px;
  font-size: 14px;
}

.account-options li a {
  color: #000;
  font-size: 18px;
  line-height: 25px;
}

.account-options li:hover {
  background-color: #ddd;
}

.account-options li:active {
  background-color: #aaa;
}
</style>
