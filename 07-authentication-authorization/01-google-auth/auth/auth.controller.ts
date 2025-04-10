import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Public } from "./public.decorator";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Get("google")
  @UseGuards(AuthGuard("google"))
  google() {
    return "ok";
  }

  @Public()
  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
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
  profile(@Request() request) {
    return request.user;
  }
}
