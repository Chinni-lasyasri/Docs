import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { EditorGateway } from './editor/editor.gateway';

@Module({
  imports: [],
  // controllers: [AppController],
  providers: [EditorGateway],
  // providers: [AppService, EditorGateway],
})
export class AppModule {}
