<template>
  <div class="help-page">
    <el-container>
      <el-header>
        <div @click="toHomePage" style="cursor: pointer;">
          <img alt src="../assets/img/help/logo2.png" />
          <h1>NN.com</h1>
          <p>全球游戏社交平台</p>
        </div>
        <div class="help">
          <h3>帮助中心</h3>
        </div>
      </el-header>
      <div class="content">
        <el-main>
          <el-tabs :stretch="true" :tab-position="tabPosition" v-model="activeName1">
            <el-tab-pane
              class="problem"
              label="常见问题"
              name="first"
              style="height:calc(100vh - 100px);overflow-y:auto;overflow-x:hidden"
            >
              <h3>常见问题</h3>
              <el-collapse accordion v-model="activeName">
                <el-collapse-item name="1" title="Q：如何创建频道？">
                  <div>
                    A：左键点击“创建频道”—》更换“频道形象”—》输入“频道名称”—》选择“频道类型”—》选择“频道分类”（在“NN约玩”平台有陪玩账号的用
                    户可关联陪玩ID）点击“确定”。
                  </div>
                </el-collapse-item>
                <el-collapse-item name="2" title="Q：频道主/管理员怎么创建频道的子频道？">
                  <div>A：右键点击自己所在频道（父频道）名称—》选择“新建子频道”—》输入频道名称—》输入频道密码—》点击“确定”。</div>
                </el-collapse-item>
                <el-collapse-item name="3" title="Q：频道主如何修改频道（父频道）信息？">
                  <div>A：右键点击频道（父频道）名称—》选择“更换频道形象”—》输入频道名称—》选择“频道类型”—》点击“确定”。</div>
                </el-collapse-item>
                <el-collapse-item name="4" title="Q：频道主如何修改频道（子频道）信息？">
                  <div>
                    A：右键点击频道（子频道）名称—》选择“频道信息”—》输入“子频道名称”—》输入“子
                    频道密码”—》输入“默认麦序时长”—》输入“限制频道人数”—》点击“确定”。
                  </div>
                </el-collapse-item>
                <el-collapse-item name="5" title="Q：频道主如何解散频道？">
                  <div>
                    A：右键点击频道名称—》选择“解散频道”—》点击“发送验证码”—》点击“发送验证码”
                    —》输入验证码—》点击“确认删除”。
                  </div>
                </el-collapse-item>
                <el-collapse-item name="6" title="Q：频道主如何转让频道？">
                  <div>A：左键点击左上角频道图标—》选择“频道转让”—》输入“转让人ＩＤ”—》点击“发送验证码”—》填写“发送验证码”—》点击“确定”。</div>
                </el-collapse-item>
                <el-collapse-item name="7" title="Q：频道主如何配置频道管理员的权限？">
                  <div>A：左键点击频道图标—》选择“权限管理”—》勾选“权限管理”—》点击“确定”。</div>
                </el-collapse-item>
                <el-collapse-item name="8" title="Q：频道主如何管理频道成员身份？">
                  <div>A：右键点击在同一个频道上的其他人—》选择“成员管理”—》选择“提升为XX（嘉宾、临时嘉宾、会员、全频道管理员、频道总管理）”。</div>
                </el-collapse-item>
                <el-collapse-item name="9" title="Q：频道主如何撤销管理员？">
                  <div>
                    A：右键点击自己所在频道—》选择“频道信息”—》选择“管理列表”—》选择“管理列表”
                    —》右键点击管理员昵称—》选择“撤销管理员”—》点击“确定”。
                  </div>
                </el-collapse-item>
                <el-collapse-item name="10" title="Q：频道主/管理员如何对频道成员禁言？">
                  <div>A：右键点击在同一个频道上的其他人—》选择“禁止说话/打字”。</div>
                </el-collapse-item>
                <el-collapse-item name="11" title="Q：频道主/管理员如何将违规人员踢出频道？">
                  <div>A：右键点击在同一个频道上的其他人—》选择“踢出频道”。</div>
                </el-collapse-item>
                <el-collapse-item name="12" title="Q：如何查看自己所在频道的信息？">
                  <div>A：右键点击自己所在频道—》选择“频道信息”。</div>
                </el-collapse-item>
                <el-collapse-item name="13" title=" Q：如何查看自己所在频道的信息？">
                  <div>A：右键点击自己所在频道—》选择“频道信息”。</div>
                </el-collapse-item>
                <el-collapse-item name="14" title="Q：频道内如何查看他人信息？">
                  <div>A：右键点击在同一个频道上的其他人—》点击“个人信息”。</div>
                </el-collapse-item>
                <el-collapse-item name="15" title="Q：频道内如何添加他人为好友？">
                  <div>A：右键点击在同一个频道上的其他人—》选择“加为好友”</div>
                </el-collapse-item>
                <el-collapse-item name="16" title="Q：麦序模式中，频道主/管理员如何将1号位用户从麦序中移除？">
                  <div>A：右键点击1号麦序用户—》选择“从麦序中移除”。</div>
                </el-collapse-item>
                <el-collapse-item name="17" title="Q：麦序模式中，频道主/管理员如何更改非1号位用户的麦序？">
                  <div>A：右键点击1号麦序用户—》选择“将用户麦序上移/下移”。</div>
                </el-collapse-item>
              </el-collapse>
            </el-tab-pane>
            <el-tab-pane
              class="user"
              label="用户手册"
              name="second"
              style="height:calc(100vh - 100px);overflow-y:auto;overflow-x:hidden;"
            >
              <h3>用户手册</h3>
              <h2>一、系统简介</h2>
              <p>“NN”是雷神集团旗下的“全球游戏社交平台”。它的业务范围包括：实时语音、连麦交友、频道K歌、游戏开黑、游戏陪玩。产品核心特点是：安全、稳定、高效。NN致力于语音社交和游戏陪玩产业，不断完善用户体验，持续优化平台机制，努力提升服务质量，力争打造成全球领先的游戏社交平台。</p>
              <h2>二、主要功能</h2>
              <h4>· 登录/注册</h4>
              <p>打开NN客户端，就能进入到对应的登录界面。输入手机号和密码，点击登录，即可打开NN主页。在该页面点击相应的按钮就会进入到对应的界面中，界面中的每个独立的功能按钮都有详细的操作功能，可以自主进行搜索，或根据流程进行操作。详情如下图所示：</p>
              <img alt class="login" src="../assets/img/help/user1.png" />
              <img alt class="login" src="../assets/img/help/user2.png" />
              <h4>· 主页</h4>
              <p>点击主页上的按钮，就能进入到对应的功能界面。右键点击频道，即可对频道进行“查看频道信息”、“进入频道等一系列操作”。在该页面点击相应的按钮就会进入到对应的界面中，界面中的每个独立的功能按钮都有详细的操作功能，可以自主进行搜索，或根据流程进行操作。详情如下图所示：</p>
              <img alt class="game" src="../assets/img/help/user3.png" />
              <img alt class="game" src="../assets/img/help/user4.png" />
              <h4>· 进入频道</h4>
              <p>点击主页中的频道，就能进入到对应的频道界面。右键点击左上角频道头像可选择“频道信息”、“退出”、“收藏频道/取消收藏”等操作；右键点击频道，可进行“进入频道”、查看“频道信息”等操作；右键点击频道用户可选择“加为好友”、查看“个人信息”、等操作；右键点击麦上用户，可选择查看“所在频道”、“加为好友”、“发送消息”等操作。管理员和频道主的右键操作较一般用户更多，可以对频道和频道内用户进行一系列操作。在该页面点击相应的按钮就会进入到对应的界面中，界面中的每个独立的功能按钮都有详细的操作功能，可以自主进行搜索，或根据流程进行操作。详情如下图所示：</p>
              <img alt class="game" src="../assets/img/help/user5.png" />
              <img alt class="game" src="../assets/img/help/user6.png" />
              <img alt class="game" src="../assets/img/help/user7.png" />
              <img alt class="game" src="../assets/img/help/user8.png" />
              <img alt class="game" src="../assets/img/help/user9.png" />
              <img alt class="game" src="../assets/img/help/user10.png" />
              <h4>· 聊天</h4>
              <p>点击主页中的聊天按钮，就能进入到对应的聊天界面。选择通讯录即可进入个人的好友列表，并可查看好友信息，对好友进行一系列操作。</p>
              <img alt class="game" src="../assets/img/help/user11.png" />
              <img alt class="game" src="../assets/img/help/user12.png" />
              <h4>· 个人中心</h4>
              <p>点击主界面上的设置按钮，就能进入到对应的个人中心页面。该功能具体包括点击该按钮之后就能看见具体相关的操作信息。点击相应的按钮就会进入到对应的功能界面中，界面中的每个独立的功能按钮都有详细的操作功能，可以根据流程进行操作。详情如下图所示：</p>
              <img alt class="login" src="../assets/img/help/user13.png" />
              <img alt class="login" src="../assets/img/help/user14.png" />
              <h4>· 设置</h4>
              <p>点击主界面上的设置按钮，就能进入到对应的设置页面。在设置中包含“系统设置”、“语音调节”、“声音提示”、“好友设置”。该功能具体包括点击该按钮之后就能看见具体相关的操作信息。点击相应的按钮就会进入到对应的功能界面中，界面中的每个独立的功能按钮都有详细的操作功能，可以根据流程进行操作。详情如下图所示：</p>
              <img alt class="login" src="../assets/img/help/user15.png" />
              <img alt class="login" src="../assets/img/help/user16.png" />
              <h4>· 更换皮肤</h4>
              <p>点击主界面上的皮肤按钮，就能进入到对应的更换皮肤页面。该页面包含“默认皮肤”、“珍珠白”、“典雅黑”“梦之蓝”四种皮肤模板。该功能具体包括点击该按钮之后就能看见具体相关的操作信息。点击相应的按钮就会进入到对应的功能界面中，界面中的每个独立的功能按钮都有详细的操作功能，可以根据流程进行操作。详情如下图所示：</p>
              <img alt class="game" src="../assets/img/help/user17.png" />
              <img alt class="game" src="../assets/img/help/user18.png" />
            </el-tab-pane>
            <el-tab-pane
              class="agreement"
              label="用户协议"
              name="third"
              style="height:calc(100vh - 100px);overflow-y:auto;overflow-x:hidden;"
            >
              <h3>用户协议</h3>
              <p>
                感谢用户对NN的认可与喜爱！NN是雷神（武汉）信息技术有限公司倾力打造并精心运营的全球游戏社交平台。为了给用户提供更为优质的产品服务及用户体验，用户在注册成为NN的用户前，需与雷神（武汉）信息技术有限公司（以下简称“本公司”）签订本《用户协议》。为保障用户的权益，
                <span>请审慎阅读（若用户是未成年人，应当在监护人陪同下阅读）并充分理解本《用户协议》（以下简称“本协议”）中的各项条款，尤其是免除或者限制本公司责任的条款、对用户的权利进行限制的条款、以及约定适用法律和争议管辖的条款。</span>若用户不接受本协议，请立即退出本次注册或停止使用NN的全部功能；若用户点击“立即注册”、“同意”、“接受”、“下一步”等含义的按钮，或实际使用NN，均视为用户已完全接受并签署本协议，自愿接受本协议的约束。
              </p>
              <h4>一、用户注册及账户管理</h4>
              <p>1.1 用户资格</p>
              <p>1.1.1用户在注册或开始使用NN服务前，应当具备中华人民共和国法律规定的与用户行为相适应的民事行为能力。若用户不具备前述民事行为能力，则用户应在监护人的陪同下审阅和接受本协议，用户的监护人应依照法律规定承担因此而导致的一切后果。</p>
              <p>1.1.2用户注册NN账号应根据相关法律法规的规定，进行实名认证。用户需根据NN平台页面的提示准确完整地提供用户信息，包括但不限于姓名、联系电话、联系地址、电子邮件等信息。用户保证其在注册账号时和后续使用中填写的身份及其他信息均是真实的，任何非法、不真实、不准确的用户信息所产生的责任由用户自行承担。</p>
              <p>1.2账户注册及管理</p>
              <p>1.2.1用户应当使用手机号码绑定注册，请用户使用尚未与NN账号绑定的手机号码，以及未被本公司根据本协议封禁的手机号码注册NN账号。本公司可以根据用户需求或产品需求对账号注册和绑定的方式进行更改，而无须事先通知用户。用户完成注册即表示同意本公司提取并公开使用其他地理位置信息、自动提取用户的手机号码及手机设备识别码等信息。</p>
              <p>1.2.2在其信息发生变化时,用户应及时、详尽、真实、准确地更新注册资料。用户提供的所有资料都将可能影响用户账号的使用。因用户的注册信息不真实而引起的问题及后果，由用户自行承担，本公司不负任何责任。</p>
              <p>1.2.3用户应当妥善保管自己的账号及密码，不应向任何其他人透露密码。用户账号项下一切活动均视为用户本人的行为，用户就该等活动负全部责任，因该等活动而形成的用户数据的修改，虚拟货币及虚拟道具的损失以及其他所有的损失均由用户自行承担。</p>
              <p>1.2.4 NN账号仅限于在本公司（或其关联方或合作方）拥有或运营的网站及软件上由注册用户本人使用，禁止赠与、借用、租用、转让或售卖与任何第三方。如果发现NN账号实际使用者并非账号注册人，本公司有权在未经通知的情况下回收该账号，而无需向该账号使用者或注册人承担法律责任，由此带来的包括并不限于用户通讯中断、用户资料和虚拟货币与虚拟道具清空等损失由用户自行承担。</p>
              <p>1.2.5 用户账号在丢失或遗忘密码后，可遵NN提供的申诉途径及时申诉请求找回账号。用户应不断提供能增加账号安全性的个人密码保护资料。用户可以凭初始注册资料及个人密码保护资料填写申诉单向NN申请找回账号。NN的密码找回机制仅负责识别申诉资料与系统记录资料相比对后是否吻合，而无法识别申诉人是否真正系该NN账号的有权使用人。对用户因被他人冒名申诉而导致的任何损失，本公司在法律允许范围内不承担任何责任。用户知晓NN账号及密码保管责任在于用户，本公司并不承诺NN账号丢失或遗忘密码后用户一定能通过申诉找回账号。</p>
              <p>1.2.6 如用户违反法律法规、本协议、各项NN产品与服务的独立协议或平台规则和公告等规定，本公司有权根据相关规则进行违规判定，并采取相应限制或处罚措施，包括但不限于：禁用某项或几项功能、冻结账号、封禁登录社保、永久禁止使用并删除账号等措施。</p>
              <p>1.2.7 为了充分利用NN账号资源，本公司有权对用户长期未登录使用的NN账号进行回收、替换等终止使用的操作，并有权清除该账号上承载的一切信息、数据和记录。</p>
              <p>1.2.8 本公司依照平台规则和公告限制、冻结、回收、替换或终止用户NN账号的使用，可能会给用户造成一定的损失，该损失由用户自行承担，本公司不承担任何责任。</p>
              <h4>二、内容规范及使用规则</h4>
              <p>2.1用户通过NN所传送、发布的任何内容并不反映或代表、也不得被视为反映或代表本公司的观点、立场或政策，本公司对此不承担任何责任。</p>
              <p>2.2用户不得利用NN账号制作、上传、发布、传播如下法律、法规和政策禁止的内容：</p>
              <p>1) 反对宪法所确定的基本原则的；</p>
              <p>2) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p>
              <p>3) 损害国家荣誉和利益的；</p>
              <p>4) 煽动民族仇恨、民族歧视，破坏民族团结的；</p>
              <p>5) 破坏国家宗教政策，宣扬邪教和封建迷信的；</p>
              <p>6) 散布谣言，扰乱社会秩序，破坏社会稳定的；</p>
              <p>7) 散布淫秽、色情、赌博、暴力、凶杀、恐怖内容或者教唆犯罪的；</p>
              <p>8) 侮辱或者诽谤他人，侵害他人合法权益的；</p>
              <p>9) 含有法律、行政法规禁止的其他内容的信息。</p>
              <p>2.3用户不得利用NN账号制作、上传、发布、传播如下干扰NN正常运营，以及侵犯其他用户或第三方合作权益的内容：</p>
              <p>1) 含有任何性暗示的；</p>
              <p>2) 含有辱骂、恐吓、威胁内容的；</p>
              <p>3) 含有骚扰、垃圾广告、恶意信息、引诱或欺骗性信息的；</p>
              <p>4) 涉及他人隐私、个人信息或资料的；</p>
              <p>5) 侵害他人名誉权、肖像权、知识产权、商业秘密等合法权益的；</p>
              <p>6) 含有其他干扰NN正常运营和侵犯其他用户或第三方合法权益内容的信息。</p>
              <p>2.4用户不得利用NN进行如下行为：</p>
              <p>1)发布虚假信息或盗用他人头像或资料，冒充他人名义；</p>
              <p>2) 强制、诱导其他用户关注、点击链接页面或分享信息；</p>
              <p>3) 虚构事实、隐瞒真相以误导、欺骗他人；</p>
              <p>4) 利用技术手段批量建立虚假账号；</p>
              <p>5) 利用NN账号从事任何犯罪活动；</p>
              <p>6) 制作、发布与以上行为相关的方法、工具，或对此类方法、工具进行运营或传播；</p>
              <p>7) 其他违反法律法规、侵犯其他用户合法权益、干扰NN正常运营或本公司未明示授权的行为。</p>
              <p>2.5用户须对利用NN账号传送信息的真实性、合法性、准确性、有效性等负责，并保证该信息不得违反公序良俗。与用户所传播信息相关的任何法律责任由用户自行承担，与本公司和NN无关。如因此给本公司或第三方造成损害的，用户应当依法予以赔偿。</p>
              <p>2.6用户在NN的内容消费（内容消费特指：聊天室礼物打赏、动态礼物打赏、消息礼物打赏、属于礼物打赏等）行为，皆完全基于用户的自主、自愿行为；内容消费行为一旦发生概不退款；由用户自行对内容消费负责；本公司不承担任何责任。</p>
              <p>2.7本公司提供的服务中可能包括广告，用户同意在使用过程中显示本公司和第三方供应商、合作伙伴提供的广告。除法律法规明确规定外，用户应自行对基于该广告信息而进行的交易负责。对用户因依该广告信息进行的交易或前述广告商提供的内容或遭受的损失或损害，本公司及NN不承担任何责任。</p>
              <p>2.8用户在NN产生的收入（如有）应自行向税务机关依法纳税，因用户偷税漏税相关的任何法律责任由用户自行承担，与本公司和NN无关。如因此给本公司或第三方造成损害的，用户应当依法予以赔偿。</p>
              <h4>三、隐私权政策</h4>
              <p>3.1用户的个人隐私信息是指涉及用户个人身份或个人隐私的信息，包括但不限于用户真实姓名、身份证号码、手机号码、手机设备识别码、IP地址、用户聊天记录等。非个人隐私信息是指用户对本服务的操作状态以及使用习惯等明确且客观反映在NN的基本记录信息、个人隐私信息范围外的其他普通信息、用户同意公开的上述隐私信息。</p>
              <p>3.2本公司将采取技术措施或其他必要措施，确保用户个人隐私信息安全，防止在本服务中收集的用户个人隐私信息泄露、毁损或丢失。在可能发生前述情形的时，将及时采取补救措施。</p>
              <p>3.3本公司及NN未经用户同意不向任何第三方公开、透露用户个人隐私信息。但以下特定情形除外：</p>
              <p>1) 本公司根据法律法规规定或有权机关的要求提供用户的个人隐私信息；</p>
              <p>2) 由于用户将其账号密码告知他人或与他人共享注册账号与密码，由此导致的任何个人信息的泄露，或其他非因本公司原因导致的个人隐私信息的泄露；</p>
              <p>3) 用户自行向第三方公开其个人隐私信息；</p>
              <p>4) 用户与本公司及合作单位之间就用户个人隐私信息的使用公开达成约定，本公司基于该约定而向合作单位披露用户的个人隐私信息；</p>
              <p>5) 任何由于黑客攻击、电脑病毒侵入及其他不可抗力事件导致用户个人隐私信息的泄露。</p>
              <p>3.4用户同意本公司可在以下事项中使用用户的个人隐私信息：</p>
              <p>1) 本公司向用户及时发送重要通知，如软件更新，本协议条款的变更；</p>
              <p>2) 本公司内部进行审计、数据分析和研究等，以改进本公司的产品或服务，以及改进本公司与用户之间的沟通；</p>
              <p>3) 本公司审核用户信息及进行处理措施；</p>
              <p>4) 法律法规规定的其他事项。</p>
              <p>3.5用户确认，其地理位置信息为非个人隐私信息，用户成功注册NN账号视为确认授权本公司提取、公开及使用用户的地理位置信息。用户地理位置信息将作为用户公开资料之一，由本公司向其他用户公开。如用户需终止向其他用户公开其地理位置信息，可随时自行设置。</p>
              <p>3.6用户确认，其消费信息、收益获得信息为非个人隐私信息，用户成功注册NN账号视为确认授权本公司提取、公开及使用用户的消费信息、收益获得信息。用户消费信息、收益获得信息将作为用户公开资料之一，由本公司向其他用户公开。</p>
              <p>3.7为了改善本公司的技术和服务，向用户提供更好的服务体验，本公司或会自行收集使用或向第三方提供用户的非个人隐私信息。</p>
              <h4>四、知识产权声明</h4>
              <p>4.1除本服务中涉及广告的知识产权由相应广告商享有外，本公司在本服务中提供的内容（包括但不限于网页、文字、图片、音频、视频、图表等）的知识产权均归本公司所有，但用户在使用本服务前对自己发布的内容已合法取得知识产权的除外。</p>
              <p>4.2除另有特别声明外，本公司提供本服务时所依托软件的著作权、专利权及其他知识产权均归本公司所有。</p>
              <p>4.3本公司在本服务中所涉及的图形、文字或其组成，以及其他本公司标志及产品、服务名称（以下统称“本公司标识”），其著作权或商标权归本公司所有。未经本公司事先书面同意，用户不得将本公司标识以任何方式展示或使用或作其他处理，也不得向他人表明用户有权展示、使用或其他有权处理本公司标识的行为。</p>
              <p>4.4上述及其他任何与本公司或相关广告商依法拥有的知识产权均受到法律保护，未经本公司或相关广告商书面许可，用户不得以任何形式进行使用或创造相关衍生作品。</p>
              <h4>五、法律责任</h4>
              <p>5.1如果本公司发现或收到他人举报或投诉用户违反本协议的约定的，本公司有权不经通知随时对相关内容，包括但不限于用户资料、聊天记录进行审查、删除，并视情节轻重对违规账号处以包括但不限于警告、功能封禁、账号冻结、设备封禁、永久封号的违规违约处理。</p>
              <p>5.2用户理解并同意，本公司有权依合理判断对违反有关法律法规或本协议规定的行为进行处罚，对违法违规的任何用户采取适当的法律行动，并依据法律法规保存有关信息、向有关部门报告等，用户应承担由此产生的一切法律责任。</p>
              <p>5.3用户理解并同意，因用户违反本协议约定，导致或产生的任何第三方主张的任何索赔、要求或损失（包括合理的律师费），用户应当向本公司与合作公司、关联公司赔偿。</p>
              <p>5.4用户理解并同意，因用户违反本协议约定，导致本公司对其进行永久封号处理的，用户被永久封号后，账号内的现金余额将不得再进行提现。上述现金余额将视为违规用户向本公司支付的违约金，由本公司收取并支配。</p>
              <h4>六、不可抗力及其他免责事由</h4>
              <p>6.1用户理解并确认，在接受本服务的过程中，可能会遇到不可抗力等风险因素，使本服务中断。不可抗力是指不能预见、不能克服并不能避免且对一方或双方造成重大影响的客观事件，包括但不限于自然灾害如洪水、地震、瘟疫流行和风暴等以及社会事件如战争、动乱、政府行动等。出现上述情况时。本公司将努力在第一时间与相关单位配合，及时进行修复，但是由此给用户或第三方造成的损失，本公司及合作单位在法律允许的范围内免责。</p>
              <p>6.2本服务同大多数互联网服务一样，受包括但不限于用户原因、网络服务质量、社会环境等因素的差异影响，可能受到各种安全问题的侵扰，如他人利用用户的资料，造成现实生活中的骚扰；用户下载安装的其它软件或访问的其他网站中含有“木马病毒等，威胁到用户的计算机信息和数据的安全，继而影响本服务的正常使用等等。用户应加强信息安全及使用者资料的保护意识，要注意加强密码保护，以免遭致损失和骚扰。</p>
              <p>6.3用户理解并确认，本服务存在因不可抗力、计算机病毒或黑客攻击、系统不稳定、用户所在位置、用户关机以及其他任何技术、互联网络、通信线路原因等造成的服务中断或不能满足用户要求的风险，因此导致的用户或第三方任何损失，本公司不承担任何责任。</p>
              <p>6.4用户理解并确认，在使用本服务过程中存在来自任何他人的包括误导性的、欺骗性的、威胁性的、诽谤性的、令人反感的或非法的信息，或侵犯他人权利的匿名或冒名的信息，以及伴随该等信息的行为，因此导致的用户或第三方的任何损失，本公司不承担任何责任。</p>
              <p>6.5用户理解并确认，本公司需要定期或不定期地对NN平台或相关的设备进行检修或者维护，如因此类情况而造成服务在合理时间内的中断，本公司无需为此承担任何责任。</p>
              <p>6.6用户使用NN产品与服务必须遵守国家有关法律法规和政策等。用户应维护国家利益，保护国家安全，言行不应违背公序良俗和正确的价值观。用户应严格遵守本协议、平台规则和公告，对于用户违法或违反本协议使用（包括但不限于发表言论、传送内容等）而引起的一切责任，由用户负全部责任。</p>
              <p>6.7本公司依据法律法规、本协议约定获得处理违法违规或违约内容的权利，该权利不构成本公司的义务或承诺，本公司不能保证及时发现违法违规或违约行为或进行相应处理。用户如若发现有有违法违规行为的，应当及时通知本公司，以便本公司采取适当措施。</p>
              <p>6.8用户理解并确认，在任何情况下，本公司均不对任何间接性、后果性、惩罚性、偶然性、特殊性或刑罚性的损害，包括因用户使用本服务而遭受的利润损失，承担责任（即使本公司已被告知该等损失的可能性亦然）。本公司对用户承担的全部责任，无论因何原因或何种行为方式，始终不超过用户因使用本公司提供的服务而支付给本公司的费用(如有)。</p>
              <h4>七、服务的变更、中断、终止</h4>
              <p>7.1鉴于网络服务的特殊性，用户同意本公司有权随时变更、中断或终止部分或全部的服务（包括收费服务）。</p>
              <p>7.2如发生下列任何一种情形，本公司有权变更、中断或终止向用户提供的免费服务或收费服务，而无需对用户或任何第三方承担任何责任：</p>
              <p>1) 根据法律规定用户应提交真实信息，而用户提供的个人资料不真实或与注册时信息不一致又未能提供合理证明；</p>
              <p>2) 用户违反相关法律法规或本协议的约定；</p>
              <p>3) 按照法律规定或有权机关的要求；</p>
              <p>4) 出于安全的原因或其他必要的情形。</p>
              <h4>八、特别声明</h4>
              <p>本公司在此依法做出特别声明如下：</p>
              <p>本公司采取合理的方式提请用户注意的义务将通过如下方式实现：在本协议中本公司以明确的足以引起用户注意的加粗字体、下划线等合理方式提醒用户注意相关条款（需要强调的是，还包括用户应特别注意任何未明确标记的含有“不承担”、“免责”、“不得”等形式用语的条款），该等条款的确认将导致用户在特定情况下的被动、不便、损失，请用户在确认同意本协议之前再次阅读上述条款。</p>
              <p>用户如有任何需要说明条款的要求，请立即停止使用服务，同时联系NN客服。若用户未向NN客服发出要求说明条款的要求选择同意该协议，则双方在此确认本公司已依法履行了根据用户要求对相关条款进行说明的法定义务，本公司已给予用户充足的时间与充分的选择权来决定是否缔结本协议。</p>
              <p>鉴于本公司已依法明确了上述条款、履行了格式条款制订方的义务，用户点击立即注册、接受、同意或下一步，将被视为且应当被视为用户已经完全注意并同意了本协议所有条款，用户不应当以本公司未对格式条款以合理方式提醒用户注意或未根据用户要求尽到说明义务为理由而声称或要求法院或其它任何第三方确认相关条款非法或无效。</p>
              <h4>九、其他条款</h4>
              <p>9.1NN可根据国家法律法规变化及NN平台服务变化的需要，不时修改本协议、补充协议，变更后的协议、补充协议（下称“变更事项”）将通过本协议第9.2条约定的方式通知用户。更新后的协议条款一旦公布即代替原来的协议条款。</p>
              <p>如用户对变更事项不同意的，用户应当于变更事项确定的生效之日起停止使用NN平台服务；如用户用户变更事项生效后仍继续使用NN平台服务，则视为用户同意已生效的变更事项。</p>
              <p>9.2用户同意NN以以下合理的方式向用户送达各类通知：</p>
              <p>（一）公示的文案；</p>
              <p>（二）站内消息、弹出消息、客户端推送的消息；</p>
              <p>（三）根据用户预留于NN平台的联系方式发出的电子邮件、手机短信、函件等；</p>
              <p>NN通过上述方式向用户发出通知，在发送成功后即视为送达；以纸质载体发出的书面通知，按照提供联系地址交邮后的第五个自然日即视为送达。</p>
              <p>对于在NN平台上因交易活动引起的任何纠纷，用户同意司法机关（包括但不限于人民法院）可以通过手机短信、电子邮件等现代通讯方式或邮寄方式向用户送达法律文书（包括但不限于诉讼文书）。用户指定接收法律文书的手机号码、电子邮箱等联系方式为用户在NN平台注册、更新时提供的手机号码、电子邮箱联系方式，司法机关向上述联系方式发出法律文书即视为送达。用户指定的邮寄地址为用户的法定联系地址或用户提供的有效联系地址。</p>
              <p>用户同意司法机关可采取以上一种或多种送达方式向用户达法律文书，司法机关采取多种方式向用户送达法律文书，送达时间以上述送达方式中最先送达的为准。用户同意上述送达方式适用于各个司法程序阶段。如进入诉讼程序的，包括但不限于一审、二审、再审、执行以及督促程序等。</p>
              <p>用户应当保证所提供的联系方式是准确、有效的，并进行实时更新。如果因提供的联系方式不确切，或不及时告知变更后的联系方式，使法律文书无法送达或未及时送达，由用户自行承担由此可能产生的法律后果。</p>
              <p>9.3本协议之效力、解释、变更、执行与争议解决均适用中华人民共和国法律。因本协议产生之争议，均应依照中华人民共和国法律予以处理，并由本公司住所地人民法院管辖。</p>
            </el-tab-pane>
            <el-tab-pane
              class="about"
              label="关于我们"
              name="fourth"
              style="height:calc(100vh - 100px);overflow-y:auto;overflow-x:hidden;"
            >
              <h3>关于我们</h3>
              <p>雷神（武汉）信息技术有限公司旗下的“全球游戏社交平台”——NN。它的业务范围包括：实时语音、连麦交友、频道K歌、游戏开黑、游戏陪玩。产品核心特点是：安全、稳定、高效。NN致力于语音社交和游戏陪玩产业，不断完善用户体验，持续优化平台机制，努力提升服务质量，力争打造成全球领先的游戏社交平台。</p>
            </el-tab-pane>
            <el-tab-pane
              class="call"
              label="联系我们"
              name="fifth"
              style="height:calc(100vh - 100px);overflow-y:auto;overflow-x:hidden;"
            >
              <h3>联系我们</h3>
              <p>
                雷神（武汉）信息技术有限公司
                <br />商务合作：周女士
                <br />QQ：3004634734
                <br />邮箱：zhoufeng@nn.com
                <br />
                <br />客服QQ：3004634734
              </p>
            </el-tab-pane>
            <el-tab-pane
              class="guide"
              label="新手指引"
              name="sixth"
              style="height:calc(100vh - 100px);overflow-y:auto;overflow-x:hidden;"
            >
              <h3>新手指引</h3>
              <h4>一、登录/注册</h4>
              <p>下载客户端，打开NN客户端，进入到对应的注册界面，输入手机号和密码，点击注册，注册成功后登录，即可打开NN主页</p>
              <img alt class="login" src="../assets/img/help/guide1.png" />
              <h4>二、创建频道</h4>
              <p>点击主页中的创建频道，就能进入到对应的界面。在该界面中可编辑频道形象、名称、类型的信息</p>
              <img alt class="game" src="../assets/img/help/guide2.png" />
              <img alt class="game" src="../assets/img/help/guide3.png" />
              <img alt class="game" src="../assets/img/help/guide4.png" />
              <h4>三、进入频道</h4>
              <p>点击主页中的频道，就能进入到对应的频道界面。右键点击左上角频道头像可选择“频道信息”、“退出”、“收藏频道/取消收藏”等操作</p>
              <img alt class="game" src="../assets/img/help/guide5.png" />
              <img alt class="game" src="../assets/img/help/guide6.png" />
              <h4>四、管理频道</h4>
              <p>在频道内部，频道主和管理员可对频道相关设置进行编辑和修改</p>
              <img alt class="game" src="../assets/img/help/guide7.png" />
              <img alt class="game" src="../assets/img/help/guide8.png" />
              <img alt class="game" src="../assets/img/help/guide9.png" />
              <img alt class="game" src="../assets/img/help/guide10.png" />
              <h4>五、好友聊天</h4>
              <p>点击聊天按钮，即可进入对应的好友聊天界面</p>
              <img alt class="game" src="../assets/img/help/guide11.png" />
              <img alt class="game" src="../assets/img/help/guide12.png" />
              <h4>六、个人中心</h4>
              <p>在个人中心可设置自己的相关信息</p>
              <img alt class="login" src="../assets/img/help/guide13.png" />
              <img alt class="login" src="../assets/img/help/guide14.png" />
              <h4>七、设置</h4>
              <p>点击主界面上的设置按钮，就能进入到对应的设置页面</p>
              <img alt class="login" src="../assets/img/help/guide15.png" />
            </el-tab-pane>
          </el-tabs>
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'helpCenter',
  data () {
    return {
      tabPosition: 'left',
      activeName1: 'first',
      activeName: '1'
    }
  },
  beforeMount () {
    let id = this.$route.query.guide
    console.log('我是id', id)
    switch (id) {
      case '1':
        this.activeName1 = 'first'
        this.activeName = '1'
        break
      case '2':
        this.activeName1 = 'second'
        this.activeName = '2'
        break
      case '3':
        this.activeName1 = 'third'
        this.activeName = '3'
        break
      case '4':
        this.activeName1 = 'fourth'
        this.activeName = '4'
        break
      case '5':
        this.activeName1 = 'fifth'
        this.activeName = '5'
        break
      case '6':
        this.activeName1 = 'sixth'
        this.activeName = '6'
        break
    }
  },
  methods: {
    toHomePage () {
      window.open(window.location.origin + '/channelHall')
    }
  }
}
</script>
<style lang='less'>
/* 左侧导航栏 */
.el-tabs__nav .is-left {
  width: 260px;
  height: 60px;
  font-size: 16px;
  background-color: #fff;
  box-sizing: border-box;
}
/* 常见问题底边框 */
.help-page {
  .el-collapse-item__wrap,
  .el-collapse-item__header {
    border: none;
  }
}
</style>
<style lang="less" scoped>
div {
  overflow: hidden;
}
/* 标题头部 */
.el-header {
  position: relative;
  width: 1200px;
  margin: 0 auto;
  height: 70px !important;
  /* box-shadow: 1px 1px 5px 2px rgb(179, 177, 177); */
}
.el-header img {
  position: absolute;
  left: 0;
  bottom: 8px;
  width: 54px;
  height: 54px;
}
.el-header h1 {
  position: absolute;
  left: 63px;
  bottom: 31px;
  font-size: 30px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: rgba(48, 48, 51, 1);
  line-height: 26px;
}
.el-header p {
  position: absolute;
  left: 63px;
  bottom: 13px;
  font-size: 12px;
  font-family: MicrosoftYaHei;
  color: rgba(48, 48, 51, 1);
  line-height: 12px;
  letter-spacing: 1px;
}
.help {
  position: absolute;
  left: 215px;
  bottom: 25px;
  height: 20px;
  width: 96px;
  border-left: 2px solid #c0c4cc;
}
.help h3 {
  position: absolute;
  right: 0;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: rgba(48, 48, 51, 1);
  line-height: 16px;
}
/* 左侧切换标题 */
.el-tabs__nav .is-left {
  width: 260px;
  height: 420px;
}
.content {
  background-color: #f3f3f3;
  text-align: center;
  border-top: 1px solid #f3f3f3;
  padding-top: 20px;
}
.el-main {
  width: 1200px;
  padding: 0 !important;
  display: inline-block;
}

.el-tabs__header .is-left {
  background-color: #fff;
}
/* 右边页面标题 */
.el-tab-pane h3 {
  font-size: 20px;
  font-family: MicrosoftYaHei;
  color: rgba(48, 48, 48, 1);
  line-height: 20px;
  text-align: center;
  padding-top: 49px;
  padding-bottom: 52px;
  background-color: #fff;
}
.el-collapse {
  border: none;
}
.el-tab-pane p {
  font-size: 14px;
  line-height: 35px;
  padding: 20px;
}
/* 右边每一行 */
.el-collapse-item {
  text-align: left;
  font-size: 14px !important;
  border: 1px solid #e9eef4;
  border-radius: 4px;
  margin-bottom: 10px;
  padding: 0 20px;
}
.el-collapse-item__header,
.el-collapse-item__wrap {
  border: none !important;
  border-bottom: none !important;
}
/* 右边区域 */
.el-tab-pane {
  padding: 0 20px;
  background-color: #fff;
}
/* .el-collapse-item__header{
  border-bottom: none !important;
} */
/* 用户手册样式 */
.user h2,
.user p,
.user h4 {
  text-align: left;
}
.user h2 {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: rgba(48, 48, 51, 1);
  line-height: 16px;
  margin: 0 0 13px 20px;
}
.user p {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  color: rgba(96, 97, 102, 1);
  line-height: 28px;
}
.user h4 {
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: rgba(48, 48, 51, 1);
  line-height: 16px;
  margin: 30px 0 0 20px;
}
.user .login,
.user .game,
.guide .login,
.guide .game {
  width: 600px;
  margin-bottom: 20px;
}
.user .login,
.guide .login {
  height: 450px;
}
.user .game,
.guide .game {
  height: 375px;
}
.agreement p {
  font-size: 14px;
  color: #303033;
  text-align: left;
  padding-top: 0;
}
.agreement p span,
.agreement h4 {
  font-weight: bold;
}
.agreement h4 {
  font-size: 14px;
  text-align: left;
  margin: 0 0 20px 20px;
}
.about p {
  color: rgba(96, 97, 102, 1);
  line-height: 28px;
  text-align: left;
  padding-top: 0;
}
.call p {
  text-align: left;
  color: rgba(96, 97, 102, 1);
  padding-top: 0;
}
.guide h4 {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: rgba(48, 48, 51, 1);
  line-height: 16px;
  text-align: left;
  margin-left: 20px;
}
.guide p {
  color: rgba(96, 97, 102, 1);
  text-align: left;
  line-height: 28px;
}
/deep/ .is-left {
  line-height: 60px;
  text-align: center !important;
}
/deep/.el-tabs__nav {
  padding: 40px 0;
  background-color: #fff;
}
</style>
