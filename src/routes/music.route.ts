import { Router } from "express";
import IndexController from "@controllers/index.controller";
import { Routes } from "@interfaces/routes.interface";
import validationMiddleware from "@/middlewares/validation.middleware";
import { Music } from "@/dtos/music.dto";
import MuiscController from "@/controllers/music.controller";

class MusicRoute implements Routes {
  public path = "/music";
  public router = Router();
  public muiscController = new MuiscController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}/add`, validationMiddleware(Music, "body"), this.muiscController.addMusic);
  }
}

export default MusicRoute;
