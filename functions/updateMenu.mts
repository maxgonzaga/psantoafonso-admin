import { getStore } from "@netlify/blobs";
import corsResponse from "../lib/corsResponse.mts";

export default async (req, context) => {

  if (req.method == "OPTIONS") return corsResponse;

  if (req.method !== "POST") return new Response(null, { status: 405 });

  let requestBody: any = {};
  
  try {
    requestBody = await req.json();
  }
  catch (error) {
    return new Response(null, { status: 400 });
  }

  const headers = { 'Content-type': 'application/json' }
  try {
    const menuStore = getStore("menu");
    menuStore.setJSON("menu", requestBody);
    return new Response(JSON.stringify(requestBody), { status: 200, headers });
  } catch (error) {
    return new Response(null, { status: 500, headers });
  }
};
