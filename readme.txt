正常情况直接执行：
npm install
ionic serve
如遇部分依赖无法下载，执行如下步骤：
1. npm install cnpm -g --registry=https://registry.npm.taobao.org

2. cnpm install node-sass@v3.10.1（示例）

3. npm install

4. ionic serve




如遇异常尝试执行如下指令：
1。删除node所有模块

 2. 执行  npm install @ionic/app-scripts@latest --save-dev

3. 执行 npm install

4. 执行 ionic server

