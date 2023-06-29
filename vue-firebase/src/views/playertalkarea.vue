<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  <div class="Officialnotificationarea">
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
      <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId"
        aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation"></button>
      <div class="collapse navbar-collapse" id="collapsibleNavId">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <router-link :to="{ name: 'playertalkarea', params: { userId: $route.params.userId } }"
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
            <h2>討論區</h2>
          </div>
          <div class="col-10" style="text-align: right">
            <form @submit.prevent="submitPost">
              <input v-model="newPost.title" type="text" placeholder="帖子標題" required>
              <textarea v-model="newPost.subject" placeholder="帖子主旨" required></textarea>
              <textarea v-model="newPost.content" placeholder="帖子內容" required></textarea>
              <button type="submit">提交</button>
            </form>
          </div>
          <div class="col-10 bg-white text-dark" style="text-align: center;">
            <ul class="custom-list">
              <li v-for="(item, index) in data" :key="index">
                <div class="post-container" :class="{ 'border-bottom': isLastItem(index) }">
                  <p class="left-align" style="font-size:40px;">{{ item.title }}</p>
                  <p class="left-align" style="font-size:40px;">{{ item.subject }}</p>
                  <p class="left-align" style="font-size:40px;">{{ item.content }}</p>
                  <div class="button-content">
                    <div class="button-content1">
                      <button type="submit"><i class="fas fa-comment"></i></button>
                      <a class="like-count">{{ item.likepeople.total }}</a>
                      <button type="submit" :class="{ liked: likedPosts[index] }" @click="toggleLike(index)"><i
                          class="fas fa-thumbs-up"></i></button>
                      <button type="submit" :class="{ unliked: unlikedPosts[index] }" @click="toggleUnLike(index)"><i
                          class="fas fa-thumbs-down"></i></button>
                    </div>
                  </div>
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
.button-content {
  display: flex;
  align-items: center;
}

.button-content1 {
  margin-left: auto;
}

.button-content1 .like-count {
  margin-right: 17.5px;
  margin-left: 17.5px;
}

.button-content button+button {
  margin-left: 10px;
}

button.liked {
  background-color: blue;
  color: black;
}

button.unliked {
  background-color: red;
  color: black;
}

.post-container {
  border-top: 2px solid black;
  border-left: 2px solid black;
  border-right: 2px solid black;
  padding: 10px;
}

.border-bottom {
  border-bottom-width: 2px !important;
  border-bottom-style: solid;
  border-bottom-color: black !important;
}

ul.custom-list {
  list-style-type: none;
}

ul.custom-list li p.left-align {
  text-indent: -40px;
}

.custom-link {
  font-size: 25px;
}
</style>
<script>
import { getDatabase, ref as firebaseRef, onValue, set, get, remove } from 'firebase/database';
import { firebaseApp } from '@/main';
export default {
  data() {
    return {
      likedPosts: {},
      unlikedPosts: {},
      data: [],
      data1: {},
      newPost: {
        title: '',
        subject: '',
        content: ''
      },
      userId: null
    };
  },
  mounted() {
    this.userId = this.$route.params.userId;

    // Access the Firebase Realtime Database
    const db = getDatabase(firebaseApp);
    const dataRef = firebaseRef(db, 'playertalk/');

    // Listen for changes in the 'data' node
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      this.data = Object.values(data); // Convert object to array
      this.dataLength = this.data.length; // Store the length
      this.data1 = data;
    });
  },
  methods: {
    toggleLike(index) {
      if (this.likedPosts[index]) {
        this.likedPosts[index] = false;

        const postKeys = Object.keys(this.data1);
        const postId = postKeys[index];
        const db = getDatabase(firebaseApp);
        const officialRef4 = firebaseRef(db, `playertalk/${postId}/likepeople/total`);
        const officialRef5 = firebaseRef(db, `playertalk/${postId}/likepeople/${this.userId}`);

        get(officialRef4).then((snapshot) => {
          const currentLikes = snapshot.val() || 0;
          set(officialRef4, currentLikes - 1);
        });
        remove(officialRef5);
      } else {
        this.likedPosts[index] = true;

        const postKeys = Object.keys(this.data1);
        const postId = postKeys[index];
        const db = getDatabase(firebaseApp);
        const officialRef4 = firebaseRef(db, `playertalk/${postId}/likepeople/total`);
        const officialRef5 = firebaseRef(db, `playertalk/${postId}/likepeople/${this.userId}`);

        get(officialRef4).then((snapshot) => {
          const currentLikes = snapshot.val() || 0;
          set(officialRef4, currentLikes + 1);
        });
        set(officialRef5, this.userId);
      }
    },
    toggleUnLike(index) {
      if (this.unlikedPosts[index]) {
        this.unlikedPosts[index] = false;

        const postKeys = Object.keys(this.data1);
        const postId = postKeys[index];
        const db = getDatabase(firebaseApp);
        const officialRef4 = firebaseRef(db, `playertalk/${postId}/downvote/total`);

        get(officialRef4).then((snapshot) => {
          const currentLikes = snapshot.val() || 0;
          set(officialRef4, currentLikes - 1);
        });
      } else {
        this.unlikedPosts[index] = true;

        const postKeys = Object.keys(this.data1);
        const postId = postKeys[index];
        const db = getDatabase(firebaseApp);
        const officialRef4 = firebaseRef(db, `playertalk/${postId}/downvote/total`);

        get(officialRef4).then((snapshot) => {
          const currentLikes = snapshot.val() || 0;
          set(officialRef4, currentLikes + 1);
        });
      }
    },
    isLastItem(index) {
      return index === this.dataLength - 1;
    },
    submitPost() {
      const timestamp = Date.now();
      const randomCode = Math.random().toString(36).substring(2, 8);
      const uniqueCode = `${timestamp}-${randomCode}`;

      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `playertalk/${uniqueCode}/title`);
      const officialRef2 = firebaseRef(db, `playertalk/${uniqueCode}/subject`);
      const officialRef3 = firebaseRef(db, `playertalk/${uniqueCode}/content`);
      const officialRef4 = firebaseRef(db, `playertalk/${uniqueCode}/likepeople/total`);
      const officialRef5 = firebaseRef(db, `playertalk/${uniqueCode}/downvotepeople/total`);
      const officialRef6 = firebaseRef(db, `playertalk/${uniqueCode}/message/total`);

      set(officialRef1, this.newPost.title);
      set(officialRef2, this.newPost.subject);
      set(officialRef3, this.newPost.content);
      set(officialRef4, 0);
      set(officialRef5, 0);
      set(officialRef6, 0);

      this.newPost.title = '';
      this.newPost.subject = '';
      this.newPost.content = '';
    }
  },
}
</script>