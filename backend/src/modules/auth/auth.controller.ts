import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Res,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../users/dto/login-user.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LocalAuthGuard } from '../../core/guards/local-auth.guard';
import { JwtAuthGuard } from '../../core/guards/jwt-auth.guard';
import { RefreshJwtGuard } from '../../core/guards/refresh-jwt.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Request, Response } from 'express';
import { UserPayload } from '../../core/interfaces/user-payload.interface';
import { TokenResponseDto } from './dto/token-response.dto'; // Nuevo DTO para refresh
import { RequestWithUser } from '../../core/interfaces/request-with-user.interface';
import { UserResponseDto } from '../users/dto/user-response.dto';
import { UsersService } from '../users/users.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Inicio de sesión exitoso',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas',
  })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponseDto> {
    const authData = await this.authService.login(loginUserDto);

    // Opcional: Setear cookies en lugar de devolver en el body
    response.cookie('access_token', authData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000, // 1 hora
    });

    response.cookie('refresh_token', authData.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 604800000, // 7 días
    });

    return authData;
  }

  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario registrado exitosamente',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'El email ya está registrado',
  })
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() createUserDto: CreateUserDto,
  ): Promise<AuthResponseDto> {
    return this.authService.register(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener nuevo access token' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refrescado exitosamente',
    type: TokenResponseDto, // Cambiado a TokenResponseDto
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token inválido o expirado',
  })
  @ApiBearerAuth()
  @UseGuards(RefreshJwtGuard)
  @Get('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Req() request: Request): Promise<TokenResponseDto> {
    // Tipo de retorno actualizado
    const refreshToken =
      request.cookies?.refresh_token ||
      request.headers['authorization']?.split(' ')[1];
    return this.authService.refreshToken(refreshToken);
  }

  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sesión cerrada exitosamente',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: RequestWithUser, // Usar la interfaz extendida
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    await this.authService.logout(request.user.sub);

    // Limpiar cookies
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return { message: 'Sesión cerrada exitosamente' };
  }

  @ApiOperation({ summary: 'Verificar sesión' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token válido',
    type: Object,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('verify')
  @HttpCode(HttpStatus.OK)
  verifyToken(@Req() request: RequestWithUser): UserPayload {
    return request.user;
  }

  @ApiOperation({ summary: 'Obtener perfil' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Obtener perfil',
    type: Object,
  })
  @ApiBearerAuth('access-token') // Vinculamos con el esquema configurado en Swagger
  @UseGuards(JwtAuthGuard) // Protegemos los endpoints con el guard de JWT
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() request: RequestWithUser): Promise<UserResponseDto> {
    const profile = await this.usersService.findByEmail(request.user.email);
    return profile;
  }
}
