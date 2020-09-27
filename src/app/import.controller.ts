import {Body, Controller, Get, Inject, Post} from '@nestjs/common';
import {Import, ImportType} from "./types";
import {CreateImportDto} from "./import.dto";
import {ProcessingService} from "./processing.service";

@Controller('import')
export class ImportController {
  public static readonly delaySecMap: Record<ImportType, number> = {
    evernote: 60,
    pdf: 60,
    wattpad: 60,
    word: 60,
  }

  constructor(@Inject('ImportProcessingService') private readonly processingService: ProcessingService<Import>) {
  }

  @Get('/by-states')
  getListByStates() {
    return this.processingService.getListByStates();
  }

  @Post()
  create(@Body() newImport: CreateImportDto): Import {
    return this.processingService.create(newImport);
  }
}
