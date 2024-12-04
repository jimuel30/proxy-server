// api/proxy.js
const axios = require("axios"); // Ensure to install axios

export default async (req, res) => {
  const targetUrl = "https://54.253.2.130" + req.url; // Forward request path to the target URL

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
