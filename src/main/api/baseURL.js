// 开发环境的共用配置接口
const BASEURL = {
  path: 'http://dev-svr.nn.com',
  imgPath: 'http://dev-svr.nn.com',
  ws: 'ws:192.168.3.69:50001'
}

export function changeWS (data) {
  if (BASEURL.path === 'http://dev-svr.nn.com') {
    BASEURL.ws = `ws:${data}`
  } else if (BASEURL.path === 'https://test-svr.nn.com') {
    BASEURL.ws = `wss://${data}`
  }
  console.log(BASEURL)
}
export default BASEURL
