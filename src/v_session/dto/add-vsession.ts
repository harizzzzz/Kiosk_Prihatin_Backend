import { Escape } from "class-sanitizer";
import { Transform, TransformFnParams } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";
import * as sanitizeHtml from 'sanitize-html';

export class addVSessionDto{
    @Escape()
    @IsNotEmpty()
    @Transform((params:TransformFnParams)=>sanitizeHtml(params.value))
    VSession_name:string

    @Escape()
    @IsNotEmpty()
    @Transform((params:TransformFnParams)=>sanitizeHtml(params.value))
    VSession_desc:string

    @Escape()
    @IsNotEmpty()
    @Transform((params:TransformFnParams)=>sanitizeHtml(params.value))
    VSession_limit:string

    @Escape()
    @IsNotEmpty()
    @Transform((params:TransformFnParams)=>sanitizeHtml(params.value))
    VSession_date:string

    @Escape()
    @Transform((params:TransformFnParams)=>sanitizeHtml(params.value))
    VSession_hour:string
}