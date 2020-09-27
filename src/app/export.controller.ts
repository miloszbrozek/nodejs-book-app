import {Body, Controller, Get, Inject, Post} from '@nestjs/common';
import {Export, ExportType} from "./types";
import {CreateExportDto} from "./export.dto";
import {ProcessingService} from "./processing.service";

@Controller('export')
export class ExportController {
  public static readonly delaySecMap: Record<ExportType, number> = {
    epub: 10,
    pdf: 25,
  }

  constructor(@Inject('ExportProcessingService') private readonly processingService: ProcessingService<Export>) {
  }

  @Get('/by-states')
  getListByStates() {
    return this.processingService.getListByStates();
  }

  @Post()
  create(@Body() newExport: CreateExportDto): Export {
    return this.processingService.create(newExport);
  }
}
