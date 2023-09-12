import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { TokenPairOutputDto } from '../auth/dto/token.dto';
import { AppLogger } from '../logging/logging.service';
import GoogleTokenDto from './dto/google-token.dto';
import { GoogleService } from './google.service';

@Controller('auth/google')
export class GoogleOauthController {
  constructor(private logger: AppLogger, private readonly googleService: GoogleService) {
    this.logger.setContext(this.constructor.name);
  }

  @Post('/login')
  async googleLogin(@Body() body: GoogleTokenDto): Promise<TokenPairOutputDto> {
    const result = await this.googleService.loginGoogleUser(body.token);
    if (result) {
      return result;
    } else {
      throw new HttpException(
        {
          status: HttpStatus.UNAUTHORIZED,
          error: 'Error while logging in with google',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
