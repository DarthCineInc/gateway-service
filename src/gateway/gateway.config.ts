import { Injectable } from '@nestjs/common';
const fs = require('fs');


interface GatewaySettings {
    clusters: [],
    routes: []
}

@Injectable()
export class GatewayConfiguration {
    public readonly gatewaySettings: GatewaySettings;

    private readonly gatewaySettingsBaseFileName = 'gatewaySettings';
    private readonly gatewaySettingsBaseFileExtension = 'json';

    constructor() {
        if (!this.gatewaySettings)
            this.gatewaySettings = this.loadSettings();
    }

    private getSettingsFileName(environment?: string) {
        return `./${this.gatewaySettingsBaseFileName}${environment ? `.${environment}` : ''}.${this.gatewaySettingsBaseFileExtension}`;
    }

    private loadSettings() : GatewaySettings {
        const defaultSettings = JSON.parse(fs.readFileSync(this.getSettingsFileName(), 'utf-8'));
        const environmentSettings = JSON.parse(fs.readFileSync(this.getSettingsFileName(process.env.NODE_ENV), 'utf-8'));
        return { ...defaultSettings, ...environmentSettings } as GatewaySettings;
    }
}