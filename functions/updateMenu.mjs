import { getStore } from "@netlify/blobs";

export default async (req, context) => {
  const menuStore = getStore("menu");
  try {
    menuStore.setJSON("menu", req.json());
    const response = new Response(req.json(), { status: 204 });
    return response;
  } catch (error) {
    const response = new Response(menuStore.get("menu"), { status: 500 });
    return response;
  }
};
