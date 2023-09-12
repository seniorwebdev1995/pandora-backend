import { json } from 'body-parser';
import { NextHandleFunction } from 'connect';
import { Request, Response } from 'express';

// This middleware is required for Stripe, and webhooks in general.
// https://wanago.io/2021/07/05/api-nestjs-stripe-events-webhooks/

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

export function rawBodyMiddleware(): NextHandleFunction {
  return json({
    verify: (request: RequestWithRawBody, response: Response, buffer: Buffer) => {
      if (request.url === '/webhook' && Buffer.isBuffer(buffer)) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
}
