"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const vscode = require("vscode");
const getJs_1 = require("./getJs");
var FileType;
(function (FileType) {
    /**
     * 未修改的文件
     */
    FileType[FileType["empty"] = 0] = "empty";
    /**
     * hack 过的旧版本文件
     */
    FileType[FileType["isOld"] = 1] = "isOld";
    /**
     * hack 过的新版本的文件
     */
    FileType[FileType["isNew"] = 2] = "isNew";
})(FileType || (FileType = {}));
class Dom {
    //初始化参数
    constructor(configName, filePath, version, extName) {
        this.configName = configName;
        this.filePath = filePath;
        this.version = version;
        this.extName = extName;
        this.config = vscode.workspace.getConfiguration(this.configName);
        let firstload = this.checkFirstload(); // 是否初次加载插件
        let fileType = this.getFileType(); // css 文件目前状态
        // 如果是第一次加载插件，或者旧版本
        if (firstload || fileType == FileType.isOld || fileType == FileType.empty) {
            this.install(true);
        }
    }
    /**
     * 安装插件，hack css
     *
     * @private
     * @param {boolean} [refresh] 需要更新
     * @returns {void}
     */
    install(refresh) {
        let lastConfig = this.config; // 之前的配置
        let config = vscode.workspace.getConfiguration(this.configName); // 当前用户配置
        // 1.如果配置文件改变到时候，当前插件配置没有改变，则返回
        if (!refresh && JSON.stringify(lastConfig) == JSON.stringify(config)) {
            // console.log('配置文件未改变.')
            return;
        }
        // 之后操作有两种：1.初次加载  2.配置文件改变
        // 2.两次配置均为，未启动插件
        if (!lastConfig.enabled && !config.enabled) {
            // console.log('两次配置均为，未启动插件');
            return;
        }
        // 3.保存当前配置
        this.config = config; // 更新配置
        // 4.如果关闭插件
        if (!config.enabled) {
            this.uninstall();
            vscode.window.showInformationMessage(this.extName + '已关闭插件，请重新启动！');
            vscode.commands.executeCommand('workbench.action.reloadWindow');
            return;
        }
        // 5.hack 样式
        // 自定义的样式内容
        let content = getJs_1.default(config, this.extName, this.version).replace(/\s*$/, ''); // 去除末尾空白
        // 添加代码到文件中，并尝试删除原来已经添加的
        let newContent = this.getContent();
        newContent = this.clearCssContent(newContent);
        newContent += content;
        this.saveContent(newContent);
        vscode.window.showInformationMessage(this.extName + ' 已更新配置，请重新启动！');
        vscode.commands.executeCommand('workbench.action.reloadWindow');
    }
    /**
     * 获取文件内容
     * @var mixed
     */
    getContent() {
        return fs.readFileSync(this.filePath, 'utf-8');
    }
    /**
     * 设置文件内容
     *
     * @private
     * @param {string} content
     */
    saveContent(content) {
        fs.writeFileSync(this.filePath, content, 'utf-8');
    }
    /**
     * 清理已经添加的代码
     *
     * @private
     * @param {string} content
     * @returns {string}
     */
    clearCssContent(content) {
        var re = new RegExp('\\/\\*ext-' +
            this.extName +
            '-start\\*\\/[\\s\\S]*?\\/\\*ext-' +
            this.extName +
            '-end\\*' +
            '\\/', 'g');
        content = content.replace(re, '');
        content = content.replace(/\s*$/, '');
        return content;
    }
    /**
     * 卸载
     *
     * @private
     */
    uninstall() {
        try {
            let content = this.getContent();
            content = this.clearCssContent(content);
            this.saveContent(content);
            return true;
        }
        catch (ex) {
            return false;
        }
    }
    /**
     * 检测是否初次加载，并在初次加载的时候提示用户
     *
     * @private
     * @returns {boolean} 是否初次加载
     */
    checkFirstload() {
        const configPath = path.join(__dirname, '../resources/config.json');
        let info = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        if (info.firstload) {
            // 提示
            vscode.window.showInformationMessage('插件： ' + this.extName + '已启动! ');
            // 标识插件已启动过
            info.firstload = false;
            fs.writeFileSync(configPath, JSON.stringify(info, null, '    '), 'utf-8');
            return true;
        }
        return false;
    }
    /**
     * 获取文件状态
     *
     * @private
     * @returns {FileType}
     */
    getFileType() {
        let cssContent = this.getContent();
        // 未 hack 过
        let ifUnInstall = !~cssContent.indexOf(`ext.${this.extName}.ver`);
        if (ifUnInstall) {
            return FileType.empty;
        }
        // hack 过的旧版本
        let ifVerOld = !~cssContent.indexOf(`/*ext.${this.extName}.ver.${this.version}*/`);
        if (ifVerOld) {
            return FileType.isOld;
        }
        // hack 过的新版本
        return FileType.isNew;
    }
}
exports.Dom = Dom;
//# sourceMappingURL=Dom.js.map