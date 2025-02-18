import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const menuStore = getStore("menu");
  try {
    const menu = await menuStore.get("menu");
    const response = new Response(menu,
      {
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    return response;
  } catch (error) {
    const response = new Response({ status: 500, headers: { 'Access-Control-Allow-Origin': '*' }});
    return response;
  }
};
