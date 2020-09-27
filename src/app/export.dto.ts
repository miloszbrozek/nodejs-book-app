import {IsIn, IsNotEmpty} from 'class-validator';
import {ExportType, exportTypeValues} from "./types";

export class CreateExportDto {
    @IsNotEmpty()
    bookId: string;
    @IsIn([...exportTypeValues])
    type: ExportType;
}



