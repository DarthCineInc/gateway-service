import { Injectable, NestMiddleware } from "@nestjs/common";
import { GatewayController } from "./gateway.controller";
import { NextFunction, Request, Response } from "express";
import * as multer from "multer";

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
    constructor(private readonly gatewayController: GatewayController) {}

    use(req: Request, res: Response, next: NextFunction) {
        this.gatewayController.reverseProxy(req, res, next);
    }
}

export class MultipartFormMiddleware implements NestMiddleware {
    private upload = multer();
    use(req: Request, res: Response, next: NextFunction) {
        if (req.headers['content-type'] && (req.headers['content-type'] as string).includes("multipart/form-data")) {
                this.upload.any()(req, res, (err: any) => {
                    next();
                })
        } else {
            next();
        }
    }
}