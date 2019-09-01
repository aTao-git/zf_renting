import Axios from 'axios'
import { REACT_APP_API_URL } from './urls'
export let axios = Axios.create({
  baseURL: REACT_APP_API_URL
})
axios.interceptors.response.use(function (res) {
  console.log(res)
  return res.data
}, function (err) {
  console.log(err)
  return Promise.reject(err)
})