<template>
  <div class="register-container">
    <a-card class="register-card" shadow>
      <template #title>
        <h2>注册</h2>
      </template>
      <a-form :model="registerForm">
        <a-form-item 
          label="用户名" 
          :validate-status="usernameStatus" 
          :help="usernameHelp"
        >
          <a-input 
            v-model="registerForm.username" 
            placeholder="请设置用户名" 
            @blur="validateUsername" 
          />
        </a-form-item>
        <a-form-item 
          label="密码" 
          :validate-status="passwordStatus" 
          :help="passwordHelp"
        >
          <a-input-password 
            v-model="registerForm.password" 
            placeholder="请设置密码(至少6位)" 
            @blur="validatePassword" 
          />
        </a-form-item>
        <a-form-item 
          label="确认密码" 
          :validate-status="confirmPasswordStatus" 
          :help="confirmPasswordHelp"
        >
          <a-input-password 
            v-model="registerForm.confirmPassword" 
            placeholder="请确认密码" 
            @blur="validateConfirmPassword" 
          />
        </a-form-item>
        <a-form-item 
          label="邮箱" 
          :validate-status="emailStatus" 
          :help="emailHelp"
        >
          <a-auto-complete
            v-model="registerForm.email"
            :data="emailSuggestions"
            placeholder="请输入邮箱"
            @search="handleEmailSearch"
            @blur="validateEmail"
            :filter-option="false"
            :style="{ width: '100%' }"
            allow-clear
          />
        </a-form-item>
        <a-form-item 
          label="验证码"
          :validate-status="captchaStatus"
          :help="captchaHelp"
        >
          <div class="captcha-container">
            <a-input 
              v-model="registerForm.captcha" 
              placeholder="请输入验证码"
              @blur="validateCaptcha"
            />
            <div class="captcha-image" @click="refreshCaptcha">
              <img v-if="captchaUrl" :src="captchaUrl" alt="验证码" />
              <div v-else class="captcha-loading">加载中...</div>
            </div>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" long :loading="isLoading" @click="handleSubmit">注册</a-button>
        </a-form-item>
        <div class="register-footer">
          <span>已有账号？</span>
          <a @click="handleLogin">立即登录</a>
        </div>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue';
import { register, generateCaptcha } from '@/api/index';
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';

const router = useRouter();
const captchaUrl = ref('');
const isLoading = ref(false);

// 表单数据
const registerForm = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  captcha: ''
});

// 表单验证状态
const usernameStatus = ref<'error' | 'success' | 'warning' | 'validating' | undefined>(undefined);
const usernameHelp = ref('');
const passwordStatus = ref<'error' | 'success' | 'warning' | 'validating' | undefined>(undefined);
const passwordHelp = ref('');
const confirmPasswordStatus = ref<'error' | 'success' | 'warning' | 'validating' | undefined>(undefined);
const confirmPasswordHelp = ref('');
const emailStatus = ref<'error' | 'success' | 'warning' | 'validating' | undefined>(undefined);
const emailHelp = ref('');
const captchaStatus = ref<'error' | 'success' | 'warning' | 'validating' | undefined>(undefined);
const captchaHelp = ref('');

// 邮箱自动补全数据
const emailSuggestions = ref<string[]>([]);
const commonDomains = [
  'gmail.com',
  'outlook.com',
  'hotmail.com',
  'yahoo.com',
  'qq.com',
  '163.com',
  '126.com',
  'sina.com',
  'foxmail.com',
  'icloud.com'
];

// 刷新验证码
const refreshCaptcha = async () => {
  try {
    captchaUrl.value = await generateCaptcha();
  } catch (error) {
    console.error('获取验证码失败:', error);
    Message.error('获取验证码失败，请刷新页面重试');
  }
};

// 组件挂载时加载验证码
onMounted(async () => {
  await refreshCaptcha();
});

// 处理邮箱输入建议
const handleEmailSearch = (value: string) => {
  if (!value) {
    emailSuggestions.value = [];
    return;
  }

  // 如果已经包含@符号，尝试提供域名补全
  if (value.includes('@')) {
    const [username, domain] = value.split('@');
    if (username && domain !== undefined) {
      emailSuggestions.value = commonDomains
        .filter(item => item.startsWith(domain))
        .map(item => `${username}@${item}`);
    }
  } else {
    // 如果没有@符号，添加各种域名建议
    emailSuggestions.value = commonDomains.map(domain => `${value}@${domain}`);
  }
};

// 验证用户名
const validateUsername = () => {
  if (!registerForm.username.trim()) {
    usernameStatus.value = 'error';
    usernameHelp.value = '用户名不能为空';
    return false;
  } else if (registerForm.username.length < 3) {
    usernameStatus.value = 'error';
    usernameHelp.value = '用户名长度不能少于3个字符';
    return false;
  } else {
    usernameStatus.value = 'success';
    usernameHelp.value = '';
    return true;
  }
};

// 验证密码
const validatePassword = () => {
  if (!registerForm.password) {
    passwordStatus.value = 'error';
    passwordHelp.value = '密码不能为空';
    return false;
  } else if (registerForm.password.length < 6) {
    passwordStatus.value = 'error';
    passwordHelp.value = '密码长度不能少于6位';
    return false;
  } else {
    passwordStatus.value = 'success';
    passwordHelp.value = '';
    // 如果确认密码已填写，则重新验证确认密码
    if (registerForm.confirmPassword) {
      validateConfirmPassword();
    }
    return true;
  }
};

// 验证确认密码
const validateConfirmPassword = () => {
  if (!registerForm.confirmPassword) {
    confirmPasswordStatus.value = 'error';
    confirmPasswordHelp.value = '请确认密码';
    return false;
  } else if (registerForm.confirmPassword !== registerForm.password) {
    confirmPasswordStatus.value = 'error';
    confirmPasswordHelp.value = '两次输入的密码不一致';
    return false;
  } else {
    confirmPasswordStatus.value = 'success';
    confirmPasswordHelp.value = '';
    return true;
  }
};

// 验证邮箱
const validateEmail = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!registerForm.email.trim()) {
    emailStatus.value = 'error';
    emailHelp.value = '邮箱不能为空';
    return false;
  } else if (!emailRegex.test(registerForm.email)) {
    emailStatus.value = 'error';
    emailHelp.value = '邮箱格式不正确';
    return false;
  } else {
    emailStatus.value = 'success';
    emailHelp.value = '';
    return true;
  }
};

// 验证验证码
const validateCaptcha = () => {
  if (!registerForm.captcha.trim()) {
    captchaStatus.value = 'error';
    captchaHelp.value = '验证码不能为空';
    return false;
  } else {
    captchaStatus.value = 'success';
    captchaHelp.value = '';
    return true;
  }
};

// 提交表单
const handleSubmit = async () => {
  // 表单验证
  const isUsernameValid = validateUsername();
  const isPasswordValid = validatePassword();
  const isConfirmPasswordValid = validateConfirmPassword();
  const isEmailValid = validateEmail();
  const isCaptchaValid = validateCaptcha();
  
  if (!isUsernameValid || !isPasswordValid || !isConfirmPasswordValid || !isEmailValid || !isCaptchaValid) {
    Message.error('请按要求填写注册信息');
    return;
  }
  
  try {
    isLoading.value = true;
    // 调用注册接口
    const response = await register(
      registerForm.username,
      registerForm.password,
      registerForm.email,
      registerForm.captcha
    );
    
    // 检查后端返回的状态码
    if (response && response.code === 1) {
      Message.success('注册成功，请登录');
      router.push('/login');  // 成功后跳转到登录页
    } else {
      // 显示后端返回的错误信息
      Message.error(response.msg || '注册失败，请重试');
      // 刷新验证码
      refreshCaptcha();
    }
  } catch (error: any) {
    console.error('注册失败:', error);
    // 处理网络错误或其他异常
    if (error.response?.data?.msg) {
      Message.error(error.response.data.msg);
    } else {
      Message.error('注册失败，可能是网络问题，请重试');
    }
    // 刷新验证码
    refreshCaptcha();
  } finally {
    isLoading.value = false;
  }
};

// 跳转到登录页
const handleLogin = () => {
  router.push('/login');
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}

.register-card {
  width: 400px;
  padding: 24px;
  border-radius: 8px;
}

.register-card h2 {
  text-align: center;
  margin-bottom: 24px;
}

.register-footer {
  text-align: center;
  margin-top: 16px;
}

.register-footer a {
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