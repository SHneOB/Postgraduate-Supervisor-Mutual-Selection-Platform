import axios from "axios";
import serverConfig from "./serverConfig";
import { message } from "ant-design-vue";
//import router from "./router.js";
//import EventBus from "./EventBus.js";

//Access令牌为短期令牌 Refresh令牌为长期令牌(刷新Access令牌的许可证)
function hasToken() {
    return localStorage.getItem("access_token") != null && localStorage.getItem("refresh_token") != null;
}

function getAccessToken() {//获取Access令牌 顺便检查refresh令牌是否过期
    if (isVaildAccessToken()) {
        return localStorage.getItem("access_token");
    }
    else {
        refreshToken();
        return localStorage.getItem("access_token");
    }
}

function getRefreshToken() {//获取Refresh令牌
    return localStorage.getItem("refresh_token");
}

function setAccessToken(token) {//存入AccessToken //在登录表单等地方需要调用该函数存入token
    localStorage.setItem("access_token", token);
    getProfile();
}

function setRefreshToken(token) {//浏览器缓存中存入refreshToken 在用户注册时 从后端获取token然后再调用此函数
    localStorage.setItem("refresh_token", token);
}

//token解码 传入token
const decodeJwt = (token) => {
    const parts = token.split('.');
    if (parts.length !== 3) {
        throw new Error('Invalid JWT token format');
    }

    const decodedHeader = JSON.parse(atob(parts[0]));
    const decodedPayload = JSON.parse(atob(parts[1]));

    return {
        header: decodedHeader,
        payload: decodedPayload,
        signature: parts[2] // 签名部分，通常在前端不做处理
    };
};

function isVaildRefreshToken() {//检查refresh_token令牌是否有效(存在,未过期)
    const refresh_token = localStorage.getItem("refresh_token");
    const decoded_refresh_token = refresh_token ? decodeJwt(refresh_token) : null;
    if (decoded_refresh_token == null) {
        return false;
    }
    const isRefreshTokenExpired = refresh_token ? (Date.now() >= decoded_refresh_token.payload.exp * 1000) : true;
    return !isRefreshTokenExpired;
}

function isVaildAccessToken() {//检查access_token令牌是否有效(存在,未过期)
    const access_token = localStorage.getItem("access_token");
    const decoded_access_token = access_token ? decodeJwt(access_token) : null;
    if (decoded_access_token == null) {
        return false;
    }
    const isAccessTokenExpired = access_token ? (Date.now() >= decoded_access_token.payload.exp * 1000) : true;
    return !isAccessTokenExpired;
}

function refreshToken() {//刷新Access令牌 顺便检查refresh令牌是否失效
    const refresh_token = localStorage.getItem("refresh_token");
    const formData = new FormData();
    formData.append('refresh', refresh_token);
    if (isVaildRefreshToken()) {
        const headers = {
            "Content-Type": "multipart/form-data",
        };
        axios.post(serverConfig.apiUrl + '/login/refresh', formData, { headers: headers })
            .then(response => {
                const new_access_token = response.data.access;
                setAccessToken(new_access_token);
            })
            .catch(error => {
                console.log(error);
                message.error("刷新 token 失败，请重新登录");
                router.push({ path: '/login' });
            })
    }
    else {
        console.error("refresh token is expired");
        message.error("登录过期，请重新登录");
        router.push({ path: '/login' });
    }
}

function getUsername() {
    const userProfile = JSON.parse(localStorage.getItem("user_profile"));//JSON.parse将 JSON 字符串转换为对应的 JavaScript 对象。
    if (userProfile == null || userProfile.username == null) {
        getProfile();//应该改成userProfile=getProfile()吧 待验证
    }
    return userProfile.username;
}

function getEmail() {
    const userProfile = JSON.parse(localStorage.getItem("user_profile"));
    if (userProfile == null || userProfile.email == null) {
        getProfile();
    }
    return userProfile.email;
}

function getUserId() {
    const userProfile = JSON.parse(localStorage.getItem("user_profile"));
    if (userProfile == null || userProfile.user_id == null) {
        getProfile();
    }
    return userProfile.user_id;
}

function getAvatar() {
    const userProfile = JSON.parse(localStorage.getItem("user_profile"));
    if (userProfile == null) {
        getProfile();
    }
    return userProfile.avatar;
}

function getProfile() {//从后端获取用户信息
    const access_token = localStorage.getItem("access_token");
    axios({
        method: 'get',
        url: serverConfig.apiUrl + '/user/profile',
        headers: {
            'Authorization': 'Bearer ' + access_token,
        },
    }).then((res) => {
        if (res.status == 200) {
            let userProfile = {
                user_id: res.data.data.user_id,
                username: res.data.data.username,
                email: res.data.data.email,
                avatar: res.data.data.avatar ? serverConfig.url + res.data.data.avatar : null,
            };
            localStorage.setItem("user_profile", JSON.stringify(userProfile));
            return userProfile;
        } else {
            message.error('获取用户信息失败，请稍后重试!');
        }
    }).catch((err) => {
        console.log(err);
        message.error('获取用户信息失败，请稍后重试!');
        userProfile = {};
        localStorage.setItem("user_profile", JSON.stringify(userProfile));
        return null;
    });
}

function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_profile");
    window.location.reload();
}

export default {
    hasToken,
    getAccessToken,
    getRefreshToken,
    setAccessToken,
    setRefreshToken,
    decodeJwt,
    isVaildRefreshToken,
    isVaildAccessToken,
    refreshToken,
    getUsername,
    getEmail,
    getUserId,
    getProfile,
    getAvatar,
    logout
};