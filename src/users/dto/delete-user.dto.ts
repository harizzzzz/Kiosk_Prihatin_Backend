import { Escape } from 'class-sanitizer';
import { Transform, TransformFnParams } from 'class-transformer';
import {
  IsAlphanumeric,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class DeleteUserDto {
  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  admin_id: string;

  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  user_id: string;
}
