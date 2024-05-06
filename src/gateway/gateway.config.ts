import { Injectable } from '@nestjs/common';
const fs = require('fs');


interface GatewaySettings {
    clusters: {
        [clusterName: string]: {
            destinations: string[]
        }
    },
    routes: {
        [routeName: string]: {
            clusterName: string,
            match: {
                path: string,
                methods: string[];
            },
            transforms?: {
                pathPattern: string
            }[]
        }
    }
}

@Injectable()
export class GatewayConfiguration {
    public readonly gatewaySettings: GatewaySettings;

    private readonly gatewaySettingsBaseFileName = 'gatewaySettings';
    private readonly gatewaySettingsBaseFileExtension = 'json';

    constructor() {
        if (!this.gatewaySettings) {
            this.gatewaySettings = this.loadSettings();
            this.settingsHealth();
        }
    }

    private getSettingsFileName(environment?: string) {
        return `./${this.gatewaySettingsBaseFileName}${environment ? `.${environment}` : ''}.${this.gatewaySettingsBaseFileExtension}`;
    }

    private loadSettings() : GatewaySettings {
        const defaultSettings = JSON.parse(fs.readFileSync(this.getSettingsFileName(), 'utf-8'));
        const environmentSettings = JSON.parse(fs.readFileSync(this.getSettingsFileName(process.env.NODE_ENV), 'utf-8'));
        return { ...defaultSettings, ...environmentSettings } as GatewaySettings;
    }

    private settingsHealth() : void {
        Object.entries(this.gatewaySettings.routes).forEach(([route, value]) => {
            if (!value.clusterName) throw new Error(`ROUTE ${route} NÃO POSSUI CLUSTER ATRELADO`)
            if (!(value.clusterName in this.gatewaySettings.clusters)) {
                throw new Error(`ROUTE ${route} CLUSTER NÃO EXISTE EM CLUSTERS`)
            }
            if (!value.match) throw new Error(`ROUTE ${route} NÃO POSSUI MATCH CONFIGURADO`)
        })
    }
}