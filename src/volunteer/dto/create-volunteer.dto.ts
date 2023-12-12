import { Escape } from 'class-sanitizer';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import * as sanitizeHtml from 'sanitize-html';

export class CreateVolunteerDto {
  @Escape()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  student_id: string;

  @Escape()
  @IsNotEmpty()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  session_id: string;
}
