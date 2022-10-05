"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const fruits_route_1 = require("./routes/fruits.route");
const home_route_1 = require("./routes/home.route");
dotenv_1.default.config();
const port = process.env.PORT || '3000';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', home_route_1.homeRoutes);
app.use('/fruits', fruits_route_1.fruitRoutes);
app.listen(port, () => {
    console.log(`[server]: server is listening on port:${port}`);
});
