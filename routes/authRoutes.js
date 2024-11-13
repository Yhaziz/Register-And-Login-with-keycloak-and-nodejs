const express = require("express");
const axios = require("axios");
const router = express.Router();

const keycloakBaseUrl = "http://127.0.0.1:8080";
const realm = "nodeauth";
const clientId = "nodeauth-api";
const clientSecret = "UTaDLdaPjCMg4pTia6yhbwoGKdpNUEal";

async function getAccessToken() {
  try {
    const response = await axios.post(
      `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    return response.data.access_token;
  } catch (error) {
    console.error(
      "Error fetching access token:",
      error.response?.data || error.message
    );
    throw new Error("Failed to authenticate with Keycloak");
  }
}

router.post("/register", async (req, res) => {
  const { username, firstName, lastName, email, password, role } = req.body;

  try {
    const token = await getAccessToken();

    const response = await axios.post(
      `${keycloakBaseUrl}/admin/realms/${realm}/users`,
      {
        username: username,
        enabled: true,
        firstName: firstName,
        lastName: lastName,
        email: email,
        credentials: [{ type: "password", value: password, temporary: false }],
        attributes: { role: role },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: response.data.id,
    });
  } catch (error) {
    console.error(
      "Error during registration:",
      error.response?.data || error.message
    );
    res.status(500).json({
      message: "Error registering user",
      error: error.response?.data || error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const tokenResponse = await axios.post(
      `${keycloakBaseUrl}/realms/${realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "password",
        username: email,
        password: password,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    res.status(200).json({
      message: "Login successful",
      token: tokenResponse.data.access_token,
    });
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error logging in",
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
