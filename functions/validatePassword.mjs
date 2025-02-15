export default async (req, context) => {
  const request = await req.json();
  if (request.password === "arthur_pafonso_admin_2025")
  {
    const body = { isAuthorized: true };
    return new Response(JSON.stringify(body), { status: 200 });
  }
  else
  {
    const body = { isAuthorized: false };
    return new Response(JSON.stringify(body), { status: 401 });
  }
};
