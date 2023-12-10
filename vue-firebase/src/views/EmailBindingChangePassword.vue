<template>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    <router-link to="/" style="font-size:50px;">MageSurvivor</router-link>
    <div>
        <p v-if="bindSuccess" style="color: green;">綁定成功</p>
        <p v-if="bindFailure" style="color: red;">Error</p>
    </div>

    <div v-if="ChangePassword">
        <h1>Change Password</h1>
        <div v-if="userExists">
            <label for="newPassword">New Password:</label>
            <input v-model="newPassword" type="password" id="newPassword" required>
            <button @click="changePassword">Change Password</button>
        </div>
        <div v-else>
            <p>No user found with the provided email.</p>
        </div>
        <div v-if="ChangePasswordSuccess">
            <p>Change password success.</p>
        </div>
    </div>
    <p>Email: {{ userEmail }}</p>
    <p>Name: {{ userName }}</p>
</template>

<script>
import { getDatabase, ref, update, get } from 'firebase/database';
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';

export default {
    data() {
        return {
            bindSuccess: false,
            bindFailure: false,
            ChangePassword: false,
            ChangePasswordSuccess: false,
            newPassword: '',
            userExists: false,
        };
    },
    async created() {
        const auth = getAuth();

        const email = localStorage.getItem('userEmail');
        const name = localStorage.getItem('userName');
        const forget = localStorage.getItem('forget');
        this.userEmail = email;
        this.userName = name;

        if (!forget) {
            const db = getDatabase();
            const userRef = ref(db, `Users/${name}`);

            const userSnapshot = await get(userRef);
            const userData = userSnapshot.val();

            if (!userData.email) {
                update(userRef, {
                    email: email,
                });
                this.bindSuccess = true;
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                localStorage.removeItem('forget');
            } else {
                this.bindFailure = true;
            }
        } else if (forget) {
            this.ChangePassword = true;
            const db = getDatabase();
            const userRef = ref(db, `Users/${name}`);

            get(userRef)
                .then((userSnapshot) => {
                    if (userSnapshot.exists()) {
                        this.userExists = true;
                        console.log('使用者存在');
                    } else {
                        console.log('該名字的使用者不存在');
                    }
                })
                .catch((error) => {
                    console.error('獲取使用者時發生錯誤:', error.message);
                });
        } else {
            this.bindFailure = true;
        }
    },
    methods: {
        async changePassword() {
            const name = localStorage.getItem('userName');
            const newPassword = this.newPassword;

            if (newPassword.length >= 6) {
                const db = getDatabase();
                const userRef = ref(db, `Users/${name}`);

                update(userRef, {
                    password: newPassword,
                });
                this.ChangePasswordSuccess = true;
                console.log('Password changed successfully!');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                localStorage.removeItem('forget');
            } else {
                console.error('新密碼必須至少包含六個字元');
                // 可以顯示錯誤消息或執行其他相應的處理
            }
        },
    },
};
</script>

<style></style>
