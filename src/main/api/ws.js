import BASEURL from './baseURL'
import axios from './axios'

// export function requestTouristStatus (data) {
//   let url = BASEURL.path + '啦啦啦啦'
//   return axios.post(url, data)
// }
export function getRoomConfig () {
  let url = BASEURL.path + '/api/v1/config'
  return axios.post(url, {})
}
