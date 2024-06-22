# Node.js + React 的聊天系统
## 简介
这是一个使用 Express.js 和 React.js 构建的实时聊天系统。该项目展示了如何结合前端和后端技术来创建一个简单的聊天应用，包括用户认证、消息实时更新等功能。本项目适合初学者作为学习和实践的示例项目。

## 功能

- 登录和注册
- 聊天室列表：查看、新建、编辑聊天室
- 聊天室：实时收发消息
- 用户信息管理

## 技术栈
- **前端**: React, Typescript, Material UI, Redux, Axios
- **后端**: Express, jsonwebtoken, Mariadb, Sequelize, Mysql2

## 安装与运行

### 前置条件
- Node.js
- MySQL 或 Mariadb 数据库

### 配置数据库
1. 登录数据库，
2. 创建一个名为 `chatdb` 的库
3. 执行 `packages/backend/db-init.sql`, 为 chatdb 定义表格
4. 修改 `packages/backend/models/db.js` 中的 username 和 password，使后端项目能连接到数据库。如果你使用的是 mysql，请修改 dialect 为 mysql。

### 运行步骤
- 安装依赖
```
yarn install
```

- 运行
```
yarn start
```

## 小提示

Q: 运行命令执行后，启动的是前端还是后端

A: 同时启动。

Q: 如何实现的实时消息收发

A: 轮询。
