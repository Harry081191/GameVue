<template>
  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
    crossorigin="anonymous"
  />
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
  />
  <div class="Longing">
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
      <button
        class="navbar-toggler d-lg-none"
        type="button"
        data-toggle="collapse"
        data-target="#collapsibleNavId"
        aria-controls="collapsibleNavId"
        aria-expanded="false"
        aria-label="Toggle navigation"
      ></button>
      <div class="collapse navbar-collapse" id="collapsibleNavId">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <router-link
              :to="{
                name: 'Officialnotificationarea',
                params: { userId: $route.params.userId },
              }"
              class="custom-link"
              :class="{ Serch: Serchstatus }"
              >討論版</router-link
            >
          </li>
        </ul>
      </div>
      <form
        @submit.prevent="submitSerch"
        class="from-inline"
        style="text-align: right"
      >
        <input
          v-model="newSerch.userId"
          type="text"
          class="from-control mr-3 mb-2 mb-sm-0"
          placeholder="Serch player's Name"
        />
        <button
          type="submit"
          class="btn btn-dark from-control mr-3 mb-2 mb-sm-0"
        >
          Serch
        </button>
      </form>
      <a class="custom-link from-control mr-3 mb-2 mb-sm-0"> | </a>
      <div v-if="Serchstatus === false" class="button-container">
        <router-link
          :to="{ name: 'LoginView' }"
          class="custom-link evenly-spaced-text"
          >登出</router-link
        >
      </div>
      <div v-if="Serchstatus === true">
        <router-link
          :to="{ name: 'HomeView', params: { userId: $route.params.userId } }"
          class="custom-link Font-color"
          @click="toggleLogin"
          >我的首頁</router-link
        >
      </div>
    </nav>
    <div class="container">
      <div class="p-3 wrapper">
        <div class="row justify-content-center">
          <div class="col-6" style="text-align: center">
            <h2>角色資訊<a v-if="data.Manager">(管理者)</a></h2>
          </div>
          <button
            type="button"
            :class="{ ban: !myselfidentity || !Serchstatus || data.Manager }"
            @click="ban"
          >
            <i class="fas fa-exclamation-triangle"></i>
          </button>
          <div
            class="col-10 bg-secondary text-white"
            style="
              border-top-left-radius: 50px;
              border-top-right-radius: 50px;
              text-align: center;
            "
          >
            <div
              class="dropdown"
              style="text-align: right; margin-right: 15px; margin-top: 5px"
            >
              <select v-model="selectedOption">
                <option value="">請選擇</option>
                <option
                  v-for="option in options"
                  :value="option.value"
                  :key="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
            <p style="font-size: 20px">名稱：{{ data.name }}</p>
            <img class="resizable-image" :src="data.UserImage" />
          </div>
          <div
            v-if="Recorddata === null"
            class="col-10 bg-secondary text-white"
            style="
              border-bottom-left-radius: 50px;
              border-bottom-right-radius: 50px;
              text-align: center;
            "
          >
            <a style="font-size: 20px">此帳戶目前沒有任何紀錄</a>
          </div>
          <div
            v-if="Recorddata !== null"
            class="col-10 bg-secondary text-white"
            style="text-align: center"
          >
            <a style="font-size: 20px">
              <ul class="custom-list">
                <p style="margin-bottom: 15px">最近遊玩(抓五個)</p>
                <li
                  style="margin-bottom: 20px"
                  v-for="(item, key, index) in Recorddata"
                  :key="key"
                >
                  <template
                    v-if="key !== 'TotalRecord' && index >= RecordLength - 5"
                  >
                    <a>遊玩日期{{ key }}：</a> 等級：{{
                      item.Level
                    }}／擊殺數：{{ item.killnumber }}／金幣：{{
                      item.money
                    }}／遊玩時長：{{ item.time }}<br />
                    技能升級： FireBallProject：{{
                      item.SkillUpgradeRecord.FireBallProject
                    }}／getBloodExplode：{{
                      item.SkillUpgradeRecord.getBloodExplode
                    }}／getFireBall：{{
                      item.SkillUpgradeRecord.getFireBall
                    }}／getFlameJet：{{
                      item.SkillUpgradeRecord.getFlameJet
                    }}／getLightningBlast：{{
                      item.SkillUpgradeRecord.getLightningBlast
                    }}／getMagicWeapon：{{
                      item.SkillUpgradeRecord.getMagicWeapon
                    }}
                  </template>
                </li>
              </ul>
            </a>
          </div>
          <div
            v-if="Recorddata !== null"
            class="col-10 bg-secondary text-white"
            style="text-align: center"
          >
            <a style="font-size: 20px">
              <ul class="custom-list">
                <p style="margin-top: 15px; margin-bottom: 15px">
                  存活時間最長(抓三個)
                </p>
                <li
                  style="margin-bottom: 20px"
                  v-for="(item, key) in Recorddata"
                  :key="key"
                >
                  <template v-if="key !== 'TotalRecord'"
                    ><a>遊玩日期{{ key }}：</a> 等級：{{
                      item.Level
                    }}／擊殺數：{{ item.killnumber }}／金幣：{{
                      item.money
                    }}／遊玩時長：{{ item.time }}<br />
                    技能升級： FireBallChain：{{
                      item.SkillUpgradeRecord.FireBallChain
                    }}／FireBallDamage：{{
                      item.SkillUpgradeRecord.FireBallDamage
                    }}／FireBallProject：{{
                      item.SkillUpgradeRecord.FireBallProject
                    }}／getBloodExplode：{{
                      item.SkillUpgradeRecord.getBloodExplode
                    }}／getFireBall：{{
                      item.SkillUpgradeRecord.getFireBall
                    }}／getFlameJet：{{
                      item.SkillUpgradeRecord.getFlameJet
                    }}／getLightningBlast：{{
                      item.SkillUpgradeRecord.getLightningBlast
                    }}／getMagicWeapon：{{
                      item.SkillUpgradeRecord.getMagicWeapon
                    }}
                  </template>
                </li>
              </ul>
            </a>
          </div>
          <div
            v-if="Recorddata !== null"
            class="col-10 bg-secondary text-white"
            style="
              border-bottom-left-radius: 50px;
              border-bottom-right-radius: 50px;
              text-align: center;
            "
          >
            <a style="font-size: 20px">
              <ul class="custom-list">
                <p style="margin-top: 15px; margin-bottom: 15px">遊玩總計</p>
                <li v-for="(item, key) in Recorddata" :key="key">
                  <template v-if="key === 'TotalRecord'"
                    ><a>總紀錄：</a> 總擊殺數：{{
                      item.totalkillnumber
                    }}／總獲取金幣：{{ item.totalmoney }}／總遊玩時長：{{
                      item.totaltime
                    }}秒
                  </template>
                </li>
              </ul>
            </a>
          </div>
        </div>
      </div>
    </div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  </div>
</template>
<style>
.resizable-image {
  max-width: 500px;
  height: auto;
  margin: 0 auto;
}

.custom-link {
  font-size: 25px;
}

.Font-color {
  color: #2c3e50;
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

.custom-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

button.ban {
  visibility: hidden;
}

a.ban {
  visibility: hidden;
}
</style>
<script>
import {
  getDatabase,
  ref as firebaseRef,
  onValue,
  set,
} from "firebase/database";
import { firebaseApp } from "@/main";
//import { mapGetters } from "vuex";

export default {
  beforeRouteEnter(to, from, next) {
    document.title = "首頁";
    next();
  } /*
  computed: {
    ...mapGetters(["getSharedUid"])
  },*/,
  data() {
    return {
      data: {},
      Recorddata: {},
      Serchdata: {},
      dataindex: [],
      Recordindex: [],
      Serchdataindex: [],
      newSerch: {
        userId: "",
      },
      userId: null,
      errorMessage: null,
      selectedOption: "",
      checkuserId: "",
      checkuserIdc: "",
      Serchstatus: false,
      accountexist: false,
      myselfidentity: false,
      options: [],
      RecordLength: 0,
    };
  },
  mounted() {
    const db = getDatabase(firebaseApp);
    this.userId = this.$route.params.userId;
    this.checkuserId = this.userId;
    const SerchRef = firebaseRef(db, `Users/`);
    const dataRef = firebaseRef(db, `Users/${this.checkuserId}`);
    const RecordRef = firebaseRef(db, `Record/${this.checkuserId}`);
    onValue(SerchRef, (snapshot) => {
      const Serchdata = snapshot.val();
      this.Serchdataindex = Object.values(Serchdata);
      this.SerchdataLength = this.Serchdataindex.length;
      this.Serchdata = Serchdata;
      this.listenToDataRef(dataRef);
      this.listenToRecord(RecordRef);
    });
  },
  methods: {
    listenToDataRef(dataRef) {
      onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        this.dataindex = Object.values(data);
        this.dataLength = this.dataindex.length;
        this.data = data;
        if (this.myselfidentity === false) {
          if (data.Manager === true) {
            this.myselfidentity = true;
          }
        }
        this.options = Object.keys(data).map((postId) => ({
          label: postId,
          value: data[postId],
        })); /*
        if (this.getSharedUid != this.userId) {
          this.$router.push({
            name: 'Login',
          });
        }*/
      });
    },
    listenToRecord(RecordRef) {
      onValue(RecordRef, (snapshot) => {
        const Recorddata = snapshot.val();
        if (Recorddata === null || Recorddata === undefined) {
          return;
        }
        this.Recordindex = Object.values(Recorddata);
        this.RecordLength = this.Recordindex.length;
        this.Recorddata = Recorddata;
        this.options = Object.keys(Recorddata).map((postId) => ({
          label: postId,
          value: Recorddata[postId],
        })); /*
        if (this.getSharedUid != this.userId) {
          this.$router.push({
            name: 'Login',
          });
        }*/
      });
    },
    submitSerch() {
      const db = getDatabase(firebaseApp);
      this.checkuserIdc = this.checkuserId;
      this.checkuserId = this.newSerch.userId;
      for (let i = 0; i < this.SerchdataLength; i++) {
        const SerchpostKeys = Object.keys(this.Serchdata);
        const SerchpostId = SerchpostKeys[i];
        if (this.checkuserId !== SerchpostId) {
          this.accountexist = false;
          this.errorMessage = "This UID does not exist";
        } else if (
          this.checkuserId === this.userId ||
          this.checkuserIdc === this.checkuserId
        ) {
          this.accountexist = false;
          this.errorMessage = "Duplicate UID cannot be used";
          break;
        } else if (this.checkuserId === SerchpostId) {
          this.accountexist = true;
          this.errorMessage = "";
          break;
        }
      }
      if (this.checkuserId != "" && this.accountexist) {
        if (!this.Serchstatus) {
          this.Serchstatus = !this.Serchstatus;
        }
        const newDataRef = firebaseRef(db, `Users/${this.checkuserId}`);
        const newDataRecordRef = firebaseRef(db, `Record/${this.checkuserId}`);
        this.listenToRecord(newDataRecordRef);
        this.listenToDataRef(newDataRef);
      }
      if (this.errorMessage !== "") {
        this.$toast.error(this.errorMessage, {
          position: "top",
          duration: 3000,
          dismissible: true,
        });
        this.errorMessage = "";
      }
      this.newSerch.userId = "";
    },
    toggleLogin() {
      const db = getDatabase(firebaseApp);
      if (this.Serchstatus) {
        this.Serchstatus = !this.Serchstatus;
        this.checkuserId = this.userId;
        this.Recorddata = null;
        const newDataRef = firebaseRef(db, `Users/${this.checkuserId}`);
        const newDataRecordRef = firebaseRef(db, `Record/${this.checkuserId}`);
        this.listenToRecord(newDataRecordRef);
        this.listenToDataRef(newDataRef);
      }
    },
    ban() {
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(
        db,
        `Users/${this.checkuserId}/UserAvailable`
      );
      set(officialRef1, false);
    },
  },
};
</script>
