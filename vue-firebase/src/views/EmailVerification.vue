<template>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
    <nav>
        <router-link to="/" style="font-size:50px;">MageSurvivor</router-link>
    </nav>
    <div class="Home">
        <div class="container">
            <div class="p-5 wrapper">
                <div class="row justify-content-center">
                    <div class="col col-12 col-sm-6">
                        <div class="jumbotron">
                            <form @submit.prevent="handleSubmit">
                                <h1 class="font">綁定電子郵件</h1>
                                <strong class="font">Email</strong>
                                <input v-model="User.email" type="text" class="form-control font" id="Email" name="Email"
                                    placeholder="請輸入電子郵件" required>
                                <strong class="font">帳號</strong>
                                <input v-model="User.name" type="text" class="form-control font" id="Name" name="Name"
                                    placeholder="請輸入帳號" required>
                                <strong class="font">密碼</strong>
                                <input v-model="User.password" type="password" class="form-control font" id="Password"
                                    name="Password" placeholder="請輸入密碼" required>
                                <div style="margin-top: 10px; margin-bottom: 10px;">
                                    <button type="submit" class="btn btn-outline-danger">
                                        驗證
                                    </button>
                                </div>
                                <div v-if="verificationSent" class="alert alert-danger">
                                    請到電子信箱確認郵件
                                </div>
                                <div>
                                    <a class="from-control mr-2 mb-1 mb-sm-0 font">I have the account return to</a>
                                    <router-link to="/" class="from-control mr-2 mb-1 mb-sm-0">Login</router-link>
                                    <br>
                                    <a class="from-control mr-2 mb-1 mb-sm-0">Don't have an account?</a>
                                    <router-link to="/CreateAccount"
                                        class="from-control mr-2 mb-1 mb-sm-0">Register</router-link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</div>
    </div>
</template>
<style>
.font {
    font-family: 微軟正黑體;
}
</style>
<script>
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { getDatabase, ref, get } from 'firebase/database';

export default {
    data() {
        return {
            User: {
                email: '',
                name: '',
                password: ''
            },
            errorMessage: null,
            verificationSent: false,
        };
    },
    methods: {
        async handleSubmit() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.User.email)) {
                this.errorMessage = '請輸入有效的電子郵件地址';
                return;
            }

            try {
                const auth = getAuth();
                const db = getDatabase();

                const name = this.User.name;
                const password = this.User.password;

                const userSnapshot = await get(ref(db, `Users/${name}`));
                const userData = userSnapshot.val();

                if (!userData) {
                    this.errorMessage = '使用者未註冊';
                    return;
                } else if (password !== userData.password) {
                    this.errorMessage = '密碼錯誤';
                    return
                }

                const email = this.User.email;
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);

                await sendEmailVerification(userCredential.user);

                localStorage.setItem('userEmail', email);
                localStorage.setItem('userName', name);

                this.verificationSent = true;

                console.log('Verification email sent successfully!');
            } catch (error) {
                this.errorMessage = error.message;
                console.error('Error:', error);
            }
        },
    },
};
</script>
