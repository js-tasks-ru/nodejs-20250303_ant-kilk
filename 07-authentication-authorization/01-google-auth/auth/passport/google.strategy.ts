import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/users.service";
import { config } from "process";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get("GOOGLE_CLIENT_ID"),
      clientSecret: configService.get("GOOGLE_CLIENT_SECRET"),
      scope: ["profile"],
      callbackURL: "http://127.0.0.1:3000/auth/google/callback",
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    let user = await this.usersService.findOne(profile.id);
    if (!user) {
      user = await this.usersService.create({
        id: profile.id,
        displayName: profile.displayName,
        avatar: profile.photos[0]?.value,
      });
    }

    return user;
  }
}
