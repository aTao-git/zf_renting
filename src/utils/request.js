import Axios from 'axios'
import { REACT_APP_API_URL } from './urls'
import { Toast } from 'antd-mobile'
export let axios = Axios.create({
  baseURL: REACT_APP_API_URL
})
// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  Toast.loading('正在加载...', 60 * 60, null, true)
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});
axios.interceptors.response.use(function (res) {
  Toast.hide()
  return res.data
}, function (err) {
  console.log(err)
  return Promise.reject(err)
})