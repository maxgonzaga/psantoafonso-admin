import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const menuStore = getStore("menu");
  try {
    const requestBody = await req.json();
    menuStore.setJSON("menu", requestBody);
    const response = new Response(requestBody);
    return response;
  } catch (error) {
    const response = new Response({ status: 500 });
    return response;
  }
};
