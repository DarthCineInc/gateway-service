import { Injectable, NestMiddleware } from "@nestjs/common";
import { GatewayController } from "./gateway.controller";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
    constructor(private readonly gatewayController: GatewayController) {}

    use(req: Request, res: Response, next: NextFunction) {
        this.gatewayController.reverseProxy(req, res, next);
    }
}