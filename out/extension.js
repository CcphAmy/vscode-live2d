'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const meizi_1 = require("./meizi");
function activate(context) {
    meizi_1.default.reset();
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map