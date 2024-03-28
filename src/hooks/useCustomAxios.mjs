//axios의 모듈화로 axios를 사용할 때 공통적으로 적용될 설정 instance로 설정
import { memberState } from "@recoil/user/atoms.mjs";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

const API_SERVER = 'https://market-lion.koyeb.app/api';

function useCustomAxios() {
  // 로그인 된 사용자의 정보
  const user = useRecoilValue(memberState);
  const navigate = useNavigate();
  // ajax 통신에 사용할 동통 설정 지정
  const instance = axios.create({
    baseURL: API_SERVER,
    timeout: 1000 * 5,
    headers: {
      'content-type': 'application/json', //request data type
      accept: 'application/json', //response data type
    }
  });

  // request interceptor
  instance.interceptors.request.use(config => {
    if(user){
      const accessToken = user.token.accessToken;
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  })

  // response interceptor
  instance.interceptors.response.use(res => res, err => {
    if(err.response?.status === 401){
      const gotoLogin = confirm('Login First!!\n Do you want to move Login Page?');
      gotoLogin && navigate('/users/login', {state: {from: location.pathname}})
    }else{
      return Promise.reject(err)
    }
  })
  return instance;
}

export default useCustomAxios