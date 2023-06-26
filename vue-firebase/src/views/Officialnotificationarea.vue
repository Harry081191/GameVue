<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <div class="Officialnotificationarea">
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
      <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId"
        aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation"></button>
      <div class="collapse navbar-collapse" id="collapsibleNavId">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <router-link :to="{ name: 'playtallarea', params: { userId: $route.params.userId } }"
              class="custom-link">玩家討論版</router-link>
            <a class="custom-link">
              |
            </a>
            <router-link :to="{ name: 'Officialnotificationarea', params: { userId: $route.params.userId } }"
              class="custom-link">官方通知區</router-link>
          </li>
        </ul>
      </div>
      <router-link :to="{ name: 'Login', params: { userId: $route.params.userId } }"
        class="custom-link">我的首頁</router-link>
    </nav>
    <div class="container">
      <div class="p-3 wrapper" style="margin-bottom: -1px;">
        <div class="row justify-content-center">
          <div class="col-8" style="text-align: center">
            <h2>官方通知</h2>
          </div>
          <div class="col-10 bg-white text-dark" style="text-align: center;">
            <ul class="custom-list">
              <li v-for="(item, key) in data" :key="key">
                <div class="post-container">
                  <p class="left-align" style="font-size:40px;">{{ item.title.test }}</p>
                  <p class="left-align" style="font-size:40px;">{{ item.subject.test }}</p>
                  <p class="left-align" style="font-size:40px;">{{ item.content.test }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.post-container {
  border: 2px solid black;
  padding: 10px;
}
ul.custom-list {
  list-style-type: none;
}
ul.custom-list li p.left-align {
  text-indent: -40px;
  /* 调整您希望的负值 */
}
.custom-link {
  font-size: 25px;
}
</style>
<script>
import { getDatabase, ref as firebaseRef, onValue, set } from 'firebase/database';
import { firebaseApp } from '@/main';

export default {
  data() {
    return {
      data: {},
      newPost: {
        title: '',
        subject: '',
        content: ''
      }
    };
  },
  mounted() {
    // Access the Firebase Realtime Database
    const db = getDatabase(firebaseApp);
    const dataRef = firebaseRef(db, 'official/');

    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      this.data = data;
    });
  },
  methods: {
    submitPost() {
      const timestamp = Date.now();
      const randomCode = Math.random().toString(36).substring(2, 8);
      const uniqueCode = `${timestamp}-${randomCode}`;
      
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `official/${uniqueCode}/title/test`);
      const officialRef2 = firebaseRef(db, `official/${uniqueCode}/subject/test`);
      const officialRef3 = firebaseRef(db, `official/${uniqueCode}/content/test`);
      const officialRef4 = firebaseRef(db, `official/${uniqueCode}/like/test`);
      const officialRef5 = firebaseRef(db, `official/${uniqueCode}/downvote/test`);
      const officialRef6 = firebaseRef(db, `official/${uniqueCode}/message/test`);

      set(officialRef1, this.newPost.title);
      set(officialRef2, this.newPost.subject);
      set(officialRef3, this.newPost.content);
      set(officialRef4, 0);
      set(officialRef5, 0);
      set(officialRef6, '');

      this.newPost.title = '';
      this.newPost.subject = '';
      this.newPost.content = '';
    }
  },
}
</script>