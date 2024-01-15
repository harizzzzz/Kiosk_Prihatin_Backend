import { Escape } from 'class-sanitizer';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class UpdateItemDto {
  @Escape()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  item_name: string;

  @Escape()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  item_desc: string;

  @Escape()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  item_imgLink: string;
}
