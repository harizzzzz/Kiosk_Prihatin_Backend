import { Escape } from "class-sanitizer"
import { Transform, TransformFnParams } from "class-transformer"
import { IsAlphanumeric, IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator"
import * as sanitizeHtml from 'sanitize-html'

export class SignupDTO {

  @IsString()
  @IsNotEmpty()
  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  full_name: string

  @IsEmail()
  @IsNotEmpty()
  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  email: string

  @MinLength(8)
  @IsNotEmpty()
  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  password: string

  @IsAlphanumeric()
  @IsNotEmpty()
  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  student_id: string


}
