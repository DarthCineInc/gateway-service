import { Injectable } from '@nestjs/common';
import { GatewayConfiguration } from './gateway.config';
import { Request, Response } from 'express';
import { GatewayException } from './gateway.exceptions';
import { GatewayRequestService } from './gateway.request.service';
import { AxiosResponse } from 'axios';

@Injectable()
export class GatewayService {
    
    constructor(private gatewayConfiguration: GatewayConfiguration, private requestService: GatewayRequestService) {}
    
    async forwardRequest(req: Request, res: Response) : Promise<AxiosResponse<any>> {
        const {uri, route} = this.findRoute(req.originalUrl, req.method);
        const forwardUrl = route.forwardUrls[0]; // Not implemented;
        return await this.requestService.forward(forwardUrl + uri, req.method, req.body);
    }

    private findRoute(url: string, method: string) {
        const {uri, route} = this.findUrl(url);
        if (!(method in route)) {
            throw new GatewayException(`Method ${method} not implemented for route ${route}`, 501);
        }
        return {uri, route: route[method]};
    }

    private findUrl(url: string) {
        for (let route of Object.keys(this.gatewayConfiguration.routesTable)) {
            if (url.startsWith(route))
                return {uri: url.replace(route, ''), route: this.gatewayConfiguration.routesTable[route]};
        }
        throw new GatewayException("Url Not Found", 404);
    }
}
