import axios from "axios";
import Request from "@/api/request";
import { message } from "ant-design-vue";
import router from "./router/index.js"
function hasToken() {
    const token = localStorage.getItem("Authorization");
    return (token !== null);
}
function setToken(token) {//存入AccessToken //在登录表单等地方需要调用该函数存入token
    localStorage.setItem("Authorization", token);
    //getProfile();//获取用户信息
}
function isVaildToken() {//检查access_token令牌是否有效(存在,未过期)
    const token = localStorage.getItem("Authorization");

    Request({
        method: 'POST',
        url: 'xxxx',
        data: {
            xxxx
        }
    }).then(response => {
      const responseData=response.data.data
      console.log(responseData)
      jwt.setToken(responseData.token)
      localStorage.setItem("Authorization",responseData.token);
      return responseData
    }, error => {
    console.log('错误', error.message)
    })

    return xxx;
}
function getProfile()
{
    console.log("获取用户信息:")
    const token = localStorage.getItem("Authorization");
    axios({
        method: 'get',
        url: 'https://famous-rarely-clam.ngrok-free.app' + '/user/profile',
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
    localStorage.removeItem("Authorization");//清除本地token
    localStorage.removeItem("character");//清除角色记录
    router.replace({ path: "/login" });
    console.log("退出登录")
    message.success('已退出登录')
}

export default {
    hasToken,
    isVaildToken,
    setToken,
    getProfile,
    logout
};