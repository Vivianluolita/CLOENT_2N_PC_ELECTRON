const state = {
  // 新建频道dialog开关
  changeNewChannelDiaVisible: false,
  // 编辑频道dialog开关
  changeEditChannelDiaVisible: false,
  // 查看频道dialog开关
  changeWatchChannelDiaVisible: false,
  // 存频道类型数组
  categoryListArr: [],
  // 存全局配置
  pageConfigArr: [],
  // 左侧菜单dialog开关
  containerLeftDiaVisible: false,
  // 左侧菜单选中哪一个(分类ID)
  containerLeftListOption: 0,
  // 排序类型
  channelSortType: 1,
  // 排序开关
  channelSortTypeVisible: true,
  // 频道列表
  channelInfoList: [],
  // 我创建的频道列表
  myChannelInfoList: [],
  // 每次加载频道列表多少个
  channelListLimitNum: 100,
  // 搜索框输入的信息
  searchValue: '',
  // 当前是哪种类型：0是选择左侧列表的类型，1是我的频道的类型， 2是我的收藏的类型
  channelListType: 0,
  // 解散频道开关
  disbandChannelVisible: false,
  // 当前被点击的频道id
  selectedChannelNo: 0,
  // 加载更多显示的文字
  moreBtnText: '加载更多',
  // 是否显示缺省页
  isChannelListdefault: false,
  // 是否显示创建房间按钮
  isNewChannelBtn: false,
  // 是否显示我的频道下拉列表
  isShowMyChannelList: false,
  // 是否显示我的收藏下拉列表
  isShowMyCollectList: false,
  // 足迹信息
  setFootprintList: [],
  // 搜索列表缓存
  searchListHistory: [],
  // 记录最后一个房间号
  lastChannelId: 0
}

const mutations = {
  SHOWNEWCHANNEL (state, data) {
    state.changeNewChannelDiaVisible = data
  },
  SHOWEDITCHANNEL (state, data) {
    state.changeEditChannelDiaVisible = data
  },
  SHOWWATCHCHANNEL (state, data) {
    state.changeWatchChannelDiaVisible = data
  },
  SAVACATEGORYLISTARR (state, data) {
    state.categoryListArr = data
  },
  SAVAPAGECONFIGARR (state, data) {
    state.pageConfigArr = data
  },
  SHOWCONTAINERLEFT (state, data) {
    state.containerLeftDiaVisible = data
  },
  SELECTCONTAINERLEFTLIST (state, data) {
    state.containerLeftListOption = data
  },
  SELECRCHANNELSORTTYPE (state, data) {
    state.channelSortType = data
  },
  SHOWCHANNELSORTTYPE (state, data) {
    state.channelSortTypeVisible = data
  },
  SETCHANNELINFOLIST (state, data) {
    state.channelInfoList = data
  },
  SETMYCHANNELINFOLIST (state, data) {
    state.myChannelInfoList = data
  },
  SETCHANNELLISTLIMIT (state, data) {
    state.channelListLimitNum = data
  },
  GETSEARCHVALUE (state, data) {
    state.searchValue = data
  },
  SETCHANNELLISTTYPE (state, data) {
    state.channelListType = data
  },
  SHOWDISBANDCHANNEL (state, data) {
    state.disbandChannelVisible = data
  },
  SELECTEDCHANNELNO (state, data) {
    state.selectedChannelNo = data
  },
  SETMOREBTNTEXT (state, data) {
    state.moreBtnText = data
  },
  ISCHANNELLISTDEFAULT (state, data) {
    state.isChannelListdefault = data
  },
  ISNEWCHANNELBTN (state, data) {
    state.isNewChannelBtn = data
  },
  ISSHOWMYCHANNELLIST (state, data) {
    state.isShowMyChannelList = data
  },
  ISSHOWMYCOLLECTLIST (state, data) {
    state.isShowMyCollectList = data
  },
  SETFOOTPRINTLIST (state, data) {
    state.setFootprintList = data
  },
  GETSEARCHLISTHISTORY (state, data) {
    state.searchListHistory = data
  },
  SETLASTCHANNELID (state, data) {
    state.lastChannelId = data
  }
}

const actions = {
  NewChannelBtnClick (context, data) {
    context.commit('SHOWNEWCHANNEL', data)
  },
  editChannelBtnClick (context, data) {
    context.commit('SHOWEDITCHANNEL', data)
  },
  watchChannelBtnClick (context, data) {
    context.commit('SHOWWATCHCHANNEL', data)
  },
  SaveCategoryListArr (context, data) {
    context.commit('SAVACATEGORYLISTARR', data)
  },
  SavePageConfigArr (context, data) {
    context.commit('SAVAPAGECONFIGARR', data)
  },
  ShowContainerLeft (context, data) {
    context.commit('SHOWCONTAINERLEFT', data)
  },
  SelectContainerLeftList (context, data) {
    context.commit('SELECTCONTAINERLEFTLIST', data)
  },
  SelectChannelSortType (context, data) {
    context.commit('SELECRCHANNELSORTTYPE', data)
  },
  ShowChannelSortType (context, data) {
    context.commit('SHOWCHANNELSORTTYPE', data)
  },
  SetChannelInfoList (context, data) {
    context.commit('SETCHANNELINFOLIST', data)
  },
  SetMyChannelInfoList (context, data) {
    context.commit('SETMYCHANNELINFOLIST', data)
  },
  SetChannelListLimit (context, data) {
    context.commit('SETCHANNELLISTLIMIT', data)
  },
  GetSearchValue (context, data) {
    context.commit('GETSEARCHVALUE', data)
  },
  SetChannelListTpye (context, data) {
    context.commit('SETCHANNELLISTTYPE', data)
  },
  ShowDisbandChannel (context, data) {
    context.commit('SHOWDISBANDCHANNEL', data)
  },
  SelectedChannelNo (context, data) {
    context.commit('SELECTEDCHANNELNO', data)
  },
  SetMoreBtnText (context, data) {
    context.commit('SETMOREBTNTEXT', data)
  },
  IsChannelListDefault (context, data) {
    context.commit('ISCHANNELLISTDEFAULT', data)
  },
  IsNewChannelBtn (context, data) {
    context.commit('ISNEWCHANNELBTN', data)
  },
  IsShowMyChannelList (context, data) {
    context.commit('ISSHOWMYCHANNELLIST', data)
  },
  IsShowMyCollectList (context, data) {
    context.commit('ISSHOWMYCOLLECTLIST', data)
  },
  SetFootprintList (context, data) {
    context.commit('SETFOOTPRINTLIST', data)
  },
  GetSearchListHistory (context, data) {
    context.commit('GETSEARCHLISTHISTORY', data)
  },
  SetLastChannelId (context, data) {
    context.commit('SETLASTCHANNELID', data)
  }
}

export default {
  state,
  mutations,
  actions
}
