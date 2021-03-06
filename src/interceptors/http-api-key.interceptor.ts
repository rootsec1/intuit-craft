import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HTTPAPIKeyInterceptor implements NestInterceptor {
  constructor(private config: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    if (request.headers['apikey'] !== undefined) {
      const authToken = request.headers['apikey'];
      if (authToken === this.config.get<string>('API_KEY')) {
        return next.handle();
      }
    }
    throw new UnauthorizedException();
  }
}
