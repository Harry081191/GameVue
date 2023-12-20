<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
  <div class="ForgetPassword font">
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
                  <input type="file" id="fileInput" ref="fileInput" style="display: none" @change="uploadImage" />

                  <strong for="fileInput" style="color: #000000; font-size: 18px;">
                    更換頭像
                  </strong>
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
    <div class="container">
      <div class="p-5 wrapper">
        <div class="row justify-content-center">
          <div class="col col-12 col-sm-6">
            <div class="jumbotron">
              <form @submit.prevent="handleSubmit">
                <h1>找回密碼</h1>
                <strong>電子信箱</strong>
                <input v-model="User.email" type="text" class="form-control" id="forgot" name="Mail" placeholder="請輸入帳號"
                  required />
                <strong class="font">帳號</strong>
                <input v-model="User.name" type="text" class="form-control font" id="Name" name="Name" placeholder="請輸入帳號"
                  required />
                <div style="margin-top: 10px; margin-bottom: 10px">
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
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { firebaseApp } from "@/main";

export default {
  data() {
    return {
      User: {
        email: "",
        name: "",
      },
    };
  },
  methods: {
    handleSubmit() {
      const email = this.User.email;
      const name = this.User.name;
      const auth = getAuth(firebaseApp);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("userName", name);
      localStorage.setItem("forget", true);
      sendPasswordResetEmail(auth, email)
        .then(() => {
          alert("已發送重設郵件至您的電子郵件地址，請檢查您的郵件。");
        })
        .catch((error) => {
          alert("發送重設郵件失敗：" + error.message);
        });
    },
    async uploadImage(event) {
      const file = event.target.files[0];
      if (file) {
        try {
          const db = getDatabase(firebaseApp);
          const officialRef1 = firebaseRef(db, `Users/${this.checkuserId}/UserImage`);
          const storage = getStorage();
          const imageRef = storageRef(storage, `${this.checkuserId}/${file.name}`);
          await uploadBytes(imageRef, file);
          const downloadURL = await getDownloadURL(imageRef);
          this.imageUrl = downloadURL;
          console.log(this.imageUrl);
          await set(officialRef1, this.imageUrl);
        } catch (error) {
          console.error('Error uploading image:', error);
        }
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
