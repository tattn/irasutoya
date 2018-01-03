import * as irasutoya from "./irasutoya";
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
      const detail = await irasutoya.searchImage(query);
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
