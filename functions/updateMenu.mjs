import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const menuStore = getStore("menu");
  const headers = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*', 'Access-Control-Allow-Headers': '*' };
  try {
    const requestBody = await req.json();
    menuStore.setJSON("menu", requestBody);
    const response = new Response(
      JSON.stringify(requestBody),
      {
        status: 200,
        headers
      });
    return response;
  } catch (error) {
    const response = new Response(null, { status: 500, headers });
    return response;
  }
};
