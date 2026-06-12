import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiCreatedResponse({ description: 'User successfully registered.' })
  @ApiConflictResponse({ description: 'Email is already registered.' })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid input data.',
  })
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return {
      ...(result.user ? result : result),
      message: result.message ?? 'Registration successful',
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiOkResponse({
    description: 'Login successful. Returns access and refresh tokens.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password.' })
  @ApiBadRequestResponse({ description: 'Validation failed.' })
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Refresh access token using refresh token' })
  @ApiOkResponse({
    description: 'Token refreshed successfully. Returns a new access token.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired refresh token.' })
  async refresh(@CurrentUser() user: User) {
    return this.authService.refresh(user);
  }

  @UseGuards(JwtAccessGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Logout and invalidate refresh token' })
  @ApiOkResponse({ description: 'Logged out successfully.' })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token.' })
  async logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @UseGuards(JwtAccessGuard)
  @Get('me')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiOkResponse({
    description: 'Current user profile retrieved successfully.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token.' })
  getMe(@CurrentUser() user: User) {
    return this.authService.getMe(user);
  }

  @UseGuards(JwtAccessGuard)
  @Put('profile')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Update user profile info' })
  @ApiOkResponse({ description: 'Profile updated successfully.' })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid input data.',
  })
  @ApiUnauthorizedResponse({ description: 'Invalid or missing access token.' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() dto: UpdateProfileDto,
  ) {
    const updatedUser = await this.authService.updateProfile(user.id, dto);
    return {
      user: updatedUser,
      message: 'Profile updated successfully',
    };
  }
}
