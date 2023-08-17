<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  <div class="Playertalkarea">
    <nav class="navbar navbar-expand-sm navbar-dark bg-primary">
      <button class="navbar-toggler d-lg-none" type="button" data-toggle="collapse" data-target="#collapsibleNavId"
        aria-controls="collapsibleNavId" aria-expanded="false" aria-label="Toggle navigation"></button>
      <div class="collapse navbar-collapse" id="collapsibleNavId">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <router-link :to="{ name: 'Playertalkarea', params: { userId: $route.params.userId } }"
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
  </div>
  <div class="container">
    <div class="p-3 wrapper" style="margin-bottom: -1px;">
      <div class="row justify-content-center">
        <div class="col-8" style="text-align: center">
          <h2>討論區</h2>
        </div>
        <div class="col-10">
          <div style="text-align: right">
            <button @click="toggleForm" style="margin-bottom: 10px">開啟表單</button>
          </div>
          <Transition>
            <div v-if="showForm" class="form-container">
              <form @submit.prevent="submitPost">
                <div class="button-content">
                  <div class="button-content-right">
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
                  <button type="submit">提交</button>
                </div>
              </form>
            </div>
          </Transition>
          <div v-if="showForm" class="overlay" @click="toggleFormClone"></div>
        </div>
        <div class="col-10 bg-white text-dark" style="text-align: center;">
          <ul class="custom-list">
            <li v-for="(item, index) in dataindex" :key="index">
              {{ index }}: {{ item }}
              <div class="post-container">
                <div class="button-content">
                  <div class="button-content-right">
                    <div id="menu">
                      <ul>
                        <li> <a>MENU</a>
                          <ul>
                            <li><button type="button"
                                style="margin-bottom:2.5px; margin-top:2.5px; width: 60px; height: 25px;"
                                :class="{ deleted: !deletePosts[index] }" @click="toggleReport(index)"><i
                                  class="fas fa-exclamation-triangle"></i> 舉報</button>
                            </li>
                            <li><button type="button"
                                style="margin-bottom:2.5px; margin-top:2.5px; width: 60px; height: 25px;"
                                :class="{ deleted: deletePosts[index] }" @click="toggleDelete(index)"><i
                                  class="far fa-trash-alt"></i> 刪除</button>
                            </li>
                            <li><button type="button"
                                style="margin-bottom:2.5px; margin-top:2.5px; width: 60px; height: 25px;"
                                :class="{ deleted: deletePosts[index] }" @click="toggleEdit(index)"><i
                                  class="far fa-edit"></i> 編輯</button>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <p style="font-size:40px;">{{ item.title }}</p>
                <p style="font-size:40px;">{{ item.subject }}</p>
                <p style="font-size:40px;">{{ item.content }}</p>
                <div class="button-content">
                  <div class="button-content-right">
                    <a class="like-count">{{ item.message.total }}</a>
                    <button type="button" @click="toggleMessage(index)"><i class="far fa-comment"></i></button>
                    <Transition>
                      <div v-if="showMessage && index === openFormIndex" class="message-container">
                        <div class="form-scroll">
                          <form @submit.prevent="submitMessage(index)">
                            <div class="button-content">
                              <div class="button-content-right">
                                <button type="button" @click="toggleMessageClone()"><i class="fas fa-times"></i></button>
                              </div>
                            </div>
                            <div>
                              <textarea v-model="newMessage.content" placeholder="回復內容" required></textarea>
                            </div>
                            <div class="button-content">
                              <button type="submit" style="margin-bottom: 10px">提交回復</button>
                            </div>
                            <ul class="custom-list">
                              <li v-for="(messageItem, messageIndex) in item.message" :key="messageIndex">
                                <template v-if="messageIndex !== 'total'">
                                  {{ index }}: {{ messageIndex }}: {{ messageItem }}
                                  <p style="font-size:15px; text-align: left;">{{ messageItem.messagename }}　{{
                                    messageItem.messagetime }}<button type="button" style="float: right;"
                                      @click="mtoggleDelete(index, messageIndex)"><i class="fas fa-times"></i></button>
                                  </p>
                                  <p style="font-size:15px; text-align: left;">{{ messageItem.messagecontent }}</p>
                                  <div class="button-content">
                                    <button type="button" style="text-align: left;" @click="mtoggleLike(index, messageIndex)"><i
                                        class="fas fa-thumbs-up"></i></button>
                                    <a class="like-count">{{ messageItem.messagelike.total }}</a>
                                    <button type="button" style="text-align: left;" @click="mtoggleUnLike(index, messageIndex)"><i
                                        class="fas fa-thumbs-down"></i></button>
                                  </div>
                                </template>
                              </li>
                            </ul>
                          </form>
                        </div>
                      </div>
                    </Transition>
                    <a class="like-count">{{ item.likepeople.total }}</a>
                    <button type="button" :class="{ liked: likedPosts[index] }" @click="toggleLike(index)"><i
                        class="far fa-thumbs-up"></i></button>
                    <button type="button" :class="{ unliked: unlikedPosts[index] }" @click="toggleUnLike(index)"><i
                        class="far fa-thumbs-down"></i></button>
                  </div>
                </div>
              </div>
              <div style="text-align: right;">
                <span style="font-size: 20px; margin-right:20px;">創建時間：{{ item.createtime }}</span>
                <span style="font-size: 20px; ">創建人：{{ Object.values(item.createname)[0] }}</span>
              </div>
              <p style="margin-bottom:20px"></p>
            </li>
          </ul>
          <div v-if="showMessage" class="overlay" @click="toggleMessageClone"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
#menu {
  width: 150px;
  height: 30px;
}

#menu ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: auto;
}

* html #menu ul {
  height: 30px;
}

* html #menu ul li {
  display: inline;
}

#menu ul li a {
  display: block;
  float: left;
  height: 30px;
  width: 150px;
  text-align: center;
}

#menu ul li ul {
  position: absolute;
  width: 150px;
  overflow: visible;
  clear: left;
  margin-top: 30px;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
}

*:first-child+html #menu ul li ul {
  margin-top: 0;
}

* html #menu ul li ul {
  margin-top: 0;
}

#menu ul li ul li {
  float: none;
  text-align: center;
}

#menu ul li ul li a {
  float: none;
  width: 100%;
}

#menu ul li ul li ul {
  margin-top: -30px;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 100px;
  width: 100%;
}

*:first-child+html #menu ul li ul li ul {
  margin-top: -30px;
}

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

#menu {
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
}

#menu ul {
  background: #6f6f6f;
}

#menu ul li a {
  color: #FFF;
  text-decoration: none;
  line-height: 30px;
}

#menu ul li ul {
  background: #efefef;
}

#menu ul li ul li a {
  font-size: 12px;
  color: #333333;
  text-decoration: none;
}

#menu ul li:hover,
#menu ul li a:hover {
  background: #efefef;
}

#menu ul li:hover a {
  color: #333333;
}

#menu ul li ul li:hover,
#menu ul li ul li a:hover {
  background: #dfdfdf;
}

.button-content {
  display: flex;
  align-items: center;
}

.button-content-right {
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
  display: none;
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
  width: 450px;
}

.message-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgb(112, 231, 120);
  padding: 20px;
  z-index: 9999;
  width: 400px;
}

.v-enter-active {
  transition: all 0.3s ease-out;
}

.v-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.v-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.form-scroll {
  max-height: 650px;
  overflow-y: auto;
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
      mlikedPosts: {},
      munlikedPosts: {},
      mdeletePosts: {},
      dataindex: [],
      mdataindex: [], postData: [],
      openFormIndex: {},
      data: {},
      message: {},
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
    const dataRef = firebaseRef(db, 'Playertalk/');
    this.userId = this.$route.params.userId;
    this.username = firebaseRef(db, `Users/${this.userId}/name`);

    // Listen for changes in the 'data' node
    onValue(dataRef, async (snapshot) => {
      const data = snapshot.val();
      this.dataindex = Object.values(data); // Convert object to array
      this.dataLength = this.dataindex.length; // Store the length
      this.data = data;

      for (let i = 0; i < this.dataLength; i++) {
        const post = this.dataindex[i];
        const postId = Object.keys(this.data)[i];
        const MessageeRef = firebaseRef(db, `Playertalk/${postId}/message`);
        this.postData.push({
          post: post, // 儲存論壇帖子資料
          messages: this.mdataindex, // 儲存對應的留言資料
        });
        const messageSnapshot = await get(MessageeRef);
        const message = messageSnapshot.val();
        this.mdataindex = Object.values(message); // Convert object to array
        this.mdataLength = this.mdataindex.length; // Store the length
        this.message = message;

        if (message) {
          const messageKeys = Object.keys(message);
          this.messageLength = messageKeys.length;

          for (let j = 0; j < this.messageLength; j++) {
            const mpostId = messageKeys[j];
            if (mpostId === 'total') continue;
            const mpost = message[mpostId];

            if (!mpost) {
              continue; // Skip the current loop iteration
            }

            const mlikePeopleCount = (Object.keys(mpost.messagelike || {}).length) - 1;
            const munlikePeopleCount = (Object.keys(mpost.messagedownvote || {}).length) - 1;

            const officialRef1 = firebaseRef(db, `Playertalk/${postId}/message/${mpostId}/messagelike`);
            const officialRef2 = firebaseRef(db, `Playertalk/${postId}/message/${mpostId}/messagelike/total`);
            const officialRef3 = firebaseRef(db, `Playertalk/${postId}/message/${mpostId}/messagedownvote`);
            const officialRef4 = firebaseRef(db, `Playertalk/${postId}/message/${mpostId}/messagedownvote/total`);
            /*
            get(officialRef1).then((snapshot) => {
              const messagelike = snapshot.val();
              if (messagelike && messagelike[this.userId]) {
                this.mlikedPosts[i] = true;
              } else {
                this.mlikedPosts[i] = false;
              }
            });

            get(officialRef3).then((snapshot) => {
              const messageunlike = snapshot.val();
              if (messageunlike && messageunlike[this.userId]) {
                this.munlikedPosts[i] = true;
              } else {
                this.munlikedPosts[i] = false;
              }
            });
            */
            set(officialRef2, mlikePeopleCount);
            set(officialRef4, munlikePeopleCount);
          }
        }

        const likePeopleCount = (Object.keys(post.likepeople || {}).length) - 1;
        const unlikePeopleCount = (Object.keys(post.downvotepeople || {}).length) - 1;
        const messageCount = (Object.keys(post.message || {}).length) - 1;

        const officialRef1 = firebaseRef(db, `Playertalk/${postId}/likepeople`);
        const officialRef2 = firebaseRef(db, `Playertalk/${postId}/likepeople/total`);
        const officialRef3 = firebaseRef(db, `Playertalk/${postId}/downvotepeople`);
        const officialRef4 = firebaseRef(db, `Playertalk/${postId}/downvotepeople/total`);
        const officialRef5 = firebaseRef(db, `Playertalk/${postId}/createname`);
        const officialRef6 = firebaseRef(db, `Playertalk/${postId}/message/total`);

        get(officialRef1).then((snapshot) => {
          const likePeople = snapshot.val();
          if (likePeople && likePeople[this.userId]) {
            this.likedPosts[i] = true;
          } else {
            this.likedPosts[i] = false;
          }
        });

        get(officialRef3).then((snapshot) => {
          const unlikePeople = snapshot.val();
          if (unlikePeople && unlikePeople[this.userId]) {
            this.unlikedPosts[i] = true;
          } else {
            this.unlikedPosts[i] = false;
          }
        });

        get(officialRef5).then((snapshot) => {
          const deleted = snapshot.val();
          if (deleted && deleted[this.userId]) {
            this.deletePosts[i] = false;
          } else {
            this.deletePosts[i] = true;
          }
        });

        set(officialRef2, likePeopleCount);
        set(officialRef4, unlikePeopleCount);
        set(officialRef6, messageCount);
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
      const officialRef1 = firebaseRef(db, `Playertalk/${postId}/likepeople/${this.userId}`);
      if (this.likedPosts[index]) {
        this.likedPosts[index] = false;

        remove(officialRef1);
      } else {
        this.likedPosts[index] = true;

        set(officialRef1, this.username);
        if (this.unlikedPosts[index]) {
          this.toggleUnLike(index);
        }
      }
    },
    toggleUnLike(index) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Playertalk/${postId}/downvotepeople/${this.userId}`);
      if (this.unlikedPosts[index]) {
        this.unlikedPosts[index] = false;

        remove(officialRef1);
      } else {
        this.unlikedPosts[index] = true;

        set(officialRef1, this.username);
        if (this.likedPosts[index]) {
          this.toggleLike(index);
        }
      }
    },
    toggleDelete(index) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Playertalk/${postId}`);
      const officialRef2 = firebaseRef(db, `Playertalk/${postId}/likepeople`);
      const officialRef3 = firebaseRef(db, `Playertalk/${postId}/downvotepeople`);
      remove(officialRef1);
      remove(officialRef2);
      remove(officialRef3);
    },
    toggleForm() {
      this.showForm = !this.showForm;

      this.newPost.title = '';
      this.newPost.subject = '';
      this.newPost.content = '';
    },
    toggleFormClone() {
      this.showForm = !this.showForm;
    },
    mtoggleLike(index, messageIndex) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Playertalk/${postId}/message/${messageIndex}/messagelike/${this.userId}`);
      set(officialRef1, this.username);
    },
    mtoggleUnLike(index, messageIndex) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Playertalk/${postId}/message/${messageIndex}/messagedownvote/${this.userId}`);
      set(officialRef1, this.username);
    },
    mtoggleDelete(index, messageIndex) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Playertalk/${postId}/message/${messageIndex}`);
      const officialRef2 = firebaseRef(db, `Playertalk/${postId}/message/${messageIndex}/messagelike`);
      const officialRef3 = firebaseRef(db, `Playertalk/${postId}/message/${messageIndex}/messagedownvote`);
      remove(officialRef1);
      remove(officialRef2);
      remove(officialRef3);
    },
    toggleMessage(index) {
      this.openFormIndex = index;
      this.showMessage = !this.showMessage;
    },
    toggleMessageClone() {
      this.showMessage = !this.showMessage;
    },
    submitMessage(index) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = now.getDate();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      const currentDateTimeID = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}-${this.userId}`;
      const currentDateTime = `${year}-${month}-${date} ${hours}:${minutes}`;

      const officialRef1 = firebaseRef(db, `Playertalk/${postId}/message/${currentDateTimeID}/messagename`);
      const officialRef2 = firebaseRef(db, `Playertalk/${postId}/message/${currentDateTimeID}/messagecontent`);
      const officialRef3 = firebaseRef(db, `Playertalk/${postId}/message/${currentDateTimeID}/messagetime`);
      const officialRef4 = firebaseRef(db, `Playertalk/${postId}/message/${currentDateTimeID}/messagelike/total`);
      const officialRef5 = firebaseRef(db, `Playertalk/${postId}/message/${currentDateTimeID}/messagedownvote/total`);

      set(officialRef1, this.username);
      set(officialRef2, this.newMessage.content);
      set(officialRef3, currentDateTime);
      set(officialRef4, 0);
      set(officialRef5, 0);

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
      const officialRef1 = firebaseRef(db, `Playertalk/${uniqueCode}/title`);
      const officialRef2 = firebaseRef(db, `Playertalk/${uniqueCode}/subject`);
      const officialRef3 = firebaseRef(db, `Playertalk/${uniqueCode}/content`);
      const officialRef4 = firebaseRef(db, `Playertalk/${uniqueCode}/likepeople/total`);
      const officialRef5 = firebaseRef(db, `Playertalk/${uniqueCode}/downvotepeople/total`);
      const officialRef6 = firebaseRef(db, `Playertalk/${uniqueCode}/message/total`);
      const officialRef7 = firebaseRef(db, `Playertalk/${uniqueCode}/createtime`);
      const officialRef8 = firebaseRef(db, `Playertalk/${uniqueCode}/createname/${this.userId}`);

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