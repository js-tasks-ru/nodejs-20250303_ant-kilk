import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { UsersService } from "users/users.service";
import { access } from "fs";

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: User) {
    const payload = { id: user.id, displayName: user.displayName };

    return {
      token: this.jwtService.sign(payload),
    };
  }
}
