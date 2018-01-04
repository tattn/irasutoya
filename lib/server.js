"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const irasutoya = require("./irasutoya");
const express = require("express");
class Server {
    constructor() {
        this.app = express();
        this.routes();
    }
    routes() {
        let router = express.Router();
        router.get("/search", async (req, res, next) => {
            const query = req.query.query;
            const detail = await irasutoya.searchImage(query);
            res.json(detail);
        });
        router.get("/random", async (req, res, next) => {
            const detail = await irasutoya.randomImage();
            res.json(detail);
        });
        this.app.use("/", router);
    }
    listen() {
        const port = process.env.PORT || 3000;
        this.app.listen(3000, () => {
            console.log(`Running irasutoya server on ${port} port.`);
        });
    }
}
exports.Server = Server;
//# sourceMappingURL=server.js.map