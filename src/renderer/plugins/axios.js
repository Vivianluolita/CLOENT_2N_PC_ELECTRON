// eslint-disable-next-line no-unused-vars
import qs from 'qs'
// eslint-disable-next-line no-unused-vars
import { request } from 'http'

export default function ({ $axios, redirect }) {
  $axios.setHeader('Authorization', 'Bearer ' + getCookie('token_nn'))

  $axios.onRequest(request => {
    console.log('【Making request to】 ' + request)
  })

  $axios.onError(error => {
    const code = parseInt(error.response && error.response.status)
    if (code === 401) {
      redirect('/login')
    }
    if (code === 403) {
      alert('权限不足!')
    }
  })

  $axios.onResponse(response => {
    console.info('【response】', response.data)
    return Promise.resolve(response.data)
  })

  $axios.onError(error => {
    return Promise.reject(error)
  })
}

// 获取cookie
function getCookie (key) {
  if (process.client) {
    if (document.cookie.length > 0) {
      var start = document.cookie.indexOf(key + '=')
      if (start !== -1) {
        start = start + key.length + 1
        var end = document.cookie.indexOf(';', start)
        if (end === -1) end = document.cookie.length
        return unescape(document.cookie.substring(start, end))
      }
    }
  }
  return ''
}
