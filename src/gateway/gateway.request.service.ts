import { Injectable } from "@nestjs/common";
import axios, { AxiosRequestConfig } from 'axios';
import { Request } from "express";

@Injectable()
export class GatewayRequestService {
    async forward(url: string, method: string, body: any) {
        const config = {
            url,
            method,
            data: body,
            validateStatus: status => true
        } as AxiosRequestConfig
        return await axios.request(config);
    }
}