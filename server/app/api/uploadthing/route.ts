import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "./core";

const { GET, POST } = createRouteHandler({
  router: uploadRouter,
});

export { GET, POST }; 