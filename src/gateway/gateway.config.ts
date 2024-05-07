import { Injectable } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
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
            authorization?: boolean,
            match: {
                path: string,
                methods: string[];
            },
            transforms?: {
                pathPattern: string
            }
        }
    }
}

interface RoutesTable {
    [url: string]: {
        [method: string]: {
            authorization: boolean,
            forwardUrls: string[],
        }
    }
}

@Injectable()
export class GatewayConfiguration {
    private readonly gatewaySettings: GatewaySettings;
    public readonly routesTable: RoutesTable;

    private readonly gatewaySettingsBaseFileName = 'gatewaySettings';
    private readonly gatewaySettingsBaseFileExtension = 'json';

    constructor() {
        if (!this.gatewaySettings) {
            this.gatewaySettings = this.loadSettings();
            this.settingsHealth();
            this.routesTable = this.mapRoutes();
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

    private mapRoutes() : RoutesTable {
        const table = {} as RoutesTable;
        
        for (let [_, value] of Object.entries(this.gatewaySettings.routes)) {
            const path = value.match.path;
            if (!(path in table)) table[path] = {}

            for (let method of value.match.methods) {
                table[path][method] = {
                    authorization: Boolean(value.authorization),
                    forwardUrls: this.getRoutesWithClusterHost(value.clusterName, path, value.transforms?.pathPattern)
                }
            }
        }   

        return table;
    }

    private getRoutesWithClusterHost(clusterName: string, url: string, transform?: string) : string[] {
        return this.gatewaySettings.clusters[clusterName].destinations.map((destination: string) => {
            return `${destination}${transform ? transform : url}`
        });
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