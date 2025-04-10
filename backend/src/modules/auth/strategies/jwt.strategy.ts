import { UserPayload } from '../../../core/interfaces/user-payload.interface';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'), // Asegúrate que esta línea esté
    });
  }

  async validate(payload: any): Promise<UserPayload> {
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
