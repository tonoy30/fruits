"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fruitRoutes = void 0;
const express_1 = require("express");
const array_utils_1 = require("../utils/array.utils");
const axios_utils_1 = require("../utils/axios.utils");
const router = (0, express_1.Router)();
exports.fruitRoutes = router;
const axiosClient = (0, axios_utils_1.getAxiosClient)();
function retryWorkDelay(worker, city, delay, count, retry = 1) {
    return worker
        .then((response) => {
        // group by the response by using key for faster access
        const groupedResponse = (0, array_utils_1.groupByKey)(response.data, 'location_1_city');
        const dataToBeReturned = {
            city: city,
            fruits: [],
        };
        groupedResponse[city].forEach((value) => {
            dataToBeReturned.fruits.push(value.item);
        });
        return [dataToBeReturned];
    })
        .catch((err) => {
        if (count > retry) {
            console.log(err + 'executing with delay ' + delay);
            setTimeout(() => {
                retryWorkDelay(worker, city, delay * (retry + 1), count, retry + 1);
            }, delay);
        }
        else {
            console.log(err + 'executing with delay ' + delay);
            throw new Error(err.message);
        }
    });
}
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const city = req.query.city;
    const cal = axiosClient.get('y6p2-px98.json', {
        params: { category: 'Fruit' },
    });
    retryWorkDelay(cal, city, 1000, 3)
        .then((data) => {
        res.json({ data: data });
    })
        .catch((err) => {
        res.status(500).json({ error: err.message });
    });
}));
