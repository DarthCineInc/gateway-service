import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayMiddleware, MultipartFormMiddleware } from './gateway.middleware';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { GatewayConfiguration } from './gateway.config';
import { GatewayRequestService } from './gateway.request.service';

@Module({
  controllers: [],
  providers: [
    GatewayController, // Used in the middleware
    GatewayService,
    GatewayMiddleware,
    GatewayConfiguration,
    GatewayRequestService
  ]
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MultipartFormMiddleware)
      .forRoutes('*')
    consumer
      .apply(GatewayMiddleware)
      .forRoutes('*')
  }
}
