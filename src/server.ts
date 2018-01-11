import * as api from "./api";
import * as express from "express";
import fetch from "node-fetch";

export class Server {
  public app: express.Application;

  public constructor() {
    this.app = express();
    this.routes();
  }

  private routes(): void {
    let router = express.Router();
    router.get("/search", async (req, res, next) => {
      const query = req.query.query;
      const detail = await api.search(query);
      res.json(detail);
    });
    router.get("/random", async (req, res, next) => {
      const raw = req.query.raw;
      const detail = await api.randomImage();
      if (raw === "true") {
        const image = await fetch(detail.imageUrl);
        res.writeHead(200, {"Content-Type": "image/png"});
        res.end(await image.buffer());
      } else {
        res.json(detail);
      }
    });
    this.app.use("/", router);
  }

  public listen(): void {
    const port = process.env.PORT || 3000;
    this.app.listen(3000, () => {
      console.log(`Running irasutoya server on ${port} port.`);
    });
  }
}
