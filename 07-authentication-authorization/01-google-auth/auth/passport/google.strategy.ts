import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { Injectable } from "@nestjs/common";
import { UsersService } from "users/users.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      clientID: configService.get("oauth.google.clientID"),
      clientSecret: configService.get("oauth.google.clientSecret"),
      callbackURL: configService.get("oauth.google.callbackURL"),
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile) {
    let user = await this.userService.findOne(profile.id);
    if (!user) {
      user = await this.userService.create({
        id: profile.id,
        displayName: profile.displayName,
        avatar: profile._json.picture,
      });

      return user;
    }
  }
}
