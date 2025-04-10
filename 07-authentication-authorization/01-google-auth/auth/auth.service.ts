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
  ) {}

  async login(user: User) {
    const accessToken = await this.generateAccessToken(user);
    await this.usersService.saveAccessToken(user.id, accessToken);
    const payload = { id: user.id, displayName: user.displayName };
    return { token: this.jwtService.sign(payload) };
  }

  generateAccessToken(user: User) {
    return this.jwtService.signAsync({
      id: user.id,
      username: user.displayName,
    });
  }
}
