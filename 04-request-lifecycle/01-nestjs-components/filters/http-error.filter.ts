import { ArgumentsHost, ExceptionFilter } from "@nestjs/common";
import * as fs from "fs";

export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const time = new Date().toISOString();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    fs.appendFileSync(
      "errors.log",
      // http response status code
      `[${time}] ${exception.status} - ${exception.message}\n`,
    );

    response.status(400).json({
      statusCode: 400,
      message: "Описание ошибки",
      timestamp: time,
    });
  }
}
