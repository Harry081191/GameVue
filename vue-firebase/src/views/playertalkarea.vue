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
          <div class="col-10">
            <div style="text-align: right">
              <button @click="toggleForm">開啟表單</button>
            </div>
            <Transition>
              <div v-if="showForm" class="form-container">
                <form>
                  <div class="button-content">
                    <div class="button-content-left">
                      <button type="button" @click="toggleFormClone()"><i class="fas fa-times"></i></button>
                    </div>
                  </div>
                  <div>
                    <input style="text-align: center" v-model="newPost.title" type="text" placeholder="帖子標題" required>
                  </div>
                  <div>
                    <textarea style="text-align: center" v-model="newPost.subject" placeholder="帖子主旨" required></textarea>
                  </div>
                  <div>
                    <textarea style="text-align: center" v-model="newPost.content" placeholder="帖子內容" required></textarea>
                  </div>
                  <div style="text-align: right">
                    <button type="submit" @submit.prevent="submitPost">提交</button>
                  </div>
                </form>
              </div>
            </Transition>
          </div>
          <div class="col-10 bg-white text-dark" style="text-align: center;">
            <ul class="custom-list">
              <li v-for="(item, index) in dataindex" :key="index">
                <div class="post-container">
                  <div class="button-content">
                    <div class="button-content-left">
                      <button type="submit" :class="{ deleted: deletePosts[index] }" @click="toggleDelete(index)"><i
                          class="fas fa-times"></i></button>
                    </div>
                  </div>
                  <p style="font-size:40px;">{{ item.title }}</p>
                  <p style="font-size:40px;">{{ item.subject }}</p>
                  <p style="font-size:40px;">{{ item.content }}</p>
                  <div class="button-content">
                    <div class="button-content-left">
                      <a class="like-count">{{ item.message.total }}</a>
                      <button @click="toggleMessage(index)"><i class="fas fa-comment"></i></button>
                      <Transition>
                        <div v-if="showMessage && index === openFormIndex" class="message-container">
                          <form @submit.prevent="submitMessage">
                            <div class="button-content">
                              <div class="button-content-left">
                                <button type="button" @click="toggleMessageClone()"><i class="fas fa-times"></i></button>
                              </div>
                            </div>
                            <div>
                              <textarea v-model="newMessage.content" placeholder="回復內容" required></textarea>
                            </div>
                            <div class="button-content">
                              <div class="button-content-left">
                                <button type="submit">提交回復</button>
                              </div>
                            </div>
                            <p style="font-size:20px;">{{ item.message }}</p>
                          </form>
                        </div>
                      </Transition>
                      <a class="like-count">{{ item.likepeople.total }}</a>
                      <button type="submit" :class="{ liked: likedPosts[index] }" @click="toggleLike(index)"><i
                          class="fas fa-thumbs-up"></i></button>
                      <button type="submit" :class="{ unliked: unlikedPosts[index] }" @click="toggleUnLike(index)"><i
                          class="fas fa-thumbs-down"></i></button>
                    </div>
                  </div>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 20px; margin-right:20px;">創建時間：{{ item.createtime }}</span>
                  <span style="font-size: 20px;">創建人：{{ Object.values(item.createname)[0] }}</span>
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

.button-content-left {
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

button.deleted {
  visibility: hidden;
}

.post-container {
  border-top: 2px solid black;
  border-left: 2px solid black;
  border-right: 2px solid black;
  border-bottom: 2px solid black;
  padding: 10px;
}

.custom-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.custom-link {
  font-size: 25px;
}

.form-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(112, 231, 120);
  padding: 20px;
  z-index: 9999;
}

.message-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(112, 231, 120);
  padding: 20px;
  z-index: 9999;
}

.v-enter-active {
  transition: all 0.3s ease-out;
}

.v-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.v-enter-from,
.v-leave-to {
  transform: translateX(20px);
  opacity: 0;
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
      newMessage: {
        content: ''
      },
      userId: null,
      username: '',
      showForm: false,
      showMessage: false,
      openFormIndex: null,
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

        const officialRef1 = firebaseRef(db, `playertalk/${postId}/likepeople`);
        const officialRef2 = firebaseRef(db, `playertalk/${postId}/likepeople/total`);

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

        const unlikePeopleCount = (Object.keys(post.downvotepeople || {}).length) - 1;

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

        set(officialRef2, unlikePeopleCount);
      }

      for (let i = 0; i < this.dataLength; i++) {
        const postId = Object.keys(this.data)[i];

        const officialRef1 = firebaseRef(db, `playertalk/${postId}/createname`);

        get(officialRef1).then((snapshot) => {
          const deleted = snapshot.val();
          if (deleted && deleted[this.userId]) {
            this.deletePosts[i] = false;
          } else {
            this.deletePosts[i] = true;
          }

        });
      }

      for (let i = 0; i < this.dataLength; i++) {
        const post = this.dataindex[i];
        const postId = Object.keys(this.data)[i];

        const messageCount = (Object.keys(post.message || {}).length) - 1;

        const officialRef1 = firebaseRef(db, `playertalk/${postId}/message`);
        const officialRef2 = firebaseRef(db, `playertalk/${postId}/message/total`);

          set(officialRef2, messageCount);
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
      const officialRef1 = firebaseRef(db, `playertalk/${postId}`);
      const officialRef2 = firebaseRef(db, `playertalk/${postId}/likepeople`);
      const officialRef3 = firebaseRef(db, `playertalk/${postId}/downvotepeople`);
      remove(officialRef1);
      remove(officialRef2);
      remove(officialRef3);
    },
    toggleForm() {
      if (!this.showForm) {
        this.showForm = !this.showForm;
      }

      this.newPost.title = '';
      this.newPost.subject = '';
      this.newPost.content = '';
    },
    toggleFormClone() {
      this.showForm = !this.showForm;
    },
    toggleMessage(index) {
      this.indexMessage = index;
      this.openFormIndex = index;
      if (!this.showMessage) {
        this.showMessage = !this.showMessage;
      }
    },
    toggleMessageClone() {
      this.showMessage = !this.showMessage;
    },
    submitMessage() {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[this.indexMessage];
      const db = getDatabase(firebaseApp);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const currentDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}-${this.userId}`;

      const officialRef1 = firebaseRef(db, `playertalk/${postId}/message/${currentDateTime}/${this.username}`);

      set(officialRef1, this.newMessage.content);

      this.newMessage.content = '';
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
      const officialRef8 = firebaseRef(db, `playertalk/${uniqueCode}/createname/${this.userId}`);

      set(officialRef1, this.newPost.title);
      set(officialRef2, this.newPost.subject);
      set(officialRef3, this.newPost.content);
      set(officialRef4, 0);
      set(officialRef5, 0);
      set(officialRef6, 0);
      set(officialRef7, currentDateTime);
      set(officialRef8, this.username);

      this.showForm = !this.showForm;
    }
  },
}
</script>