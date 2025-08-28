export default function handler(request, response) {
  // Only allow GET requests
  if (request.method !== 'GET') {
    return response.status(405).json({
      error: 'Method not allowed',
      allowedMethods: ['GET']
    });
  }

  // Set caching headers to prevent caching of health check responses
  response.setHeader('Cache-Control', 'no-cache');
  response.setHeader('Pragma', 'no-cache');
  response.setHeader('Expires', '0');

  // Return health check response
  return response.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'PlayRush API',
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    message: 'Health check successful'
  });
}