import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/models/user.model';
import { UserRole } from '../users/models/user-role.enum';

import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from '../../core/interfaces/user-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Cuenta desactivada');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // if (user.password != password) {
    //   throw new UnauthorizedException('Credenciales inválidas');
    // }

    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    // Actualizar lastLogin
    await this.usersService.update(user.id, {
      lastLogin: new Date(),
    } as Partial<User>);

    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    return {
      access_token: this.generateAccessToken(payload),
      refresh_token: this.generateRefreshToken(payload),
      user: this.mapToUserResponseDto(user),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<AuthResponseDto> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.usersService.findByEmail(
        createUserDto.email,
      );
      if (existingUser) {
        throw new ConflictException('El correo electrónico ya está registrado');
      }
      // Hash de la contraseña
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      // Crear usuario (asignando rol por defecto)
      const user = await this.usersService.create({
        ...createUserDto,
        password: hashedPassword,
        role: createUserDto.role || UserRole.CUSTOMER,
      });

      const payload: UserPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      return {
        access_token: this.generateAccessToken(payload),
        refresh_token: this.generateRefreshToken(payload),
        user: this.mapToUserResponseDto(user),
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new BadRequestException('El email ya está registrado');
      }
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findOne(payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Refresh token inválido');
      }

      const newPayload: UserPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      return {
        accessToken: this.generateAccessToken(newPayload),
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async logout(userId: number): Promise<void> {
    await this.usersService.updateRefreshToken(userId, null);
  }

  private generateAccessToken(payload: UserPayload): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get('JWT_EXPIRES_IN') || '1h',
    });
  }

  private generateRefreshToken(payload: UserPayload): string {
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRES_IN') || '7d',
    });

    // Almacenar el refresh token en la base de datos
    this.usersService.updateRefreshToken(payload.sub, refreshToken);

    return refreshToken;
  }

  private mapToUserResponseDto(user: Partial<User>): any {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
