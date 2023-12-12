import { Escape } from "class-sanitizer";
import { Transform, TransformFnParams } from "class-transformer";
import { IsNotEmpty, IsNumber, MinLength } from "class-validator";
import * as sanitizeHtml from 'sanitize-html'

export class ResetPasswordDTO {
  @MinLength(8)
  @IsNotEmpty()
  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  password: string

  @IsNotEmpty()
  @IsNumber()
  @Escape()
  token: number
}
