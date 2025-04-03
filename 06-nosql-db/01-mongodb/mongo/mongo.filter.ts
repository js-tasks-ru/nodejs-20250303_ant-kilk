import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { Response } from "express";
import mongoose from "mongoose";

@Catch(mongoose.Error.ValidationError, mongoose.mongo.MongoError)
export class MongoFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let message = "Duplicate key error";

    if (exception instanceof mongoose.Error.ValidationError) {
      message = exception.message;
    } else if (
      exception instanceof mongoose.mongo.MongoError &&
      exception.code === 11000
    ) {
      message =
        "Duplicate key error: " + JSON.stringify(exception.addErrorLabel);
    }

    response.status(400).json({
      statusCode: 400,
      error: "Bad Request",
      message,
    });
  }
}
