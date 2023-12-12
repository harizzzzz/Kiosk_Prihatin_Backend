import { PartialType } from '@nestjs/mapped-types';
import { CreateVSessionDto } from './create-v_session.dto';

export class UpdateVSessionDto extends PartialType(CreateVSessionDto) {}
