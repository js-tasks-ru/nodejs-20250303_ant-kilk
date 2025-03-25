import { BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: string): number {
    if (isNaN(parseInt(value, 10))) {
      throw new BadRequestException(`"${value}" не является числом`);
    }
    return parseInt(value, 10);
  }
}
