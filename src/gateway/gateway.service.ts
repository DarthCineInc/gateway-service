import { Injectable } from '@nestjs/common';
import { GatewayConfiguration } from './gateway.config';

@Injectable()
export class GatewayService {
    constructor(private gatewayConfiguration: GatewayConfiguration) {}
    index() {
        console.log("Settings")
        console.log(this.gatewayConfiguration.gatewaySettings)
        return {
            'response': "Hello World"
        } 
    }
}
