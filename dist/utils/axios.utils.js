"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAxiosClient = void 0;
const axios_1 = __importDefault(require("axios"));
function getAxiosClient() {
    const axiosClient = axios_1.default.create({
        baseURL: 'https://data.ct.gov/resource/',
        headers: {}
    });
    return axiosClient;
}
exports.getAxiosClient = getAxiosClient;
