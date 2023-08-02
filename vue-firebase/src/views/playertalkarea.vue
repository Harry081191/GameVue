<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  <div class="playertalkarea">
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
                        <div class="form-scroll">
                          <form @submit.prevent="submitMessage(index)">
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
                                <button type="submit" style="margin-bottom: 10px">提交回復</button>
                              </div>
                            </div>
                            <pre style="font-size:15px; text-align: left;" v-html="filteredMessage(item.message)"></pre>
                          </form>
                        </div>
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
  width: 600px;
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
      dataindex: [],
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
    const dataRef = firebaseRef(db, 'playertalk/');
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
        const MessageeRef = firebaseRef(db, `playertalk/${postId}/message`);

        
          const messageSnapshot = await get(MessageeRef);
          const message = messageSnapshot.val();
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

              const officialRef1 = firebaseRef(db, `playertalk/${postId}/message/${mpostId}/messagelike`);
              const officialRef2 = firebaseRef(db, `playertalk/${postId}/message/${mpostId}/messagelike/total`);
              const officialRef3 = firebaseRef(db, `playertalk/${postId}/message/${mpostId}/messagedownvote`);
              const officialRef4 = firebaseRef(db, `playertalk/${postId}/message/${mpostId}/messagedownvote/total`);

              set(officialRef2, mlikePeopleCount);
              set(officialRef4, munlikePeopleCount);
            }
          }

        const likePeopleCount = (Object.keys(post.likepeople || {}).length) - 1;
        const unlikePeopleCount = (Object.keys(post.downvotepeople || {}).length) - 1;
        const messageCount = (Object.keys(post.message || {}).length) - 1;

        const officialRef1 = firebaseRef(db, `playertalk/${postId}/likepeople`);
        const officialRef2 = firebaseRef(db, `playertalk/${postId}/likepeople/total`);
        const officialRef3 = firebaseRef(db, `playertalk/${postId}/downvotepeople`);
        const officialRef4 = firebaseRef(db, `playertalk/${postId}/downvotepeople/total`);
        const officialRef5 = firebaseRef(db, `playertalk/${postId}/createname`);
        const officialRef6 = firebaseRef(db, `playertalk/${postId}/message/total`);

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
      this.showForm = !this.showForm;

      this.newPost.title = '';
      this.newPost.subject = '';
      this.newPost.content = '';
    },
    toggleFormClone() {
      this.showForm = !this.showForm;
    },
    toggleMessage(index) {
      this.openFormIndex = index;
      this.showMessage = !this.showMessage;
    },
    toggleMessageClone() {
      this.showMessage = !this.showMessage;
    },
    filteredMessage(message) {
      const filtered = { ...message };
      delete filtered.total;
      const currentTime = new Date();

      const messagesArray = Object.values(filtered).map((message, index) => {
        const messageTime = new Date(message.messagetime);
        const timeDifferenceInSeconds = Math.floor((currentTime - messageTime) / 1000); // 計算時間差，轉換為秒

        let timeDifferenceText;
        if (timeDifferenceInSeconds < 60) {
          timeDifferenceText = `${timeDifferenceInSeconds}秒前`;
        } else if (timeDifferenceInSeconds < 3600) {
          const minutes = Math.floor(timeDifferenceInSeconds / 60);
          timeDifferenceText = `${minutes}分鐘前`;
        } else if (timeDifferenceInSeconds < 86400) {
          const hours = Math.floor(timeDifferenceInSeconds / 3600);
          timeDifferenceText = `${hours}小時前`;
        } else {
          const days = Math.floor(timeDifferenceInSeconds / 86400);
          timeDifferenceText = `${days}天前`;
        }

        const likeIcon = '<button type="button"><i class="far fa-thumbs-up"></i></button>';
        const unlikeIcon = '<button type="button"><i class="far fa-thumbs-down"></i></button>';
        const likes = `${likeIcon} ${message.messagelike.total} ${unlikeIcon}`;

        return message.messagename + ' ' + timeDifferenceText + '\n' + message.messagecontent + '\n' + likes + '  ' + '\n';
      });

      return messagesArray.join('\n');
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

      const officialRef1 = firebaseRef(db, `playertalk/${postId}/message/${currentDateTimeID}/messagename`);
      const officialRef2 = firebaseRef(db, `playertalk/${postId}/message/${currentDateTimeID}/messagecontent`);
      const officialRef3 = firebaseRef(db, `playertalk/${postId}/message/${currentDateTimeID}/messagetime`);
      const officialRef4 = firebaseRef(db, `playertalk/${postId}/message/${currentDateTimeID}/messagelike/total`);
      const officialRef5 = firebaseRef(db, `playertalk/${postId}/message/${currentDateTimeID}/messagedownvote/total`);

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