import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt } from "passport-jwt";
import { Strategy } from "passport-jwt";

@Injectable()
export class JwtRTStrategy extends PassportStrategy(Strategy, 'jwt-rt') {
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


