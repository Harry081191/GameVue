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
              class="custom-link" :class="{ Serch: Serchstatus }">討論版</router-link>
          </li>
        </ul>
      </div>
      <form @submit.prevent="submitSerch" class="from-inline" style="text-align: right;">
        <input v-model="newSerch.userId" type="text" class="from-control mr-3 mb-2 mb-sm-0"
          placeholder="Serch player's UID">
        <button type="submit" class="btn btn-dark from-control mr-3 mb-2 mb-sm-0">Serch</button>
      </form>
      <a class="custom-link from-control mr-3 mb-2 mb-sm-0">
        |
      </a>
      <div v-if="Serchstatus === false" class="button-container">
        <router-link :to="{ name: 'Login' }" class="custom-link evenly-spaced-text">登出</router-link>
      </div>
      <div v-if="Serchstatus === true">
        <router-link :to="{ name: 'Home', params: { userId: $route.params.userId } }" class="custom-link Font-color"
          @click="toggleLogin">我的首頁</router-link>
      </div>
    </nav>
    <div class="container">
      <div class="p-3 wrapper">
        <div class="row justify-content-center">
          <div class="col-6" style="text-align: center">
            <h2>角色資訊</h2>
          </div>
          <div class="col-10 bg-secondary text-white"
            style="border-top-left-radius:50px; border-top-right-radius:50px; text-align: center;">
            <div class="dropdown" style="text-align: right; margin-right: 15px; margin-top: 5px;">
              <select v-model="selectedOption">
                <option value="">請選擇</option>
                <option v-for="option in options" :value="option.value" :key="option.value">
                  {{ option.label }}
                </option>
              </select>
            </div>
            <p style="font-size:20px;">名稱：{{ data.name }}</p>
            <img class="resizable-image" :src="data.UserImage">
          </div>
          <div class="col-10 bg-secondary text-white" style="text-align: center;">
            <a style="font-size: 30px;">
              <div v-if="data">
                <p>角色等級：{{ data.LV }}</p>
              </div>
            </a>
          </div>
          <div class="col-5 bg-secondary text-white" style="border-bottom-left-radius:50px; text-align: center;">
            <a style="font-size: 30px;">
              <p>HP：{{ data.HP }}</p>
              <p>MP：{{ data.MP }}</p>
              <p>ATK：{{ data.ATK }}</p>
            </a>
          </div>
          <div class="col-5 bg-secondary text-white" style="border-bottom-right-radius:50px; text-align: center;">
            <a style="font-size: 30px;">
              <p>DEF：{{ data.DFE }}</p>
              <p>SPD：{{ data.SPD }}</p>
            </a>
          </div>
        </div>
      </div>
    </div>
    <li v-for="(item, index) in Recordindex" :key="index">
      <a>第{{index + 1}}場</a>{{ index }}: {{ item }}
    </li>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  </div>
</template>
<style scoped>
.resizable-image {
  max-width: 500px;
  height: auto;
  margin: 0 auto;
}

.custom-link {
  font-size: 25px;
}

.Font-color {
  Color: #2c3e50;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 100px;
}

.evenly-spaced-text {
  text-align: center;
  width: 100%;
}

.Serch {
  pointer-events: none;
  opacity: 0.5;
}
</style>
<script>
import { getDatabase, ref as firebaseRef, onValue } from 'firebase/database';
import { firebaseApp } from '@/main';
import { mapGetters } from "vuex";

export default {
  beforeRouteEnter(to, from, next) {
    document.title = '首頁';
    next();
  },
  computed: {
    ...mapGetters(["getSharedUid"])
  },
  data() {
    return {
      dbmethod: {},
      data: {},
      Recorddata: {},
      Serchdata: {},
      dataindex: [],
      Recordindex: [],
      Serchdataindex: [],
      newSerch: {
        userId: '',
      },
      userId: null,
      errorMessage: null,
      selectedOption: '',
      checkuserId: '',
      checkuserIdc: '',
      Serchstatus: false,
      accountexist: false,
      isSerchRefListenerInitialized: false,
      options: [],
    };
  },
  mounted() {
    const db = getDatabase(firebaseApp);
    this.dbmethod = db;
    this.userId = this.$route.params.userId;
    this.checkuserId = this.userId;
    const SerchRef = firebaseRef(db, `Users/`);
    const dataRef = firebaseRef(db, `Users/${this.checkuserId}`);
    const RecordRef = firebaseRef(db, `Record/${this.checkuserId}`);
    this.listenToDataRef(dataRef);
    this.listenToRecord(RecordRef);
    if (!this.isSerchRefListenerInitialized) {
      onValue(SerchRef, (snapshot) => {
        const Serchdata = snapshot.val();
        this.Serchdataindex = Object.values(Serchdata);
        this.SerchdataLength = this.Serchdataindex.length;
        this.Serchdata = Serchdata;
      });
    }
    this.isSerchRefListenerInitialized = true;
  },
  methods: {
    listenToDataRef(dataRef) {
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        this.dataindex = Object.values(data);
        this.dataLength = this.dataindex.length;
        this.data = data;
        this.options = Object.keys(data).map((postId) => ({
          label: postId,
          value: data[postId],
        }));
        if (this.getSharedUid != this.userId) {
          this.$router.push({
            name: 'Login',
          });
        }
      });
    },
    listenToRecord(RecordRef) {
      onValue(RecordRef, (snapshot) => {
        const Recorddata = snapshot.val();
        this.Recordindex = Object.values(Recorddata);
        this.RecordLength = this.Recordindex.length;
        this.Recorddata = Recorddata;
        this.options = Object.keys(Recorddata).map((postId) => ({
          label: postId,
          value: Recorddata[postId],
        }));
        if (this.getSharedUid != this.userId) {
          this.$router.push({
            name: 'Login',
          });
        }
      });
    },
    submitSerch() {
      this.checkuserIdc = this.checkuserId;
      this.checkuserId = this.newSerch.userId;
      for (let i = 0; i < this.SerchdataLength; i++) {
        const SerchpostKeys = Object.keys(this.Serchdata);
        const SerchpostId = SerchpostKeys[i];
        if (this.checkuserId !== SerchpostId) {
          this.accountexist = false;
          this.errorMessage = 'This UID does not exist';
        } else if (this.checkuserId === this.userId || this.checkuserIdc === this.checkuserId) {
          this.accountexist = false;
          this.errorMessage = 'Duplicate UID cannot be used';
          break;
        } else if (this.checkuserId === SerchpostId) {
          this.accountexist = true;
          this.errorMessage = '';
          break;
        }
      }
      if (this.checkuserId != '' && this.accountexist) {
        if (!this.Serchstatus) {
          this.Serchstatus = !this.Serchstatus;
        }
        const newDataRef = firebaseRef(this.dbmethod, `Users/${this.checkuserId}`);
        this.listenToDataRef(newDataRef);
      }
      if (this.errorMessage !== '') {
        this.$toast.error(this.errorMessage, {
          position: 'top',
          duration: 3000,
          dismissible: true,
        });
        this.errorMessage = '';
      }
      this.newSerch.userId = '';
    },
    toggleLogin() {
      if (this.Serchstatus) {
        this.Serchstatus = !this.Serchstatus;
        this.checkuserId = this.userId;
        const newDataRef = firebaseRef(this.dbmethod, `Users/${this.checkuserId}`);
        this.listenToDataRef(newDataRef);
      }
    },
  },
};
</script>