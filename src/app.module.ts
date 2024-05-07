import { Module } from '@nestjs/common';
import { GatewayModule } from './gateway/gateway.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';


@Module({
  imports: [
    GatewayModule,
    ConfigModule.forRoot(),
    MulterModule.register({
      dest: './uploads', // diretório onde os arquivos serão armazenados temporariamente
    })],
  controllers: [],
  providers: [],
})
export class AppModule {}
