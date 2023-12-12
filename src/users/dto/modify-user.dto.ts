import { Escape } from "class-sanitizer"
import { Transform, TransformFnParams } from "class-transformer"
import { IsAlphanumeric, IsNotEmpty, IsString, MinLength } from "class-validator"
import * as sanitizeHtml from 'sanitize-html'

export class ModifyUserDto {
  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  full_name: string

  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  password_hash: string

  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  student_id: string

  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  email: string

}
