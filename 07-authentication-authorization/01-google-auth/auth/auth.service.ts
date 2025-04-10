import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { UsersService } from "../users/users.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async login(user: User) {
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);
    await this.usersService.saveRefreshToken(user.id, refreshToken);
    const payload = { id: user.id, displayName: user.displayName };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  generateAccessToken(user: User) {
    return this.jwtService.signAsync({
      id: user.id,
      username: user.displayName,
    });
  }

  generateRefreshToken(user: User) {
    return this.jwtService.signAsync(
      { username: user.displayName, type: "refresh" },
      { expiresIn: this.configService.get("jwt.refreshTokenExpires") },
    );
  }
}
