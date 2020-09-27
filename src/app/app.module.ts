import { Module } from '@nestjs/common';
import { ImportController } from './import.controller';
import {ExportController} from "./export.controller";
import {ProcessingService} from "./processing.service";

@Module({
  imports: [],
  controllers: [ImportController, ExportController],
  providers: [{
    provide: 'ExportProcessingService',
    useValue: new ProcessingService(ExportController.delaySecMap),
  }, {
    provide: 'ImportProcessingService',
    useValue: new ProcessingService(ImportController.delaySecMap),
  }],
})
export class AppModule {}
