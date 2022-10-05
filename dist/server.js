"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const home_route_1 = require("./routes/home.route");
dotenv_1.default.config();
mongoose_1.default.connect(process.env.DATABASE_URL);
const db = mongoose_1.default.connection;
db.on('error', (err) => {
    console.error('[database]:', err);
});
db.once('connected', () => {
    console.log('[database]: database connected');
});
const port = process.env.PORT || '3000';
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', home_route_1.homeRoutes);
app.listen(port, () => {
    console.log(`[server]: server is listening on port:${port}`);
});
