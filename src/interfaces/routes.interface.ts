import { Request as ExpressRequest, Router } from "express";
import { Server as SoketServer } from "socket.io";

export interface Routes {
  path?: string;
  router: Router;
}

export interface Request extends ExpressRequest {
  io: SoketServer;
}
