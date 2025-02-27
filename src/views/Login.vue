<template>
  <div class="login-container">
    <a-card class="login-card" shadow>
      <template #title>
        <h2>登录</h2>
      </template>
      <a-form :model="loginForm">
        <a-form-item label="用户名">
          <a-input v-model="loginForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="密码">
          <a-input-password v-model="loginForm.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item label="验证码">
          <div class="captcha-container">
            <a-input v-model="loginForm.captcha" placeholder="请输入验证码" />
            <div class="captcha-image" @click="refreshCaptcha">
              <img v-if="captchaUrl" :src="captchaUrl" alt="验证码" />
              <div v-else class="captcha-loading">加载中...</div>
            </div>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" long :loading="isLoading" @click="handleSubmit">登录</a-button>
        </a-form-item>
        <div class="login-footer">
          <span>没有账号？</span>
          <a @click="handleRegister">立即注册</a>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { login, generateCaptcha } from '@/api/index';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { Message } from '@arco-design/web-vue';

const router = useRouter();
const authStore = useAuthStore();
const captchaUrl = ref('');
const isLoading = ref(false);

// 使用 reactive 定义表单数据
const loginForm = reactive({
  username: '',
  password: '',
  captcha: ''
});

// 刷新验证码
const refreshCaptcha = async () => {
  try {
    captchaUrl.value = await generateCaptcha();
  } catch (error) {
    console.error('获取验证码失败:', error);
    Message.error('获取验证码失败，请刷新页面重试');
  }
};

// 在组件加载时检查用户是否已登录并加载验证码
onMounted(async () => {
  // 确保从localStorage恢复登录状态
  authStore.initializeAuth();
  
  // 如果用户已登录，直接重定向到主页
  if (authStore.isLoggedIn) {
    Message.success('您已经登录，为您跳转到主页');
    router.push('/');
    return;
  }

  // 加载验证码
  await refreshCaptcha();
});

const handleSubmit = async () => {
  // 表单验证
  if (!loginForm.username.trim()) {
    Message.error('请输入用户名');
    return;
  }
  
  if (!loginForm.password.trim()) {
    Message.error('请输入密码');
    return;
  }
  
  if (!loginForm.captcha.trim()) {
    Message.error('请输入验证码');
    return;
  }

  try {
    isLoading.value = true;
    // 调用登录接口
    const response = await login(loginForm.username, loginForm.password, loginForm.captcha);
    
    // 假设后端返回格式 {code: 1, msg: "登录成功", token: "xxx"}
    if (response && response.code === 1) {
      authStore.setLogin(response.token, loginForm.username);
      Message.success('登录成功');
      router.push('/');
    } else {
      Message.error(response.msg || '登录失败');
      // 登录失败刷新验证码
      refreshCaptcha();
    }
  } catch (error: any) {
    console.error('登录失败:', error);
    Message.error(error.response?.data?.msg || '登录失败，请重试');
    // 登录失败刷新验证码
    refreshCaptcha();
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = () => {
  router.push('/register');
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}

.login-card {
  width: 400px;
  padding: 24px;
  border-radius: 8px;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 24px;
}

.login-footer {
  text-align: center;
  margin-top: 16px;
}

.login-footer a {
  margin-left: 4px;
  color: #1890ff;
  cursor: pointer;
}

.captcha-container {
  display: flex;
  align-items: center;
}

.captcha-image {
  margin-left: 12px;
  cursor: pointer;
  height: 32px;
}

.captcha-image img {
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
}

.captcha-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 32px;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  font-size: 12px;
  color: #999;
}
</style>