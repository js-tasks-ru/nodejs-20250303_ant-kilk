import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { UsersService } from "users/users.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async login(user: User) {
    console.log("user", user);
    const accessToken = await this.generateAccessToken(user);
    console.log("accessToken", accessToken);
    const refreshToken = await this.generateRefreshToken(user);
    console.log("refreshToken", refreshToken);
    await this.usersService.saveRefreshToken(Number(user.id), refreshToken);
    const payload = { id: user.id, displayName: user.displayName };
    console.log("payload", payload);
    return {
      token: this.jwtService.sign(payload),
    };
  }

  generateAccessToken(user: User) {
    return this.jwtService.signAsync({
      sub: user.id,
      username: user.displayName,
      role: "user",
    });
  }

  generateRefreshToken(user: User) {
    return this.jwtService.signAsync(
      { username: user.displayName, type: "refresh" },
      { expiresIn: this.configService.get("jwt.refreshTokenExpires") },
    );
  }
}
