import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = [
  '/admin/:path*', 
  '/api/admin/:path*'
];