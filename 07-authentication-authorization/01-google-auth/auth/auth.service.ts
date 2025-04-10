import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async login(user: User) {
    const token = await this.jwtService.signAsync(
      {
        sub: user.id,
        displayName: user.displayName,
        avatar: user.avatar,
      },
      { secret: "killer-is-jim" },
    );

    return { token };
  }
}
