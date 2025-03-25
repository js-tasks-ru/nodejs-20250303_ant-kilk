import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const hasAdminRole = request.headers["x-role"] === "admin";

    if (!hasAdminRole) {
      throw new ForbiddenException("Доступ запрещён: требуется роль admin");
    }

    return true;
  }
}
