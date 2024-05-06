import { Controller, Injectable} from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
@Controller()
export class GatewayController {
    constructor(private gatewayService: GatewayService) {}

    reverseProxy(req: Request, res: Response, next: NextFunction) {
        console.log(process.env.NODE_ENV)
        return res.json(this.gatewayService.index());
    }

}
