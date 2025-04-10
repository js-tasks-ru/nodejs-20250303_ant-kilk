import {
  Controller,
  Get,
  Request,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { JwtGuard } from "./jwt.guard";
import { Public } from "./public.decorator";
import { GoogleOAuthGuard } from "./google-oauth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get("google")
  @UseGuards(GoogleOAuthGuard)
  google() {
    return "ok";
  }

  @Public()
  @Get("google/callback")
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(@Request() req) {
    const result = await this.authService.login(req.user);

    // Return an HTML payload that:
    // 1) Displays a message,
    // 2) Stores the token in localStorage,
    // 3) Redirects to /auth/profile.
    return `
    <html>
      <head>
        <title>Login Callback</title>
      </head>
      <body>
        <p>wait until login is complete</p>
        <script>
          localStorage.setItem('token', '${result.token}');
          window.location.href = '/';
        </script>
      </body>
    </html>
  `;
  }

  @Get("profile")
  @UseGuards(JwtGuard)
  profile(@Request() request) {
    const authHeader = request.headers["authorization"];
    if (!authHeader) {
      throw new UnauthorizedException("Authorization header is missing");
    }
    return request.user;
  }
}
