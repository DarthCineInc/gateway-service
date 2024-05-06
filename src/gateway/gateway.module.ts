import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayMiddleware } from './gateway.middleware';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { GatewayConfiguration } from './gateway.config';

@Module({
  controllers: [],
  providers: [
    GatewayController, // Used in the middleware
    GatewayService,
    GatewayMiddleware,
    GatewayConfiguration
  ]
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(GatewayMiddleware)
    .forRoutes('*')
  }
}
