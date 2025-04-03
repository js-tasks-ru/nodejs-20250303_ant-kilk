import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isValidObjectId, Types } from "mongoose";

@Injectable()
export class ObjectIDPipe implements PipeTransform {
  transform(value: string) {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`Invalid ObjectId: ${value}`);
    }
    return value;
  }
}
