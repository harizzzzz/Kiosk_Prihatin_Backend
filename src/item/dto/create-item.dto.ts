import { Escape } from "class-sanitizer"
import { Transform, TransformFnParams } from "class-transformer"
import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
import * as sanitizeHtml from 'sanitize-html'


export class CreateItemDto {
    @IsString()
    @IsNotEmpty()
    @Escape()
    @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    item_name: string
  
    @IsString()
    @IsNotEmpty()
    @Escape()
    @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
    item_desc: string
  
}
