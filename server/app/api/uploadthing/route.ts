import { createRouteHandler } from "uploadthing/next";
import { uploadRouter } from "./core";
import { NextRequest } from "next/server";

const handler = createRouteHandler({
  router: uploadRouter,
});

export const { GET, POST } = {
  GET: handler.GET,
  POST: async (req: NextRequest) => {
    try {
      console.log("UploadThing POST request received");
      const response = await handler.POST(req);
      console.log("UploadThing POST response status:", response.status);
      
      // Log response body if it's an error
      if (response.status >= 400) {
        const responseText = await response.text();
        console.error("UploadThing error response:", responseText);
        
        // Return the original response with the error details
        return new Response(responseText, {
          status: response.status,
          headers: response.headers,
        });
      }
      
      return response;
    } catch (error) {
      console.error("UploadThing POST error:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      return new Response(JSON.stringify({ 
        error: "UploadThing POST error", 
        details: error instanceof Error ? error.message : String(error) 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
}; 