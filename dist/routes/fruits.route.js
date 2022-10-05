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
// retry http request on error
function retryRequestWithDelay(worker, city, delay, count, retry = 1) {
    return worker
        .then((response) => {
        // group by the response by using key for faster access
        const groupedResponse = (0, array_utils_1.groupByKey)(response.data, 'location_1_city');
        const dataToBeReturned = {
            city: city,
            fruits: [],
        };
        const dataByCity = groupedResponse[city];
        if (dataByCity && dataByCity.length) {
            dataByCity.forEach((value) => {
                dataToBeReturned.fruits.push(value.item);
            });
            return [dataToBeReturned];
        }
        return [];
    })
        .catch((err) => {
        const { message } = err;
        // retry while Network timeout or Network Error
        if (!(message.includes("timeout") || message.includes("Network Error"))) {
            return err;
        }
        if (count > retry) {
            console.log(err + 'executing with delay ' + delay);
            setTimeout(() => {
                retryRequestWithDelay(worker, city, delay * (retry + 1), count, retry + 1);
            }, delay);
        }
        else {
            console.log(err + 'executing with delay ' + delay);
            return err;
        }
    });
}
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const city = req.query.city;
    const worker = axiosClient.get('y6p2-px98.json', {
        params: { category: 'Fruit' },
    });
    try {
        const data = yield retryRequestWithDelay(worker, city, 1000, 2);
        res.json({ data });
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
