export default function handler(request, response) {
  response.setHeader('Content-Type', 'application/json');
  response.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'PlayRush API'
  });
}