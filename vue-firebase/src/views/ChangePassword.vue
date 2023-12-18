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

            <div class="dropdown">
              <a class="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink"
                data-bs-toggle="dropdown" aria-expanded="false">
                Dropdown link
              </a>

              <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                <li><a class="dropdown-item" href="#">Action</a></li>
                <li><a class="dropdown-item" href="#">Another action</a></li>
                <li><a class="dropdown-item" href="#">Something else here</a></li>
              </ul>
            </div>

            <div id="menu">
              <ul>
                <li> <a href="#">Fruits</a>
                  <ul>
                    <li><a href="#">Apple</a></li>
                    <li><a href="#">Banana</a></li>
                    <li><a href="#">Cherry</a></li>
                    <li><a href="#">Orange</a></li>
                  </ul>
                </li>
                <li> <a href="#">Vegetables</a>
                  <ul>
                    <li><a href="#Broccoli">Broccoli</a></li>
                    <li><a href="#Cabbage">Cabbage</a></li>
                    <li><a href="#Peas">Peas</a></li>
                    <li><a href="#Onion">Onion</a></li>
                  </ul>
                </li>
                <li> <a href="#Meats">Meats</a>
                  <ul>
                    <li> <a href="#White_Meat">White Meat</a>
                      <ul>
                        <li><a href="#Chicken">Chicken</a></li>
                        <li><a href="#Duck">Duck</a></li>
                        <li><a href="#Fish">Fish</a></li>
                      </ul>
                    </li>
                    <li> <a href="#Red_Meat">Red Meat</a>
                      <ul>
                        <li><a href="#Beef">Beef</a></li>
                        <li><a href="#Pork">Pork</a></li>
                      </ul>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>

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
      selectedItem: null,
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

#menu {
  /* 選單大小 */
  width: 600px;
  height: 30px;
}

#menu ul {
  /* 取消ul樣式符號 */
  list-style-type: none;
  /* 重設ul邊界與留白為零 */
  margin: 0;
  padding: 0;
  /* 內有浮動元件時，需設overflow才會自動調整大小 */
  overflow: auto;
}

* html #menu ul {
  /* 解決IE6不理overflow問題，直接指定高度 */
  height: 30px;
}

#menu ul li {
  /* 利用float讓第一層li水平排列 */
  float: left;
}

/* 解決IE6條列式餘白問題*/
* html #menu ul li {
  display: inline;
}

#menu ul li a {
  /* 將a改為區塊元件，以便指定寬高 */
  display: block;
  /* 這邊也要設float，否則IE6會以100%寬度顯示 */
  float: left;
  /* 固定高度 */
  height: 30px;
  width: 100px;
  text-align: center;
}

#menu ul li ul {
  /* 讓第二層ul跳脫文件流以利定位 */
  position: absolute;
  /* 固定寬度 */
  width: 100px;
  /* 避免出現捲軸 */
  overflow: visible;
  /* 讓ul與母階層li相同位置 */
  clear: left;
  margin-top: 30px;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
}

/* 修正IE7絕對定位差異 */
*:first-child+html #menu ul li ul {
  margin-top: 0;
}

/* 修正IE6絕對定位差異 */
* html #menu ul li ul {
  margin-top: 0;
}

#menu ul li ul li {
  /* 覆寫繼承自第一層的浮動設定 */
  float: none;
  text-align: center;
}

#menu ul li ul li a {
  /* 覆寫繼承自第一層的浮動設定 */
  float: none;
  width: 100%;
  /* 註：display、height、padding繼承第一層的設定 */
}

#menu ul li ul li ul {
  margin-top: -30px;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 100px;
  width: 100%;
}

/* 修正IE7絕對定位差異 */
*:first-child+html #menu ul li ul li ul {
  margin-top: -30px;
}

#menu ul li ul li ul li {
  /* width、float繼承第二層，免設定 */
}

#menu ul li ul li ul li a {
  /* width、float繼承第二層，免設定 */
}

/* ---------- 隱藏與顯示階層 ---------- */
#menu ul li ul {
  /* 預先隱藏第二層 */
  visibility: hidden;
}

#menu ul li:hover ul {
  /* 觸動第一層時，顯示第二層 */
  visibility: visible;
}

#menu ul li:hover ul li ul {
  /* 顯示第二層時，隱藏第三層，避免同時彈出 */
  visibility: hidden;
}

#menu ul li ul li:hover ul {
  /* 觸動第二層時，顯示第三層 */
  visibility: visible;
}

#menu ul li ul li:hover ul li ul {
  /* 顯示第三層時，隱藏第四層，避免同時彈出 */
  visibility: hidden;
}

#menu ul li ul li ul li:hover ul {
  /* 觸動第三層時，顯示第四層 */
  visibility: visible;
}

/* ---------- 以下為美化用，非必需 ---------- */


/* 預設字體 */
#menu {
  color: #ffffff;;
}


/*第二層ul背景色彩與邊框  */
#menu ul li ul {
  background: #efefef;
}

/* 觸動第一層li時，改變背景色 */
#menu ul li:hover,
#menu ul li a:hover {
  background: #efefef;
}

#menu ul li:hover a {
  color: #333333;
}

/* 觸動第二層以上li時改變背景色 */
#menu ul li ul li:hover,
#menu ul li ul li a:hover {
  background: #dfdfdf;
}</style>
