const corsResponse: Response = new Response(
  null,
  {
    status: 204,
    headers:
    {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*' ,
      'Access-Control-Max-Age': '1314000'
    } 
  }
);

export default corsResponse;
