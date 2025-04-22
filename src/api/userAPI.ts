import baseRequest from "./baseRequest";


// 发送验证码
export const sendAuthCode = (email: string, mode: string) => {
    return baseRequest.get("/user/sendAuthCode", {
        params: {
            email: email,
            mode: mode
        }
    })
}


// 用户注册
export const userRegister = (username: string, password: string, email: string, authCode: string) => {
    return baseRequest.post("/user/register", {
        username: username,
        password: password,
        email: email,
        authCode: authCode
    })
}


// 用户登录
export const login = (username: string, password: string) => {
    return baseRequest.post("/user/login", {
        username: username,
        password: password
    })
}


// 根据token查询用户详细信息
export const parseUserInfoByToken = (token: string) => {
    return baseRequest.post("/user/parseUserInfoByToken", token, {
        headers: {
            "Content-Type": "text/plain"
        }
    })
}


// 验证验证码是否正确
export const validAuthCode = (email: string, authCode: string) => {
    return baseRequest.post("/user/validAuthCode", {
        email: email,
        authCode: authCode
    })
}


// 重置用户密码
export const reset = (email: string, authCode: string, password: string) => {
    return baseRequest.post("/user/reset", {
        email: email,
        authCode: authCode,
        password: password
    })
}