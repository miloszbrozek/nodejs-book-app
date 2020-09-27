import {IsIn, IsNotEmpty, IsUrl} from 'class-validator';
import {ImportType, importTypeValues} from "./types";

export class CreateImportDto {
    @IsNotEmpty()
    bookId: string;
    @IsIn([...importTypeValues])
    type: ImportType;
    @IsUrl()
    url: string;
}



