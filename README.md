# my-project

> An electron-vue project

#### Build Setup

```bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).

# 项目依赖插件

> eslint
> vetur
> prettier

## .eslintrc.js 配置

```js
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: ['html'],
  rules: {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-unused-vars': 'off'
  }
}
```

## vscode 配置

```json
{
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "editor.fontLigatures": true,
  "editor.fontSize": 15,
  "editor.formatOnSave": true,
  "editor.rulers": [120],
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  "editor.wordWrapColumn": 120,
  "emmet.includeLanguages": {
    "vue": "html",
    "vue-html": "html"
  },
  "emmet.showExpandedAbbreviation": "inMarkupAndStylesheetFilesOnly",
  "emmet.triggerExpansionOnTab": true,
  "eslint.autoFixOnSave": true,
  "eslint.options": {
    "extensions": [".js", ".vue"]
  },
  "eslint.validate": [
    "javascript",
    {
      "autoFix": true,
      "language": "vue"
    },
    "javascriptreact",
    "html",
    "vue"
  ],
  "explorer.confirmDelete": false,
  "explorer.confirmDragAndDrop": false,
  "extensions.ignoreRecommendations": true,
  "git.autofetch": true,
  "git.confirmSync": false,
  "git.enableSmartCommit": true,
  "javascript.implicitProjectConfig.experimentalDecorators": true,
  "search.showLineNumbers": true,
  "vetur.format.defaultFormatter.html": "prettyhtml",
  "vetur.format.defaultFormatter.js": "prettier",
  "vetur.format.defaultFormatterOptions": {
    "prettier": {
      "semi": false,
      "singleQuote": true,
      "trailingComma": true
    },
    "prettyhtml": {
      "printWidth": 100,
      "singleQuote": false,
      "wrapAttributes": false,
      "sortAttributes": true
    }
  },
  "window.zoomLevel": 0,
  "workbench.colorTheme": "Atom One Dark",
  "workbench.iconTheme": "material-icon-theme",
  "go.useLanguageServer": true,
  "go.docsTool": "gogetdoc",
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[less]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "prettier.disableLanguages": ["vue"],
  "prettier.ignorePath": ".prettierignore",
  "editor.suggestSelection": "first",
  "vsintellicode.modify.editor.suggestSelection": "automaticallyOverrodeDefaultValue",
  "vetur.format.defaultFormatter.stylus": "stylus-supremacy",
  "editor.quickSuggestions": {
    "strings": true
  },
  "prettier.semi": false
}
```

#### 依赖

- electron-store 替代 cookie，localstorage，sessionstorage

  - 文档 https://www.npmjs.com/package/electron-store
  - 基础用法

  ```js
  import { Storage } from '../../../main/db/dbStore'

  Storage.set('token', 'archer')

  Storage.get('token')
  ```

- nedb 本地数据库

  - 文档 https://github.com/louischatriot/nedb
  - 基础用法

  ```js
  import { DB } from '../../../main/db/dbStore'

  DB.insert({ id: 1, name: 'archer' }, (err, doc) => {
    console.log(err, doc)
  })

  DB.findOne({ id: 1 }, (err, doc) => {
    console.log(err, doc)
  })
  ```

#### 系统参数存储
    是否开机自启动NN     isOpenTurnON    true/false
    是否启动NN自动登录   isOpenNN        true/false
    关闭主面板时         closePanel    // 1 最小化，不退出    2 退出程序

    声音数值 true/false
    系统声音提示        systemVoice
    好友消息           friendsVoice
    语音视频呼叫        AudioVideoVoice

#### 项目构建

```bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

# run unit & end-to-end tests
npm test


# lint all JS/Vue component files in `src/`
npm run lint

```

---
