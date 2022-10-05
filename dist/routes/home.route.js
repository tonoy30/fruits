"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeRoutes = void 0;
const express_1 = require("express");
const router = (0, express_1.Router)();
exports.homeRoutes = router;
router.get('/', (req, res) => {
    res.send('Hello From Home!');
});
