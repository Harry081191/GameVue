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
    <div>
      <h2>討論區</h2>
      <li v-for="(item, key) in data" :key="key">
        {{ key }}: {{ item }}
        <p v-if="data && data.content">{{ data.content.test }}</p>
      </li>
      <form @submit.prevent="submitPost">
        <input v-model="newPost.title" type="text" placeholder="帖子標題" required>
        <textarea v-model="newPost.content" placeholder="帖子內容" required></textarea>
        <button type="submit">提交</button>
      </form>
    </div>

  </div>
</template>
<style scoped>
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
        content: ''
      }
    };
  },
  mounted() {
    // Access the Firebase Realtime Database
    const db = getDatabase(firebaseApp);
    const dataRef = firebaseRef(db, 'official/');

    // Listen for changes in the 'data' node
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      this.data = data; // Store the data in the component's data property
    });
  },

  methods: {
    submitPost() {
      // Access the Firebase Realtime Database
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, 'official/title/test');
      const officialRef2 = firebaseRef(db, 'official/subject/test');
      const officialRef3 = firebaseRef(db, 'official/content/test');

      set(officialRef1, this.newPost.title);
      set(officialRef2, '維護');
      set(officialRef3, this.newPost.content);

      this.newPost.title = '';
      this.newPost.content = '';
    }
  },
}
</script>