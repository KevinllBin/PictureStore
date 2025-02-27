import axios from 'axios';

const API_URL = 'http://localhost/user';
const VERIFY_URL = 'http://localhost/verify';

axios.defaults.withCredentials = true; // 允许跨域携带cookie
// 获取验证码
export const generateCaptcha = async () => {
  try {
    const response = await axios.get(`${VERIFY_URL}/generate`, {
      responseType: 'blob' // 使用blob类型接收图片数据
    });
    return URL.createObjectURL(response.data);
  } catch (error) {
    throw error;
  }
};

// 注册方法
export const register = async (username: string, password: string, email: string, captcha: string) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            username,
            password,
            email,
            captcha
        });
        return response.data; // 返回注册成功的响应数据
    } catch (error) {
        throw error; // 抛出错误以便处理
    }
};

// 登录方法
export const login = async (username: string, password: string, captcha: string) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username,
            password,
            captcha
        });
        return response.data; // 返回登录成功的响应数据
    } catch (error) {
        throw error; // 抛出错误以便处理
    }
};

// 保存token到浏览器的localStorage
export const saveToken = (token: string) => {
    localStorage.setItem('token', token);
};