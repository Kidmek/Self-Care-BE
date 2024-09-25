import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class LanguageGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Extract the 'Language' header
    const language = request.headers['language'];

    // Attach the language to the request object
    request.language = language;

    return true;
  }
}
