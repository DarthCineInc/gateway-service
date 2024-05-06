import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [GatewayModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
