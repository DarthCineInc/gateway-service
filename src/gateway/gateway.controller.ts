import { Controller, Injectable, UseInterceptors} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
@Controller()
export class GatewayController {
    constructor(private gatewayService: GatewayService) {}

    async reverseProxy(req: Request, res: Response, next: NextFunction) {
        if (req.originalUrl == "/favicon.ico") return "OK"; // DEV Fix

        const response = await this.gatewayService.forwardRequest(req, res);
        return res.header(response.headers).status(response.status).json(response.data);
    }

}
