import type { Context } from "@netlify/functions";
import { corsResponse } from "../lib/corsResponse.mts";

export default async (req: Request, context: Context) => {
  if (req.method == "OPTIONS") return corsResponse;

  if (req.method !== "POST") return new Response(null, { status: 405 });

  let request: any = {};
  
  try {
    request = await req.json();
  }
  catch (error) {
    return new Response(null, { status: 400 });
  }

  const headers = {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': '*' 
  }
  if ((request.password === "arthur_pafonso_admin_2025") && (request.username === "arthur")) {
    const body = { isAuthorized: true };
    return new Response(JSON.stringify(body), { status: 200, headers });
  }
  else {
    const body = { isAuthorized: false };
    return new Response(JSON.stringify(body), { status: 401, headers });
  }
};
