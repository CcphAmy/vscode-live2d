"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
var jsString = fs
    .readFileSync(path.join(__dirname, '../resources/insertJS.js'))
    .toString();
function default_1(_config, extName, version) {
    return `
	/*ext-${extName}-start*/
	${jsString}
	/*ext-${extName}-end*/
	`;
}
exports.default = default_1;
//# sourceMappingURL=getJs.js.map