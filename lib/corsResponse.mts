const corsResponse: Response = new Response(
  null,
  {
    status: 204,
    headers:
    {
      'Access-Control-Allow-Origin': 'http://localhost:8888',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*' ,
      'Access-Control-Max-Age': '1314000'
    } 
  }
);

export default corsResponse;
