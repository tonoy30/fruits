"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.groupByKey = void 0;
function groupByKey(array, key) {
    return array.reduce((prev, obj) => {
        if (obj[key] === undefined)
            return prev;
        return Object.assign(prev, {
            [obj[key]]: (prev[obj[key]] || []).concat(obj),
        });
    }, {});
}
exports.groupByKey = groupByKey;
