import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isLoggedIn: false,
        token: '',
        username: ''  // 新增用户名字段
    }),
    actions: {
        setLogin(token: string, username: string) {  // 修改参数，增加用户名
            this.isLoggedIn = true;
            this.token = token;
            this.username = username;  // 保存用户名
            localStorage.setItem('token', token);
            localStorage.setItem('username', username);  // 在localStorage中也保存用户名
        },
        logout() {
            this.isLoggedIn = false;
            this.token = '';
            this.username = '';  // 清除用户名
            localStorage.removeItem('token');
            localStorage.removeItem('username');  // 清除localStorage中的用户名
        },
        initializeAuth() {
            const token = localStorage.getItem('token');
            const username = localStorage.getItem('username');  // 获取保存的用户名
            if (token) {
                this.isLoggedIn = true;
                this.token = token;
                this.username = username || '';  // 恢复用户名
            }
        }
    }
});