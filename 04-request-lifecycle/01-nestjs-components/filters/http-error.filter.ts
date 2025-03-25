import {
  ArgumentsHost,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import * as fs from "fs";

export class HttpErrorFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const time = new Date().toISOString();
    const ctx = host.switchToHttp();
    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const response = ctx.getResponse();

    fs.appendFileSync(
      "errors.log",
      // http response status code
      `[${time}] ${httpStatus} - ${exception.message}\n`,
    );

    const responseBody = {
      statusCode: httpStatus,
      message: exception.message,
      timestamp: time,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
