import { Transform, TransformFnParams } from "class-transformer";
import { IsEmail, IsNotEmpty } from "class-validator";
import * as sanitizeHtml from 'sanitize-html'

export class ForgetPasswordDTO {
  @IsNotEmpty()
  @IsEmail()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  email: string
}
