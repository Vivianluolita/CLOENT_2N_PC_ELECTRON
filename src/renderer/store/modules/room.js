const state = {
  // 1房间信息
  roomInfo: {},
  // 2用户信息
  userInfo: {},
  // 3房间打字状态false为不允许打字,true为允许打字
  // roomTypeStatus: true,
  // 4-1我的打字状态
  myTypeStatus: true,
  // 4-2我的说话状态
  myVoiceStatus: true,
  // 5用户当前所在子频道id
  inRoomId: '',
  // 6用户上一个子频道id
  lastRoomId: '',
  // 7被调度移动到的房间
  moveRoomId: '',
  // 8房间用户列表
  roomUserList: [],
  // 9麦序列表
  microList: [],
  // 10 马甲列表
  roomClothesList: [],
  // 11 emoji列表
  roomEmojiList: [],
  // 12 我要发送的消息的内容
  roomMsgContent: '',
  // 12-1 我要@的人
  roomMsgTarget: {},
  // 13 我要发送的表情
  roomSendEmoji: '',
  // 14 当前房间的信息
  currentRoomInfo: {}
}

const mutations = {
  // 1设置房间信息
  ROOMINFO_SET (state, data) {
    state.roomInfo = data
  },
  // 2设置用户信息
  USERINFO_SET (state, data) {
    state.userInfo = data
  },
  // // 3设置房间打字状态
  // ROOMTYPESTATUS_SET (state, data) {
  //   state.roomTypeStatus = data
  // },
  // 4-1设置我的打字状态
  MYTYPESTATUS_SET (state, data) {
    state.myTypeStatus = data
  },
  // 4-2 设置我的说话状态
  MYVOICESTATUS_SET (state, data) {
    state.myVoiceStatus = data
  },
  // 5设置当前所在子频道id
  INROOMID_SET (state, data) {
    state.inRoomId = data
  },
  // 6设置 用户上一个所在频道id
  LASTROOMID_SET (state, data) {
    state.lastRoomId = data
  },
  // 7设置用户被调度之后的频道id
  MOVEROOMID_SET (state, data) {
    state.moveRoomId = data
  },
  // // 8设置房间用户列表
  // ROOMUSERLIST_SET (state, data) {
  //   state.roomUserList = data
  // },
  // 9设置麦序列表
  MICROLIST_SET (state, data) {
    state.microList = data
  },
  // 10设置马甲列表
  ROOMCLOTHESLIST_SET (state, data) {
    state.roomClothesList = data
  },
  // 11 设置emoji表情列表
  ROOMEMOJILIST_SET (state, data) {
    state.roomEmojiList = data
  },
  // 12 设置我要发送的消息的内容
  ROOMMSGCONTENT_SET (state, data) {
    state.roomMsgContent = data
  },
  // 12-1 设置我要@的目标
  ROOMMSGTARGET_SET (state, data) {
    state.roomMsgTarget = data
  },
  // 13 设置我要发送的emoji
  ROOMEMOJISEND_SET (state, data) {
    state.roomSendEmoji = data
    // console.log(state)
  },
  // 14 设置我当前的房间信息
  CURRENTROOMINFO_SET (state, data) {
    state.currentRoomInfo = data
  }
}

const actions = {
  // 1【设置房间信息】
  setRoomInfo ({ commit }, params) {
    commit('ROOMINFO_SET', params)
  },
  // 1-1 【新增子频道】
  addRoomChannel ({ commit }, params) {
    let roomInfo = JSON.parse(JSON.stringify(this.state.room.roomInfo))
    roomInfo.list.map(e => {
      if (e.id === params.id) {
        if (e.childs) {
          e.childs.push(params.data)
        } else {
          e.childs = []
          e.childs.push(params.data)
        }
      }
    })
    commit('ROOMINFO_SET', roomInfo)
  },
  // 1-2 【删除子频道】
  reduceRoomChannel ({ commit }, params) {
    let roomInfo = JSON.parse(JSON.stringify(this.state.room.roomInfo))
    let treeList = roomInfo.list
    for (let i = 0; i < treeList.length; i++) {
      if (treeList[i].id === params) {
        treeList.splice(i, 1)
      }
      if (treeList[i].childs) {
        let childList = treeList[i].childs
        for (let e = 0; e < childList.length; e++) {
          if (childList[e].id === params) {
            childList.splice(e, 1)
          }
        }
      }
    }
    commit('ROOMINFO_SET', roomInfo)
  },
  // 1-3 【设置取消接待频道】
  setOrRemoveReception ({ commit }, params) {
    let roomInfo = JSON.parse(JSON.stringify(this.state.room.roomInfo))
    let treeList = roomInfo.list
    if (params.id !== 0) {
      treeList.map(e => {
        if (e.id === params.id) {
          e.is_reception = params.flag
        }
        if (e.childs) {
          e.childs.map(i => {
            if (i.id === params.id) {
              i.is_reception = params.flag
            }
          })
        }
      })
    } else {
      treeList.map(e => {
        e.is_reception = false
        if (e.childs) {
          e.childs.map(i => {
            i.is_reception = params.flag
          })
        }
      })
    }
    commit('ROOMINFO_SET', roomInfo)
  },
  // 1-4 【修改频道收藏状态】
  setRoomCollectStatus ({ commit }, params) {
    let roomInfo = JSON.parse(JSON.stringify(this.state.room.roomInfo))
    roomInfo.is_collect = params
    commit('ROOMINFO_SET', roomInfo)
  },
  // 1-5 【增加房间人数】
  async addRoomNumList ({ commit }, params) {
    let roomInfo = JSON.parse(JSON.stringify(this.state.room.roomInfo))
    let roomNUM = 0
    roomInfo.list.map(e => {
      if (params.id === e.id) {
        e.user_num++
      }
      roomNUM += e.user_num
      roomInfo.user_num = roomNUM
    })
    commit('ROOMINFO_SET', roomInfo)
  },
  // 1-6 【减少房间人数】
  async reduceRoomNumList ({ commit }, params) {
    let roomInfo = JSON.parse(JSON.stringify(this.state.room.roomInfo))
    let roomNUM = 0
    roomInfo.list.map(e => {
      if (params.id === e.id) {
        e.user_num--
      }
      roomNUM += e.user_num
      roomInfo.user_num = roomNUM
    })
    commit('ROOMINFO_SET', roomInfo)
  },
  // 1-7 【减少本地所在房间的显示】
  async setLocalInRoom ({ commit }, params) {
    let roomInfo = JSON.parse(JSON.stringify(this.state.room.roomInfo))
    roomInfo.current_sub_channel_id = params
    commit('ROOMINFO_SET', roomInfo)
  },
  // 2【设置用户信息】
  setUserInfo ({ commit }, params) {
    commit('USERINFO_SET', params)
  },
  // 3【设置房间打字状态】
  setRoomTypeStatus ({ commit }, params) {
    let roomInfo = JSON.parse(JSON.stringify(this.state.room.roomInfo))
    roomInfo.list.map(e => {
      if (e.id === params.id) {
        e.word_forbid = !e.word_forbid
      }
      if (e.childs) {
        e.childs.map(i => {
          if (i.id === params.id) {
            i.word_forbid = !i.word_forbid
          }
        })
      }
    })
    commit('ROOMINFO_SET', roomInfo)
    let currentRoomInfo = JSON.parse(
      JSON.stringify(this.state.room.currentRoomInfo)
    )
    currentRoomInfo.word_forbid = !currentRoomInfo.word_forbid
    commit('CURRENTROOMINFO_SET', currentRoomInfo)
  },
  // 4-1【设置我的打字状态】
  setMyTypeStatus ({ commit }, params) {
    commit('MYTYPESTATUS_SET', params)
  },
  // 4-2 【设置我的说话状态】
  setMyVoiceStatus ({ commit }, params) {
    commit('MYVOICESTATUS_SET', params)
  },
  // 5【设置用户所在频道ID】
  setInRoomId ({ commit }, params) {
    commit('INROOMID_SET', params)
  },
  // 6【设置用户上一个所在频道ID】
  setLastRoomId ({ commit }, params) {
    commit('LASTROOMID_SET', params)
  },
  // 7【设置用户被调度的频道ID】
  setMoveRoomId ({ commit }, params) {
    commit('MOVEROOMID_SET', params)
  },
  // // 8【设置房间用户列表】
  // setRoomUserList ({ commit }, params) {
  //   commit('ROOMUSERLIST_SET', params)
  // },
  // 8-2 添加房间内的用户
  async addRoomUserList ({ commit }, params) {
    let currentRoomInfo = JSON.parse(
      JSON.stringify(this.state.room.currentRoomInfo)
    )
    currentRoomInfo.users.push(params)
    commit('CURRENTROOMINFO_SET', currentRoomInfo)
  },
  // 8-3 移除房间内的用户
  async reduceRoomUserList ({ commit }, params) {
    let currentRoomInfo = JSON.parse(
      JSON.stringify(this.state.room.currentRoomInfo)
    )
    let num
    for (let i = 0; i < currentRoomInfo.users.length; i++) {
      if (currentRoomInfo.users[i].nn_id === params.nn_id) {
        num = i
      }
    }
    currentRoomInfo.users.splice(num, 1)
    commit('CURRENTROOMINFO_SET', currentRoomInfo)
  },
  // 9【设置麦序列表】
  setMicroList ({ commit }, params) {
    if (params) {
      let currentRoomInfo = JSON.parse(
        JSON.stringify(this.state.room.currentRoomInfo)
      )
      let roleList = JSON.parse(JSON.stringify(this.state.room.roomClothesList))
      params.users.map(e => {
        currentRoomInfo.users.map(i => {
          if (e.user_id === i.nn_id) {
            e.userInfo = i
          }
        })
      })
      params.users.map(e => {
        roleList.map(i => {
          if (e.userInfo.role === i.id) {
            if (e.userInfo.gender === 1) {
              e.userInfo.roleIcon = i.icon_male
            } else if (e.userInfo.gender === 2) {
              e.userInfo.roleIcon = i.icon_female
            }
          }
        })
      })
    }
    commit('MICROLIST_SET', params)
  },
  // 10 【设置马甲列表】
  setRoomClothesList ({ commit }, params) {
    commit('ROOMCLOTHESLIST_SET', params)
  },
  // 11【设置emoji表情列表】
  setRoomEmojiList ({ commit }, params) {
    commit('ROOMEMOJILIST_SET', params)
  },
  // 12 【设置我要发送的消息的内容】
  setRoomMsgContent ({ commit }, params) {
    commit('ROOMMSGCONTENT_SET', params)
  },
  // 12-1  【设置我要@的目标】
  setRoomMsgTarget ({ commit }, params) {
    commit('ROOMMSGTARGET_SET', params)
  },
  // 13 【设置我要发送的emoji】
  setRoomSendEmoji ({ commit }, params) {
    commit('ROOMEMOJISEND_SET', params)
  },
  // 14 【设置我当前的房间信息】
  setCurrentRoomInfo ({ commit }, params) {
    commit('CURRENTROOMINFO_SET', params)
  },
  // 14-1 【重置房间的马甲】
  setCurrentRoomRoleInfo ({ commit }, params) {
    let currentRoomInfo = JSON.parse(
      JSON.stringify(this.state.room.currentRoomInfo)
    )
    // console.log(params)
    currentRoomInfo.users.map(e => {
      // console.log(e)
      if (e.nn_id === params.nn_id) {
        e.role = params.role
      }
    })
    // console.log(currentRoomInfo)
    commit('CURRENTROOMINFO_SET', currentRoomInfo)
  },
  // 14-2 【重置房间用户的打字模式】
  setCurrentRoomUserWordForbid ({ commit }, params) {
    let currentRoomInfo = JSON.parse(
      JSON.stringify(this.state.room.currentRoomInfo)
    )
    currentRoomInfo.users.map(e => {
      // console.log(e)
      if (e.nn_id === params.nn_id) {
        e.word_forbid = !params.word_forbid
      }
    })
    commit('CURRENTROOMINFO_SET', currentRoomInfo)
  }
}

export default {
  state,
  mutations,
  actions
}
