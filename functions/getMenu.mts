import { getStore } from "@netlify/blobs";
import { corsHeaders, corsResponse } from "../lib/corsResponse.mts";

export default async (req, context) => {

  if (req.method == "OPTIONS") return corsResponse;

  if (req.method !== "GET") return new Response(null, { status: 405 });

  try {
    const menuStore = getStore("menu");
    const menu = await menuStore.get("menu");
    return new Response(menu,
      {
        headers: { ...corsHeaders, 'Content-type': 'application/json' }
      });
  } catch (error) {
    return new Response(null, { status: 500, headers: corsHeaders });
  }
};
