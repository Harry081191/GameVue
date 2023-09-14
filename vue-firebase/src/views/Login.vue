<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <div class="Longing">
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
      <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId"
        aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation"></button>
      <div class="collapse navbar-collapse" id="collapsibleNavId">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <router-link :to="{ name: 'Officialnotificationarea', params: { userId: $route.params.userId } }"
              class="custom-link">討論版</router-link>
          </li>
        </ul>
      </div>
      <form @submit.prevent="submitSerch" class="from-inline" style="text-align: right;">
        <input v-model="newSerch.userId" type="text" class="from-control mr-3 mb-2 mb-sm-0" placeholder="Serch player">
        <button type="submit" class="btn btn-dark from-control mr-3 mb-2 mb-sm-0">Serch</button>
      </form>
      <router-link :to="{ name: 'Home' }" class="custom-link">登出</router-link>
    </nav>
    <div class="container">
      <div class="p-3 wrapper">
        <div class="row justify-content-center">
          <div class="col-6" style="text-align: center">
            <h2>角色資訊</h2>
          </div>
          <div class="col-10 bg-dark text-white" style="text-align: center;">
            <div class="dropdown" style="text-align: right;">
              <select v-model="selectedOption">
                <option value="">請選擇</option>
                <option v-for="option in options" :value="option.value" :key="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <p style="font-size:20px;">名稱：{{ data.name }}</p>
            <p style="font-size:80px;">角色圖片{{ selectedOption }}</p>
          </div>
          <div class="col-10 bg-dark text-white" style="text-align: center;">
            <a style="font-size: 30px;">
              <div v-if="data">
                <p>角色等級：{{ data.LV }}</p>
              </div>
            </a>
          </div>
          <div class="col-5 bg-dark text-white" style="text-align: center;">
            <a style="font-size: 30px;">
              <p>HP：{{ data.HP }}</p>
              <p>MP：{{ data.MP }}</p>
              <p>ATK：{{ data.ATK }}</p>
            </a>
          </div>
          <div class="col-5 bg-dark text-white" style="text-align: center;">
            <a style="font-size: 30px;">
              <p>DEF：{{ data.DFE }}</p>
              <p>SPD：{{ data.SPD }}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.custom-link {
  font-size: 25px;
}
</style>
<script>
import { getDatabase, ref as firebaseRef, onValue } from 'firebase/database';
import { firebaseApp } from '@/main';
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters(["getSharedUid"])
  },
  data() {
    return {
      data: {},
      dataindex: [],
      newSerch: {
        userId: '',
      },
      selectedOption: '',
      checkuserId: '',
      Webstatus: false,
      options: [],
    };
  },
  mounted() {
    // Access the Firebase Realtime Database
    const db = getDatabase(firebaseApp);
    const userId = this.$route.params.userId; // 从路由参数中获取用户名
    this.checkuserId = userId;
    const dataRef = firebaseRef(db, `Users/${this.checkuserId}`);
    // Listen for changes in the 'data' node
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      this.dataindex = Object.values(data); // Convert object to array
      this.dataLength = this.dataindex.length; // Store the length
      this.data = data; // Store the data in the component's data property
      for (let i = 0; i < this.dataLength; i++) {
        const postKeys = Object.keys(this.data);
        const postId = postKeys[i];
        this.options.push({ label: `${postId}`, value: data[postId] });
      }
      console.log(this.dataLength);
      if (this.getSharedUid != userId) {
        this.$router.push({
          name: 'Home',
        })
      };
    });
  },
  methods: {
    submitSerch() {
      this.checkuserId = this.newSerch.userId;
      this.newSerch.userId = '';
      if (!this.Webstatus) {
        this.Webstatus = !this.Webstatus;
      }
      console.log(this.Webstatus);
    }
  },
};
</script>