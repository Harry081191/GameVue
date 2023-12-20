<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous" />
  <div class="Officialnotificationarea">
    <nav class="navbar navbar-expand-lg navbar-light bg-dark">
      <div class="container-fluid">
        <div>
          <router-link to="/HomeView" style="color: #ffffff;">MageSurvivor</router-link>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
            aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ml-auto">
            <li class="nav-item">
              <router-link to="/HomeView" class="nav-link" style="color: #ffffff;">首頁</router-link>
            </li>

            <li class="nav-item">
              <router-link to="/Officialnotificationarea" class="nav-link" style="color: #ffffff;">官方公告</router-link>
            </li>

            <li class="nav-item">
              <router-link to="/Playertalkarea" class="nav-link" style="color: #ffffff;">討論區</router-link>
            </li>

            <li class="nav-item">
              <a href="https://firebasestorage.googleapis.com/v0/b/game-ab172.appspot.com/o/MageSurvivor-1220.rar?alt=media&token=a466dfa0-1c9a-4522-b807-13dd8814e1b3"
                target="_blank" class="nav-link" style="color: #ffffff;">下載遊戲</a>
            </li>

            <li class="nav-item">
              <a href="#" class="nav-link" @click="showAccountOptions = !showAccountOptions"
                style="color: #ffffff; position: relative;">帳號選項</a>
              <ul v-if="showAccountOptions" class="account-options">
                <li>
                  <input type="file" id="fileInput" ref="fileInput" style="display: none" @change="uploadImage" />
                  <label for="fileInput" style="color: #000000; font-size: 18px; font-weight: bold;">
                    更換頭像
                  </label>
                </li>
                <li>
                  <router-link to="/ChangePassword" class="nav-link" style="color: #000000;">更換密碼</router-link>
                </li>
                <li>
                  <router-link to="/EmailVerification" class="nav-link" style="color: #000000;">綁定電子郵件</router-link>
                </li>
                <li>
                  <router-link :to="{ name: 'LoginView' }" class="custom-link evenly-spaced-text"
                    @click="Logout">登出</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container">
      <div class="p-3 wrapper" style="margin-bottom: -1px;">
        <div class="row justify-content-center">
          <div class="col-8" style="text-align: center">
            <strong class="font" style="font-size: 36px;">官方公告</strong>
          </div>
          <div class="col-10">
            <div style="text-align: right">
              <button v-if="UserManager" class="font" @click="toggleForm"
                style="margin-bottom: 20px; padding: 15px; font-size: 24px;">發表文章</button>
            </div>
            <Transition>
              <div v-if="showForm" class="form-container">
                <form @submit.prevent="submitPost">
                  <div class="button-content">
                    <div class="button-content-right">
                      <button type="button" @click="toggleForm()"><i class="fas fa-times"></i></button>
                    </div>
                  </div>
                  <div>
                    <input class="font" style="text-align: center" v-model="newPost.title" type="text" placeholder="帖子標題"
                      required>
                  </div>
                  <div>
                    <textarea class="font" style="text-align: center" v-model="newPost.subject" placeholder="帖子主旨"
                      required></textarea>
                  </div>
                  <div>
                    <textarea class="font" style="text-align: center" v-model="newPost.content" placeholder="帖子內容"
                      required></textarea>
                  </div>
                  <div style="text-align: right">
                    <button class="font" type="submit">提交</button>
                  </div>
                </form>
              </div>
            </Transition>
            <div v-if="showForm" class="overlay" @click="toggleForm"></div>
          </div>
          <div class="col-10 bg-white text-dark" style="text-align: center;">
            <ul class="custom-list">
              <li v-for="(item, index) in dataindex" :key="index">
                <div v-if="item.forumavailable || UserManager" class="post-container" style="border-radius:50px;">
                  <div class="button-content">
                    <div class="button-content-right" style="margin-right: 15px;">
                      <div id="menu">
                        <ul>
                          <li> <a @click="toggleMenu(index)">MENU</a>
                            <ul v-if="menuStates[index]">
                              <li><button type="button"
                                  style="margin-bottom:2.5px; margin-top:2.5px; width: 60px; height: 25px;"
                                  :class="{ deleted: UserManager }" @click="toggleReport()"><i
                                    class="fas fa-exclamation-triangle"></i> 舉報</button>
                                <Transition>
                                  <div v-if="reportForm" class="form-container">
                                    <form @submit.prevent="submitReport(index)">
                                      <div class="button-content">
                                        <div class="button-content-right">
                                          <button type="button" @click="toggleReport(index)"><i
                                              class="fas fa-times"></i></button>
                                        </div>
                                      </div>
                                      <div class="remember font" style="text-align: left">
                                        <label class="remember-label font" style="font-size: 18px;">
                                          <input type="radio" v-model="reportPost.selectedContent" value="色情內容"
                                            class="remember-radio font">
                                          <span class="radio-custom font"></span>
                                          色情內容
                                        </label>
                                      </div>
                                      <div class="remember font" style="text-align: left">
                                        <label class="remember-label font" style="font-size: 18px;">
                                          <input type="radio" v-model="reportPost.selectedContent" value="暴力或反感內容"
                                            class="remember-radio font">
                                          <span class="radio-custom font"></span>
                                          暴力或反感內容
                                        </label>
                                      </div>
                                      <div class="remember font" style="text-align: left">
                                        <label class="remember-label font" style="font-size: 18px;">
                                          <input type="radio" v-model="reportPost.selectedContent" value="仇恨或惡意內容"
                                            class="remember-radio font">
                                          <span class="radio-custom font"></span>
                                          仇恨或惡意內容
                                        </label>
                                      </div>
                                      <div class="remember font" style="text-align: left">
                                        <label class="remember-label font" style="font-size: 18px;">
                                          <input type="radio" v-model="reportPost.selectedContent" value="騷擾跟霸凌內容"
                                            class="remember-radio font">
                                          <span class="radio-custom font"></span>
                                          騷擾跟霸凌內容
                                        </label>
                                      </div>
                                      <div class="remember font" style="text-align: left">
                                        <label class="remember-label font" style="font-size: 18px;">
                                          <input type="radio" v-model="reportPost.selectedContent" value="錯誤資訊"
                                            class="remember-radio font">
                                          <span class="radio-custom font"></span>
                                          錯誤資訊
                                        </label>
                                      </div>
                                      <div class="remember font" style="text-align: left">
                                        <label class="remember-label font" style="font-size: 18px;">
                                          <input type="radio" v-model="reportPost.selectedContent" value="宣傳恐怖主義"
                                            class="remember-radio font">
                                          <span class="radio-custom font"></span>
                                          宣傳恐怖主義
                                        </label>
                                      </div>
                                      <div class="remember font" style="text-align: left">
                                        <label class="remember-label font" style="font-size: 18px;">
                                          <input type="radio" v-model="reportPost.selectedContent" value="垃圾內容或誤導內容"
                                            class="remember-radio font">
                                          <span class="radio-custom font"></span>
                                          垃圾內容或誤導內容
                                        </label>
                                      </div>
                                      <div class="remember font" style="text-align: left">
                                        <label class="remember-label font" style="font-size: 18px;">
                                          <input type="radio" v-model="reportPost.selectedContent" value="法律問題"
                                            class="remember-radio font">
                                          <span class="radio-custom font"></span>
                                          法律問題
                                        </label>
                                      </div>
                                      <div style="text-align: right;">
                                        <button class="font" type="submit" style="width: 60px; height: 25px;">提交</button>
                                      </div>
                                    </form>
                                  </div>
                                </Transition>
                                <div v-if="reportForm" class="overlay" @click="toggleReport(index)"></div>
                              </li>
                              <li><button type="button"
                                  style="margin-bottom:2.5px; margin-top:2.5px; width: 60px; height: 25px;"
                                  :class="{ deleted: !UserManager }" @click="toggleEdit(index)"><i
                                    class="far fa-edit"></i>
                                  編輯</button>
                                <Transition>
                                  <div v-if="editForm" class="form-container">
                                    <form @submit.prevent="submitEdit(index)">
                                      <div class="button-content">
                                        <div class="button-content-right">
                                          <button type="button" @click="toggleEdit(index)"><i
                                              class="fas fa-times"></i></button>
                                        </div>
                                      </div>
                                      <div>
                                        <input class="font" style="text-align: center" v-model="editPost.title"
                                          type="text" placeholder="帖子標題" required>
                                      </div>
                                      <div>
                                        <textarea class="font" style="text-align: center" v-model="editPost.subject"
                                          placeholder="帖子主旨" required></textarea>
                                      </div>
                                      <div>
                                        <textarea class="font" style="text-align: center" v-model="editPost.content"
                                          placeholder="帖子內容" required></textarea>
                                      </div>
                                      <div style="text-align: right">
                                        <button class="font" type="submit">提交</button>
                                      </div>
                                    </form>
                                  </div>
                                </Transition>
                                <div v-if="editForm" class="overlay" @click="toggleEdit(index)"></div>
                              </li>
                              <li><button type="button"
                                  style="margin-bottom:2.5px; margin-top:2.5px; width: 60px; height: 25px;"
                                  :class="{ deleted: !UserManager || !item.forumavailable }" @click="toggleBan(index)"><i
                                    class="fas fa-lock"></i> 封鎖</button>
                              </li>
                              <li><button type="button"
                                  style="margin-bottom:2.5px; margin-top:2.5px; width: 60px; height: 25px;"
                                  :class="{ deleted: !UserManager || item.forumavailable }" @click="toggleunBan(index)"><i
                                    class="fas fa-lock-open"></i> 解封</button>
                              </li>
                              <li><button type="button"
                                  style="margin-bottom:2.5px; margin-top:2.5px; width: 60px; height: 25px;"
                                  :class="{ deleted: !UserManager }" @click="toggleDelete(index)"><i
                                    class="far fa-trash-alt"></i> 刪除</button>
                              </li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <p style="font-size:40px;">{{ item.title }}</p>
                  <div class="container">
                    <div class="row">
                      <div class="col-3 bg-white text-dark" style="text-align: center;">
                        <a style="font-size: 40px;">
                          <p><img class="resizable-image"
                              src="https://firebasestorage.googleapis.com/v0/b/game-ab172.appspot.com/o/93cec08278a893ac%20(1).png?alt=media&token=41d96a9c-fed8-414c-95f0-abf7d47b4d3c">
                          </p>
                        </a>
                      </div>
                      <div class="col-9 bg-white text-dark" style="text-align: center;">
                        <a style="font-size: 32px;">
                          <p>{{ item.subject }}</p>
                        </a>
                        <a style="font-size: 16px;">
                          <p>內容：{{ item.content }}</p>
                        </a>
                      </div>
                    </div>
                  </div>
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
                                  <button type="button" @click="toggleMessage()"><i class="fas fa-times"></i></button>
                                </div>
                              </div>
                              <div>
                                <textarea v-model="newMessage.content" placeholder="回復內容" required></textarea>
                              </div>
                              <div class="button-content">
                                <div class="button-content-right">
                                  <button class="font" type="submit" style="margin-bottom: 10px">提交回復</button>
                                </div>
                              </div>
                              <ul class="custom-list">
                                <li v-for="(messageItem, messageIndex) in item.message" :key="messageIndex">
                                  <template v-if="messageIndex !== 'total'">
                                    <div class="button-content"
                                      style="margin-bottom:0px; font-size:15px; text-align: left;">
                                      <div>
                                        <img class="resizable-image-message" :src="messageimagelist[messageIndex]" />
                                        留言人：{{ Object.values(messageItem.messagename)[0] }}
                                      </div>
                                      <div class="button-content-right">
                                        <div id="messagemenu">
                                          <ul>
                                            <li> <a @click="mtoggleMenu(messageIndex)"><i class="fas fa-list-ul"></i></a>
                                              <ul v-if="mmenuStates[messageIndex]">
                                                <li><button type="button"
                                                    style="margin-bottom:2.5px; margin-top:2.5px; width: 50px; height: 25px;"
                                                    :class="{ mdeleted: !mdeletePosts[messageIndex] }"
                                                    @click="mtoggleReport()"><i
                                                      class="fas fa-exclamation-triangle"></i></button>
                                                  <Transition>
                                                    <div v-if="mreportForm" class="form-container">
                                                      <form @submit.prevent="msubmitReport(index, messageIndex)">
                                                        <div class="button-content">
                                                          <div class="button-content-right">
                                                            <button type="button" @click="mtoggleReport()"><i
                                                                class="fas fa-times"></i></button>
                                                          </div>
                                                        </div>
                                                        <div class="remember" style="text-align: left">
                                                          <label class="remember-label" style="font-size: 18px;">
                                                            <input type="radio" v-model="mreportPost.selectedContent"
                                                              value="色情內容" class="remember-radio font">
                                                            <span class="radio-custom"></span>
                                                            色情內容
                                                          </label>
                                                        </div>
                                                        <div class="remember" style="text-align: left">
                                                          <label class="remember-label" style="font-size: 18px;">
                                                            <input type="radio" v-model="mreportPost.selectedContent"
                                                              value="暴力或反感內容" class="remember-radio">
                                                            <span class="radio-custom font"></span>
                                                            暴力或反感內容
                                                          </label>
                                                        </div>
                                                        <div class="remember" style="text-align: left">
                                                          <label class="remember-label" style="font-size: 18px;">
                                                            <input type="radio" v-model="mreportPost.selectedContent"
                                                              value="仇恨或惡意內容" class="remember-radio">
                                                            <span class="radio-custom font"></span>
                                                            仇恨或惡意內容
                                                          </label>
                                                        </div>
                                                        <div class="remember" style="text-align: left">
                                                          <label class="remember-label" style="font-size: 18px;">
                                                            <input type="radio" v-model="mreportPost.selectedContent"
                                                              value="騷擾跟霸凌內容" class="remember-radio">
                                                            <span class="radio-custom font"></span>
                                                            騷擾跟霸凌內容
                                                          </label>
                                                        </div>
                                                        <div class="remember" style="text-align: left">
                                                          <label class="remember-label" style="font-size: 18px;">
                                                            <input type="radio" v-model="mreportPost.selectedContent"
                                                              value="錯誤資訊" class="remember-radio">
                                                            <span class="radio-custom font"></span>
                                                            錯誤資訊
                                                          </label>
                                                        </div>
                                                        <div class="remember" style="text-align: left">
                                                          <label class="remember-label" style="font-size: 18px;">
                                                            <input type="radio" v-model="mreportPost.selectedContent"
                                                              value="宣傳恐怖主義" class="remember-radio">
                                                            <span class="radio-custom font"></span>
                                                            宣傳恐怖主義
                                                          </label>
                                                        </div>
                                                        <div class="remember" style="text-align: left">
                                                          <label class="remember-label" style="font-size: 18px;">
                                                            <input type="radio" v-model="mreportPost.selectedContent"
                                                              value="垃圾內容或誤導內容" class="remember-radio">
                                                            <span class="radio-custom font"></span>
                                                            垃圾內容或誤導內容
                                                          </label>
                                                        </div>
                                                        <div class="remember" style="text-align: left">
                                                          <label class="remember-label" style="font-size: 18px;">
                                                            <input type="radio" v-model="mreportPost.selectedContent"
                                                              value="法律問題" class="remember-radio">
                                                            <span class="radio-custom font"></span>
                                                            法律問題
                                                          </label>
                                                        </div>
                                                        <div style="text-align: right;">
                                                          <button class="font" type="submit"
                                                            style="width: 60px; height: 25px;">提交</button>
                                                        </div>
                                                      </form>
                                                    </div>
                                                  </Transition>
                                                  <div v-if="mreportForm" class="messageoverlay"
                                                    @click="closeWindows(messageIndex)">
                                                  </div>
                                                </li>
                                                <li><button type="button"
                                                    style="margin-bottom:2.5px; margin-top:2.5px; width: 50px; height: 25px;"
                                                    :class="{ mdeleted: mdeletePosts[messageIndex] }"
                                                    @click="mtoggleEdit(index, messageIndex)"><i
                                                      class="far fa-edit"></i></button>
                                                </li>
                                                <li><button type="button"
                                                    style="margin-bottom:2.5px; margin-top:2.5px; width: 50px; height: 25px;"
                                                    :class="{ mdeleted: mdeletePosts[messageIndex] }"
                                                    @click="mtoggleDelete(index, messageIndex)"><i
                                                      class="far fa-trash-alt"></i></button>
                                                </li>
                                              </ul>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div v-if="editingMessageIndex === messageIndex">
                                      <p class="font" style="margin-bottom:0px"><textarea v-model="editedMessageContent"
                                          placeholder="回復內容" required></textarea>
                                      </p>
                                      <div style="margin-bottom:10px;" class="button-content">
                                        <div class="button-content-right font">
                                          <button class="font" @click="cancelEditedMessage(messageIndex)">取消</button>
                                          <button class="font" @click="saveEditedMessage(index, messageIndex)">保存</button>
                                        </div>
                                      </div>
                                    </div>
                                    <div v-else>
                                      <p style="margin-bottom:0px; font-size:15px; text-align: left;">
                                        {{ messageItem.messagecontent }}
                                      </p>
                                      <div style="margin-bottom:30px;" class="button-content font">
                                        <button type="button" style="text-align: left;"
                                          :class="{ mliked: mlikedPosts[messageIndex] }"
                                          @click="mtoggleLike(index, messageIndex)"><i
                                            class="fas fa-thumbs-up"></i></button>
                                        <a class="like-count font">{{ messageItem.messageupvote.total }}</a>
                                        <button type="button" style="text-align: left;"
                                          :class="{ munliked: munlikedPosts[messageIndex] }"
                                          @click="mtoggleUnLike(index, messageIndex)"><i
                                            class="fas fa-thumbs-down"></i></button>
                                        <a style="text-align: right;">時間：{{ messageItem.messagetime }}</a>
                                      </div>
                                    </div>
                                  </template>
                                </li>
                              </ul>
                            </form>
                          </div>
                        </div>
                      </Transition>
                      <a class="like-count font">{{ item.upvotepeople.total }}</a>
                      <button type="button" :class="{ liked: likedPosts[index] }" @click="toggleLike(index)"><i
                          class="far fa-thumbs-up"></i></button>
                      <button class="font" style="margin-right: 15px;" type="button"
                        :class="{ unliked: unlikedPosts[index] }" @click="toggleUnLike(index)"><i
                          class="far fa-thumbs-down"></i></button>
                    </div>
                  </div>
                </div>
                <div v-if="item.forumavailable || UserManager" style="text-align: right;">
                  <span class="font" style="font-size: 20px; margin-right:20px;">創建時間：{{ item.createtime }}</span>
                  <span class="font" style="font-size: 20px;">創建人：官方</span>
                </div>
                <p style="margin-bottom:20px"></p>
              </li>
            </ul>
            <div v-if="showMessage" class="overlay" @click="closeWindows"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.font {
  font-family: 微軟正黑體;
}

.resizable-image {
  max-width: 100%;
  height: auto;
  margin: 0 auto;
}

.resizable-image-message {
  max-width: 10%;
  height: auto;
  margin: 0 auto;
}

#menu {
  width: 150px;
  height: 100px;
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
  position: relative;
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

#messagemenu {
  width: 50px;
  height: 30px;
}

#messagemenu ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
  overflow: auto;
}

* html #messagemenu ul {
  height: 30px;
}

* html #messagemenu ul li {
  display: inline;
}

#messagemenu ul li a {
  display: block;
  float: left;
  height: 30px;
  width: 50px;
  text-align: center;
}

#messagemenu ul li ul {
  position: relative;
  width: 50px;
  overflow: visible;
  clear: left;
  margin-top: 30px;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;
}

*:first-child+html #messagemenu ul li ul {
  margin-top: 0;
}

* html #messagemenu ul li ul {
  margin-top: 0;
}

#messagemenu ul li ul li {
  float: none;
  text-align: center;
}

#messagemenu ul li ul li a {
  float: none;
  width: 100%;
}

#messagemenu ul li ul li ul {
  margin-top: -30px;
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 100px;
  width: 100%;
}

*:first-child+html #messagemenu ul li ul li ul {
  margin-top: -30px;
}

#messagemenu {
  font-size: 12px;
  font-family: Arial, Helvetica, sans-serif;
}

#messagemenu ul {
  background: #6f6f6f;
}

#messagemenu ul li a {
  color: #FFF;
  text-decoration: none;
  line-height: 30px;
}

#messagemenu ul li ul {
  background: #efefef;
}

#messagemenu ul li ul li a {
  font-size: 12px;
  color: #333333;
  text-decoration: none;
}

#messagemenu ul li:hover,
#messagemenu ul li a:hover {
  background: #efefef;
}

#messagemenu ul li:hover a {
  color: #333333;
}

#messagemenu ul li ul li:hover,
#messagemenu ul li ul li a:hover {
  background: #dfdfdf;
}

.button-content {
  display: flex;
  align-items: center;
}

.button-content-right {
  margin-left: auto;
}

.remember {
  display: flex;
  align-items: center;
  /* 垂直居中复选框和文本 */
}

.remember-label {
  display: flex;
  align-items: center;
  /* 垂直居中复选框和文本 */
  cursor: pointer;
}

.remember-radio {
  /* 隐藏默认的复选框 */
  display: none;
}

.radio-custom {
  display: inline-block;
  width: 20px;
  /* 设置复选框的宽度 */
  height: 20px;
  /* 设置复选框的高度 */
  border: 2px solid #e50808;
  border-radius: 50%;
  /* 圆形边框 */
  margin-right: 10px;
  /* 为复选框和文本之间留出间距 */
}

/* 当复选框被选中时，修改样式 */
.remember-radio:checked+.radio-custom {
  background-color: #007bff;
  /* 选中时的背景颜色 */
  border-color: #007bff;
  /* 选中时的边框颜色 */
}

.remember-label:hover .radio-custom {
  border-color: #999;
  /* 鼠标悬停时的边框颜色 */
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

button.mliked {
  background-color: blue;
  color: black;
}

button.munliked {
  background-color: red;
  color: black;
}

button.deleted {
  display: none;
}

button.mdeleted {
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

.messageoverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.form-scroll {
  max-height: 650px;
  overflow-y: auto;
}

.menu-list {
  display: flex;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-list li {
  margin-right: 15px;
}

.account-options {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #888;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
  list-style-type: none;
  padding: 10px;
  margin: 0;
  margin-top: 0;
  width: max-content;
  line-height: 30px;
  font-size: 14px;
}

.account-options li a {
  color: #000;
  font-size: 18px;
  line-height: 25px;
}

.account-options li:hover {
  background-color: #ddd;
}

.account-options li:active {
  background-color: #aaa;
}
</style>
<script>
import { getDatabase, ref as firebaseRef, onValue, set, get, remove } from 'firebase/database';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from "@/main";

export default {
  beforeRouteEnter(to, from, next) {
    document.title = '官方通知區';
    next();
  },
  data() {
    return {
      likedPosts: {},
      unlikedPosts: {},
      deletePosts: {},
      mlikedPosts: {},
      munlikedPosts: {},
      mdeletePosts: {},
      messageimagelist: {},
      dataindex: [],
      mdataindex: [],
      postData: [],
      menuStates: [],
      mmenuStates: [],
      data: {},
      message: {},
      newPost: {
        title: '',
        subject: '',
        content: ''
      },
      editPost: {
        title: '',
        subject: '',
        content: ''
      },
      reportPost: {
        selectedContent: ''
      },
      mreportPost: {
        selectedContent: ''
      },
      newMessage: {
        content: ''
      },
      userId: null,
      username: '',
      messageimage: '',
      showForm: false,
      editForm: false,
      editingMessageIndex: -1,
      editedMessageContent: '',
      reportForm: false,
      mreportForm: false,
      showMessage: false,
      openFormIndex: null,
      UserManager: false,
      showAccountOptions: false,
    };
  },
  mounted() {
    // Access the Firebase Realtime Database
    const db = getDatabase(firebaseApp);
    const dataRef = firebaseRef(db, 'Official/');
    const storedUserData = localStorage.getItem("rememberedUser");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      this.userId = userData.name;
    }
    get(firebaseRef(db, `Users/${this.userId}/Manager`)).then((snapshot) => {
      this.UserManager = snapshot.val();
      if (this.UserManager === null) {
        this.UserManager = false;
      } else if (this.UserManager === true) {
        this.UserManager = true;
      }
    })
    get(firebaseRef(db, `Users/${this.userId}/name`)).then((snapshot) => {
      this.username = snapshot.val();

      // Listen for changes in the 'data' node
      onValue(dataRef, async (snapshot) => {
        const data = snapshot.val();
        this.dataindex = Object.values(data); // Convert object to array
        this.dataLength = this.dataindex.length; // Store the length
        this.data = data;

        for (let i = 0; i < this.dataLength; i++) {
          const post = this.dataindex[i];
          const postId = Object.keys(this.data)[i];
          const MessageeRef = firebaseRef(db, `Official/${postId}/message`);
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
                continue;
              }

              const mlikePeopleCount = (Object.keys(mpost.messageupvote || {}).length) - 1;
              const munlikePeopleCount = (Object.keys(mpost.messagedownvote || {}).length) - 1;
              const mreportPeopleCount = (Object.keys(mpost.messagereport || {}).length) - 1;

              const officialRef1 = firebaseRef(db, `Official/${postId}/message/${mpostId}/messageupvote`);
              const officialRef2 = firebaseRef(db, `Official/${postId}/message/${mpostId}/messageupvote/total`);
              const officialRef3 = firebaseRef(db, `Official/${postId}/message/${mpostId}/messagedownvote`);
              const officialRef4 = firebaseRef(db, `Official/${postId}/message/${mpostId}/messagedownvote/total`);
              const officialRef5 = firebaseRef(db, `Official/${postId}/message/${mpostId}/messagename`);
              const officialRef6 = firebaseRef(db, `Official/${postId}/message/${mpostId}/messagereport/total`);

              get(officialRef1).then((snapshot) => {
                const messageupvote = snapshot.val();
                const userNames = Object.values(messageupvote);
                if (messageupvote && this.username === userNames[0]) {
                  this.mlikedPosts[mpostId] = true;
                } else {
                  this.mlikedPosts[mpostId] = false;
                }
              });
              get(officialRef3).then((snapshot) => {
                const messageunlike = snapshot.val();
                const userNames = Object.values(messageunlike);
                if (messageunlike && this.username === userNames[0]) {
                  this.munlikedPosts[mpostId] = true;
                } else {
                  this.munlikedPosts[mpostId] = false;
                }
              });
              get(officialRef5).then((snapshot) => {
                this.messageimage = Object.keys(snapshot.val());
                get(firebaseRef(db, `Users/${this.messageimage}/UserImage`)).then((snapshot) => {
                  this.messageimage = snapshot.val();
                  this.messageimagelist[mpostId] = this.messageimage;
                });
                const messagedeleted = snapshot.val();
                const userNames = Object.values(messagedeleted);
                if (messagedeleted && this.username === userNames[0]) {
                  this.mdeletePosts[mpostId] = false;
                } else {
                  this.mdeletePosts[mpostId] = true;
                }
              });

              set(officialRef2, mlikePeopleCount);
              set(officialRef4, munlikePeopleCount);
              set(officialRef6, mreportPeopleCount);
            }
          }

          const likePeopleCount = (Object.keys(post.upvotepeople || {}).length) - 1;
          const unlikePeopleCount = (Object.keys(post.downvotepeople || {}).length) - 1;
          const messageCount = (Object.keys(post.message || {}).length) - 1;
          const reportCount = (Object.keys(post.reportpeople || {}).length) - 1;

          const officialRef1 = firebaseRef(db, `Official/${postId}/upvotepeople`);
          const officialRef2 = firebaseRef(db, `Official/${postId}/upvotepeople/total`);
          const officialRef3 = firebaseRef(db, `Official/${postId}/downvotepeople`);
          const officialRef4 = firebaseRef(db, `Official/${postId}/downvotepeople/total`);
          const officialRef5 = firebaseRef(db, `Official/${postId}/createname`);
          const officialRef6 = firebaseRef(db, `Official/${postId}/message/total`);
          const officialRef7 = firebaseRef(db, `Official/${postId}/reportpeople/total`);

          get(officialRef1).then((snapshot) => {
            const upvotePeople = snapshot.val();
            const userNames = Object.values(upvotePeople);
            if (upvotePeople && this.username === userNames[0]) {
              this.likedPosts[i] = true;
            } else {
              this.likedPosts[i] = false;
            }
          });

          get(officialRef3).then((snapshot) => {
            const unlikePeople = snapshot.val();
            const userNames = Object.values(unlikePeople);
            if (unlikePeople && this.username === userNames[0]) {
              this.unlikedPosts[i] = true;
            } else {
              this.unlikedPosts[i] = false;
            }
          });

          get(officialRef5).then((snapshot) => {
            const deleted = snapshot.val();
            const userNames = Object.values(deleted);
            if (deleted && this.username === userNames[0]) {
              this.deletePosts[i] = false;
            } else {
              this.deletePosts[i] = true;
            }
          });

          set(officialRef2, likePeopleCount);
          set(officialRef4, unlikePeopleCount);
          set(officialRef6, messageCount);
          set(officialRef7, reportCount);
        }
      });
    });
  },
  methods: {
    closeWindows() {
      const messageIndex = this.currentMessageIndex;
      if (this.mreportForm) {
        this.mreportForm = false;
        this.showMessage = true;
        setTimeout(() => {
          this.mmenuStates[messageIndex] = false;
        }, 500);
      } else if (this.showMessage) {
        this.showMessage = false;
      }
    },
    toggleLike(index) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Official/${postId}/upvotepeople/${this.userId}`);
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
      const officialRef1 = firebaseRef(db, `Official/${postId}/downvotepeople/${this.userId}`);
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
    toggleMenu(index) {
      this.menuStates[index] = !this.menuStates[index];
    },
    toggleReport(index) {
      this.reportPost.selectedContent = '';
      this.reportForm = !this.reportForm;
      setTimeout(() => {
        this.menuStates[index] = !this.menuStates[index];
      }, 500);
    },
    submitReport(index) {
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

      const currentDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

      const officialRef1 = firebaseRef(db, `Official/${postId}/reportpeople/${this.userId}/createtime`);
      const officialRef2 = firebaseRef(db, `Official/${postId}/reportpeople/${this.userId}/resaon`);

      set(officialRef1, currentDateTime);
      set(officialRef2, this.reportPost.selectedContent);

      this.reportForm = !this.reportForm;
    },
    toggleEdit(index) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);

      const officialRef1 = firebaseRef(db, `Official/${postId}/title`);
      const officialRef2 = firebaseRef(db, `Official/${postId}/subject`);
      const officialRef3 = firebaseRef(db, `Official/${postId}/content`);

      get(officialRef1).then((snapshot) => {
        if (snapshot.exists()) {
          this.editPost.title = snapshot.val();
        } else {
          this.editPost.title = '';
        }
      });
      get(officialRef2).then((snapshot) => {
        if (snapshot.exists()) {
          this.editPost.subject = snapshot.val();
        } else {
          this.editPost.subject = '';
        }
      });
      get(officialRef3).then((snapshot) => {
        if (snapshot.exists()) {
          this.editPost.content = snapshot.val();
        } else {
          this.editPost.content = '';
        }
      });

      this.editForm = !this.editForm;
      if (!this.editForm) {
        setTimeout(() => {
          this.menuStates[index] = !this.menuStates[index];
        }, 500);
      }
    },
    submitEdit(index) {
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

      const currentDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
      const officialRef1 = firebaseRef(db, `Official/${postId}/title`);
      const officialRef2 = firebaseRef(db, `Official/${postId}/subject`);
      const officialRef3 = firebaseRef(db, `Official/${postId}/content`);
      const officialRef4 = firebaseRef(db, `Official/${postId}/createtime`);

      set(officialRef1, this.editPost.title);
      set(officialRef2, this.editPost.subject);
      set(officialRef3, this.editPost.content);
      set(officialRef4, currentDateTime);

      this.editForm = !this.editForm;
    },
    toggleBan(index) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Official/${postId}/forumavailable`);
      set(officialRef1, false);
    },
    toggleunBan(index) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Official/${postId}/forumavailable`);
      set(officialRef1, true);
    },
    toggleDelete(index) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Official/${postId}`);
      const officialRef2 = firebaseRef(db, `Official/${postId}/upvotepeople`);
      const officialRef3 = firebaseRef(db, `Official/${postId}/downvotepeople`);
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
    mtoggleLike(index, messageIndex) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Official/${postId}/message/${messageIndex}/messageupvote/${this.userId}`);
      if (this.mlikedPosts[messageIndex]) {
        this.mlikedPosts[messageIndex] = false;
        remove(officialRef1);
      } else {
        this.mlikedPosts[messageIndex] = true;
        set(officialRef1, this.username);
        if (this.munlikedPosts[messageIndex]) {
          this.mtoggleUnLike(index, messageIndex);
        }
      }
    },
    mtoggleUnLike(index, messageIndex) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Official/${postId}/message/${messageIndex}/messagedownvote/${this.userId}`);
      if (this.munlikedPosts[messageIndex]) {
        this.munlikedPosts[messageIndex] = false;
        remove(officialRef1);
      } else {
        this.munlikedPosts[messageIndex] = true;
        set(officialRef1, this.username);
        if (this.mlikedPosts[messageIndex]) {
          this.mtoggleLike(index, messageIndex);
        }
      }
    },
    mtoggleMenu(messageIndex) {
      this.currentMessageIndex = messageIndex;
      this.mmenuStates[messageIndex] = !this.mmenuStates[messageIndex];
    },
    mtoggleReport() {
      this.mreportPost.selectedContent = '';
      this.mreportForm = !this.mreportForm;
      const messageIndex = this.currentMessageIndex;
      if (!this.mreportForm) {
        setTimeout(() => {
          this.mmenuStates[messageIndex] = false;
        }, 500);
      }
    },
    msubmitReport(index, messageIndex) {
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

      const currentDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

      const officialRef1 = firebaseRef(db, `Official/${postId}/message/${messageIndex}/messagereport/${this.userId}/createtime`);
      const officialRef2 = firebaseRef(db, `Official/${postId}/message/${messageIndex}/messagereport/${this.userId}/resaon`);

      set(officialRef1, currentDateTime);
      set(officialRef2, this.mreportPost.selectedContent);

      this.mreportForm = !this.mreportForm;
    },
    mtoggleEdit(index, messageIndex) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);

      const officialRef1 = firebaseRef(db, `Official/${postId}/message/${messageIndex}/messagecontent`);

      get(officialRef1).then((snapshot) => {
        if (snapshot.exists()) {
          this.editedMessageContent = snapshot.val();
        } else {
          this.editedMessageContent = '';
        }
      });

      this.editingMessageIndex = messageIndex;
      this.mmenuStates[messageIndex] = false;
    },
    cancelEditedMessage(messageIndex) {
      this.editingMessageIndex = -1;
    },
    saveEditedMessage(index, messageIndex) {
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

      const currentDateTime = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

      const officialRef1 = firebaseRef(db, `Official/${postId}/message/${messageIndex}/messagecontent`);
      const officialRef2 = firebaseRef(db, `Official/${postId}/message/${messageIndex}/messagetime`);

      set(officialRef1, this.editedMessageContent);
      set(officialRef2, currentDateTime);

      this.editingMessageIndex = -1;
    },
    mtoggleDelete(index, messageIndex) {
      const postKeys = Object.keys(this.data);
      const postId = postKeys[index];
      const db = getDatabase(firebaseApp);
      const officialRef1 = firebaseRef(db, `Official/${postId}/message/${messageIndex}`);
      const officialRef2 = firebaseRef(db, `Official/${postId}/message/${messageIndex}/messageupvote`);
      const officialRef3 = firebaseRef(db, `Official/${postId}/message/${messageIndex}/messagedownvote`);
      remove(officialRef1);
      remove(officialRef2);
      remove(officialRef3);
    },
    toggleMessage(index) {
      this.openFormIndex = index;
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

      const secondsPadded = String(seconds).padStart(2, '0');
      const minutesPadded = String(minutes).padStart(2, '0');
      const hoursPadded = String(hours).padStart(2, '0');
      const datePadded = String(date).padStart(2, '0');
      const monthPadded = String(month).padStart(2, '0');
      const currentDateTimeID = `${year}-${monthPadded}-${datePadded} ${hoursPadded}:${minutesPadded}:${secondsPadded}-${this.userId}`;
      const currentDateTime = `${year}-${monthPadded}-${datePadded} ${hoursPadded}:${minutesPadded}:${secondsPadded}`;

      const officialRef1 = firebaseRef(db, `Official/${postId}/message/${currentDateTimeID}/messagename/${this.userId}`);
      const officialRef2 = firebaseRef(db, `Official/${postId}/message/${currentDateTimeID}/messagecontent`);
      const officialRef3 = firebaseRef(db, `Official/${postId}/message/${currentDateTimeID}/messagetime`);
      const officialRef4 = firebaseRef(db, `Official/${postId}/message/${currentDateTimeID}/messageupvote/total`);
      const officialRef5 = firebaseRef(db, `Official/${postId}/message/${currentDateTimeID}/messagedownvote/total`);
      const officialRef6 = firebaseRef(db, `Official/${postId}/message/${currentDateTimeID}/messagereport/total`);

      set(officialRef1, this.username);
      set(officialRef2, this.newMessage.content);
      set(officialRef3, currentDateTime);
      set(officialRef4, 0);
      set(officialRef5, 0);
      set(officialRef6, 0);

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
      const officialRef1 = firebaseRef(db, `Official/${uniqueCode}/title`);
      const officialRef2 = firebaseRef(db, `Official/${uniqueCode}/subject`);
      const officialRef3 = firebaseRef(db, `Official/${uniqueCode}/content`);
      const officialRef4 = firebaseRef(db, `Official/${uniqueCode}/upvotepeople/total`);
      const officialRef5 = firebaseRef(db, `Official/${uniqueCode}/downvotepeople/total`);
      const officialRef6 = firebaseRef(db, `Official/${uniqueCode}/reportpeople/total`);
      const officialRef7 = firebaseRef(db, `Official/${uniqueCode}/message/total`);
      const officialRef8 = firebaseRef(db, `Official/${uniqueCode}/createtime`);
      const officialRef9 = firebaseRef(db, `Official/${uniqueCode}/createname/${this.userId}`);

      set(officialRef1, this.newPost.title);
      set(officialRef2, this.newPost.subject);
      set(officialRef3, this.newPost.content);
      set(officialRef4, 0);
      set(officialRef5, 0);
      set(officialRef6, 0);
      set(officialRef7, 0);
      set(officialRef8, currentDateTime);
      set(officialRef9, this.username);

      this.showForm = !this.showForm;
    }
  },
  async uploadImage(event) {
    const storedUserData = localStorage.getItem("rememberedUser");
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      this.name = userData.name;
    }
    console.error(this.name);
    const file = event.target.files[0];
    if (file) {
      try {
        const db = getDatabase(firebaseApp);
        const officialRef1 = firebaseRef(db, `Users/${this.name}/UserImage`);
        const storage = getStorage();
        const imageRef = storageRef(storage, `${this.name}/${file.name}`);
        await uploadBytes(imageRef, file);
        const downloadURL = await getDownloadURL(imageRef);
        this.imageUrl = downloadURL;
        console.log(this.imageUrl);
        await set(officialRef1, this.imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  },
  Logout() {
    localStorage.removeItem("rememberedUser");
  }
}
</script>