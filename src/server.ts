import * as api from "./api";
import * as express from "express";

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
      const detail = await api.randomImage();
      res.json(detail);
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
