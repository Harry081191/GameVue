<template>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
  <nav>
    <router-link to="/">遊戲名</router-link>
  </nav>
  <div class="Home">
    <div class="container">
      <div class="p-5 wrapper">
        <div class="row justify-content-center">
          <div class="col-6">
            <div class="jumbotron">
              <form @submit.prevent="handleSubmit">
                <h1>找回密碼</h1>
                <strong>電子信箱</strong>
                <input v-model="User.mail" type="text" class="form-control" id="Mail" name="Mail"
                  placeholder="請輸入帳號" required>
                
                <div style="margin-top: 10px; margin-bottom: 10px;">
                  <button type="button" class="btn btn-outline-danger">
                    發送驗證碼
                  </button>
                </div>
                <input v-model="User.mail" type="text"  id="Mail" name="Mail" size="10" style="margin-top: 75px" required>
                  <div style="margin-top: 10px; margin-bottom: 10px;">
                  <button type="submit" class="btn btn-outline-danger">
                    驗證
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="data">
      <ul>
        <li v-for="(item, key) in data" :key="key">
          {{ key }}: {{ item }}
        </li>
      </ul>
    </div>
    <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
  </div>
</template>
<style>
.remember {
  display: flex;
  justify-content: space-between;
}
</style>
<script>

</script>