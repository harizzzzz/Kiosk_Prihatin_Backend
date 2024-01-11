import { Escape } from 'class-sanitizer';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreateInventoryDto {
  @Escape()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  item_id: number;

  @Escape()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  quantity: number;
}
