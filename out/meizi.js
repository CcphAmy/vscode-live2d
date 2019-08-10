"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("./tools");
const path = require("path");
const fs = require("fs");
const PACKAGE = require('../package.json');
class Maizi {
    constructor() {
        this.version = PACKAGE.version;
        this.name = PACKAGE.displayName;
        this.jsfilePath = path.join(tools_1.getBasePath(), 'workbench.js');
    }
    //   constructor() {
    //     this.uninstall();
    //   }
    // 是否初始化
    get isInstall() {
        var str = fs.readFileSync(this.jsfilePath);
        return str.indexOf(`/*ext-${this.name}-start*/`) !== -1;
    }
    // 安装
    install() {
        if (this.isInstall)
            return;
        tools_1.copy(path.join(__dirname, '../assets/'), tools_1.getBasePath());
        this.insertJS();
    }
    // 卸载
    uninstall() {
        if (!this.isInstall)
            return;
        this.clearJS();
    }
    reset() {
        this.uninstall();
        this.install();
    }
    insertJS() {
        var jsString = fs
            .readFileSync(path.join(__dirname, '../resources/insertJS.js'))
            .toString();
        var insertStr = `
        /*ext-${this.name}-start*/
        ${jsString}
        /*ext-${this.name}-end*/
        `;
        fs.writeFileSync(this.jsfilePath, fs.readFileSync(this.jsfilePath).toString() + insertStr, 'utf-8');
    }
    clearJS() {
        var re = new RegExp(`\\/\\*ext-${this.name}-start\\*\\/[\\s\\S]*?\\/\\*ext-${this.name}-end\\*\\/`, 'g');
        let content = fs.readFileSync(this.jsfilePath).toString();
        content = content.replace(re, '').replace(/\s*$/, '');
        fs.writeFileSync(this.jsfilePath, content, 'utf-8');
    }
}
exports.default = new Maizi();
//# sourceMappingURL=meizi.js.map