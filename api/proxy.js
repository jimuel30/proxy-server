const axios = require("axios");
const cors = require("cors"); // Import the cors module

export default async (req, res) => {
  const targetUrl = "https://13.211.92.181" + req.url; // Forward request path to the target URL

  // Log the incoming request URL and method
  console.log(`Incoming request: ${req.method} ${req.url}`);

  // CORS options to allow specific origins
  const allowedOrigins = [
    "http://localhost:4200", // Allow localhost
    "https://spotify-ui-gules.vercel.app", // Allow Vercel URL
  ];

  // Log the origin header from the incoming request
  const origin = req.headers.origin;
  console.log("Origin:", origin);

  // Set CORS headers manually or use the `cors` module
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
    console.log("CORS headers set for origin:", origin);
  } else {
    console.log("Origin not allowed:", origin);
  }

  // Handle preflight requests (OPTIONS method)
  if (req.method === "OPTIONS") {
    console.log("Handling preflight OPTIONS request.");
    return res.status(200).end();
  }

  try {
    // Log the request forwarding details
    console.log(`Forwarding request to: ${targetUrl}`);

    // Forward the request using axios
    const response = await axios({
      method: req.method,
      url: targetUrl,
      headers: req.headers,
      data: req.body, // Forward POST data
    });

    // Log the response status and headers
    console.log("Response received from target:", response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      console.log(`Response header: ${key} = ${value}`);
      res.setHeader(key, value);
    });

    // Send the response data
    res.status(response.status).send(response.data);
  } catch (error) {
    // Log the error details
    console.error("Error while forwarding request:", error);
    res.status(500).send("Internal Server Error");
  }
};
