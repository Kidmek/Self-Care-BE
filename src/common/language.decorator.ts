import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Custom decorator to extract 'language' from the request
export const LanguageDec = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.language; // Return the 'language' attached by the guard
  },
);
