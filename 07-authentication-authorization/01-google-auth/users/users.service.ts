import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  findOne(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  create(payload: Partial<User>) {
    const user = new User();
    user.id = payload.id;
    user.displayName = payload.displayName;
    user.avatar = payload.avatar;
    user.email = payload.email;
    return this.userRepository.save(user);
  }

  async saveRefreshToken(id: string, refreshToken: string) {
    console.log("saveRefreshToken", id, refreshToken);
    await this.userRepository.update(
      { id: id.toString() },
      { refreshToken: refreshToken },
    );
  }
}
