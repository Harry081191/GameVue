<template>
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
            <a href="https://drive.google.com/file/d/1d7i2-ogLFM8aEOmYDkwpWE-QSg32K3gP/view?usp=sharing" target="_blank"
              class="nav-link" style="color: #ffffff;">下載遊戲</a>
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
  <div>
    <h1>游戏下载页面</h1>
    <button @click="downloadGame">下載遊戲</button>
  </div>
</template>

<script>
export default {
  methods: {
    downloadGame() {
      const gameDownloadLink = "https://firebasestorage.googleapis.com/v0/b/game-ab172.appspot.com/o/MageSurvivor-1205.rar?alt=media&token=7f1b51d9-8eeb-4d62-93bf-126b8c71992e";

      const downloadLink = document.createElement('a');
      downloadLink.href = gameDownloadLink;
      downloadLink.target = '_blank';
      downloadLink.download = 'MageSurvivor-1205.rar';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }
};
</script>