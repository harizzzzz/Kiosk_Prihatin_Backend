import { Escape } from "class-sanitizer"
import { Transform, TransformFnParams } from "class-transformer"
import { IsNotEmpty } from "class-validator"
import * as sanitizeHtml from 'sanitize-html'

export class RefreshDTO {
  @IsNotEmpty()
  @Escape()
  @Transform((params: TransformFnParams) => sanitizeHtml(params.value))
  refreshToken: string
}
