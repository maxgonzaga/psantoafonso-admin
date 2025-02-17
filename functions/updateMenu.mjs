import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const menuStore = getStore("menu");
  try {
    const requestBody = await req.json();
    menuStore.setJSON("menu", requestBody);
    const response = new Response(requestBody, { status: 204 });
    return response;
  } catch (error) {
    const menu = menuStore.get("menu");
    const response = new Response(menu, { status: 500, error });
    return response;
  }
};
