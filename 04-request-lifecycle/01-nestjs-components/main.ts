import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { HttpErrorFilter } from "filters/http-error.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new HttpErrorFilter(httpAdapterHost));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
