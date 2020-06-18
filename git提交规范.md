## Git使用规范
- 开发阶段使用dev分支
- 开发人员使用自己的名称（全拼小写，如有冲突由管理员指定）建立自己的开发分支
- 开发前需同步dev分支到自己的开发分支，提交时合并到dev分支
- 发布使用master分支，并设置相应的tag

## Git提交规范
### 格式
```git
type:subject

detail

issue
close
```
- type (必须): commit的类型
    - feat：新功能
    - fix：修复bug
    - update: 更新
    - docs：文档改变
    - style：代码格式改变
    - refactor：某个已有功能重构
    - perf：新能优化
    - test：添加测试
    - build：构建工具或构建过程等的变动
    - revert：撤销上一次的commit
    - merge：合并代码
- subject（必须）：commit 的简短描述，不超过50个字符
- detail（可选）：提交内容的详细描述，前后保留一行空白行
- issue（可选）：本次提交关联的issue编号（mantis上的编号）
- close（可选）：本次提交解决的issue编号（mantis上的编号）
- 示例
```git
fix: 修复修改密码后，雷神账号无法登录的问题

用户修改密码时，仅修改了当前数据库密码，雷神账号密码并未修改。导致雷神账号
无法正常登录，旧密码可以登录的情况。现已调整逻辑为修改密码时同时修改雷神账
号的密码修复此问题。

issue：#11476
close：#11478
```
>  以上规范由开发人员自觉遵守即可。不需要使用工具。
