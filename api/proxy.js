const axios = require("axios");
const cors = require("cors"); // Import the cors module

export default async (req, res) => {
  const targetUrl = "https://54.253.2.130" + req.url; // Forward request path to the target URL

  // CORS options to allow specific origins
  const allowedOrigins = [
    "http://localhost:4200", // Allow localhost
    "https://spotify-ui-gules.vercel.app", // Allow Vercel URL
  ];

  // Set CORS headers manually or use the `cors` module
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
  }

  // Handle preflight requests (OPTIONS method)
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Forward the request using axios
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: req.headers,
      data: req.body, // Forward POST data
    });

    // Set response status and headers
    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Send the response data
    res.send(response.data);
  } catch (error) {
    console.error("Error while forwarding request:", error);
    res.status(500).send("Internal Server Error");
  }
};
