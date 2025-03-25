import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LoggingMiddleware } from "./middlewares/logging.middleware";
import { TasksModule } from "./tasks/tasks.module";

@Module({
  imports: [TasksModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes("*");
  }
}
