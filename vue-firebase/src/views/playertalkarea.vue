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
            <!-- :class="{ 'border-bottom': isLastItem(index) }"-->
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
              <li v-for="(item, index) in dataindex" :key="index">
                <div class="post-container">
                  <div class="button-content">
                    <div class="button-content1">
                      <button type="submit" :class="{ delete: deletePosts[index] }" @click="toggleDelete (index)"><i
                          class="fas fa-times"></i></button>
                    </div>
                  </div>
                  <p style="font-size:40px;">{{ item.title }}</p>
                  <p style="font-size:40px;">{{ item.subject }}</p>
                  <p style="font-size:40px;">{{ item.content }}</p>
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
                <div style="text-align: right;">
                  <span style="font-size: 20px; margin-right:30px;">創建時間：{{ item.createtime }}</span>
                  <span style="font-size: 20px;">創建人：{{ item.createname }}</span>
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

.like-count {
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

button.delete {
  background-color: red;
  color: black;
}

.post-container {
  border-top: 2px solid black;
  border-left: 2px solid black;
  border-right: 2px solid black;
  border-bottom: 2px solid black;
  padding: 10px;
}

/*
.border-bottom {
  border-bottom-width: 2px !important;
  border-bottom-style: solid;
  border-bottom-color: black !important;
}
*/
.custom-list {
  list-style-type: none;
}

.left-align {
  text-align: left !important;
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
      deletePosts: {},
      dataindex: [],
      data: {},
      newPost: {
        title: '',
        subject: '',
        content: ''
      },
      userId: null,
      username: ''
    };
  },
  mounted() {
    // Access the Firebase Realtime Database
    const db = getDatabase(firebaseApp);
    const dataRef = firebaseRef(db, 'playertalk/');
    this.userId = this.$route.params.userId;
    this.username = firebaseRef(db, `Users/${this.userId}/name`);

    // Listen for changes in the 'data' node
    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      this.dataindex = Object.values(data); // Convert object to array
      this.dataLength = this.dataindex.length; // Store the length
      this.data = data;

      for (let i = 0; i < this.dataLength; i++) {
        const post = this.dataindex[i];
        const postId = Object.keys(this.data)[i];

        const likePeopleCount = (Object.keys(post.likepeople || {}).length) - 1;

        const officialRef2 = firebaseRef(db, `playertalk/${postId}/likepeople/total`);
        const officialRef1 = firebaseRef(db, `playertalk/${postId}/likepeople`);

        get(officialRef1).then((snapshot) => {
          const likePeople = snapshot.val();
          if (likePeople && likePeople[this.userId]) {
            this.likedPosts[i] = true;
          } else {
            this.likedPosts[i] = false;
          }
        });

        set(officialRef2, likePeopleCount);
      }

      for (let i = 0; i < this.dataLength; i++) {
        const post = this.dataindex[i];
        const postId = Object.keys(this.data)[i];

        const likePeopleCount = (Object.keys(post.downvotepeople || {}).length) - 1;

        const db = getDatabase(firebaseApp);
        const officialRef1 = firebaseRef(db, `playertalk/${postId}/downvotepeople`);
        const officialRef2 = firebaseRef(db, `playertalk/${postId}/downvotepeople/total`);

        get(officialRef1).then((snapshot) => {
          const unlikePeople = snapshot.val();
          if (unlikePeople && unlikePeople[this.userId]) {
            this.unlikedPosts[i] = true;
          } else {
            this.unlikedPosts[i] = false;
          }

        });

        set(officialRef2, likePeopleCount);
      }
    });
    get(firebaseRef(db, `Users/${this.userId}/name`)).then((snapshot) => {
      this.username = snapshot.val();
    });
  },
  methods: {
    toggleLike(index) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef4 = firebaseRef(db, `playertalk/${postId}/likepeople/${this.userId}`);
      if (this.likedPosts[index]) {
        this.likedPosts[index] = false;

        remove(officialRef4);
      } else {
        this.likedPosts[index] = true;

        set(officialRef4, this.username);
        if (this.unlikedPosts[index]) {
          this.toggleUnLike(index);
        }
      }
    },
    toggleUnLike(index) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef5 = firebaseRef(db, `playertalk/${postId}/downvotepeople/${this.userId}`);
      if (this.unlikedPosts[index]) {
        this.unlikedPosts[index] = false;

        remove(officialRef5);
      } else {
        this.unlikedPosts[index] = true;

        set(officialRef5, this.username);
        if (this.likedPosts[index]) {
          this.toggleLike(index);
        }
      }
    },
    toggleDelete(index) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef5 = firebaseRef(db, `playertalk/${postId}/downvotepeople/${this.userId}`);
      if (this.unlikedPosts[index]) {
        this.unlikedPosts[index] = false;

        remove(officialRef5);
      } else {
        this.unlikedPosts[index] = true;

        set(officialRef5, this.username);
        if (this.likedPosts[index]) {
          this.toggleLike(index);
        }
      }
    },
    isLastItem(index) {
      return index === this.dataLength - 1;
    },
    submitPost() {
      const timestamp = Date.now();
      const randomCode = Math.random().toString(36).substring(2, 8);
      const uniqueCode = `${timestamp}-${randomCode}`;
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const currentDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `playertalk/${uniqueCode}/title`);
      const officialRef2 = firebaseRef(db, `playertalk/${uniqueCode}/subject`);
      const officialRef3 = firebaseRef(db, `playertalk/${uniqueCode}/content`);
      const officialRef4 = firebaseRef(db, `playertalk/${uniqueCode}/likepeople/total`);
      const officialRef5 = firebaseRef(db, `playertalk/${uniqueCode}/downvotepeople/total`);
      const officialRef6 = firebaseRef(db, `playertalk/${uniqueCode}/message/total`);
      const officialRef7 = firebaseRef(db, `playertalk/${uniqueCode}/createtime`);
      const officialRef8 = firebaseRef(db, `playertalk/${uniqueCode}/createname`);

      set(officialRef1, this.newPost.title);
      set(officialRef2, this.newPost.subject);
      set(officialRef3, this.newPost.content);
      set(officialRef4, 0);
      set(officialRef5, 0);
      set(officialRef6, 0);
      set(officialRef7, currentDateTime);
      set(officialRef8, this.username);

      this.newPost.title = '';
      this.newPost.subject = '';
      this.newPost.content = '';
    }
  },
}
</script>