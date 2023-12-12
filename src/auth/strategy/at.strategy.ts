import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-jwt";

@Injectable()
export class JwtATStrategy extends PassportStrategy(Strategy, 'jwt-at') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "abcd",
    })
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username, fullname: payload.fullname, role: payload.role }
  }
}


