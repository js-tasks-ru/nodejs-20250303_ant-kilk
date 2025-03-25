import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
} from "@nestjs/common";
import { map } from "rxjs";

@Injectable()
export class ApiVersionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    const now = Date.now();
    return next.handle().pipe(
      map((data) => {
        const executionTime = Date.now() - now;
        const execTimeStr = `${executionTime}ms`;
        console.log(`Request time: ${execTimeStr}`);
        return {
          ...data,
          apiVersion: "1.0",
          executionTime: execTimeStr,
        };
      }),
    );
  }
}
