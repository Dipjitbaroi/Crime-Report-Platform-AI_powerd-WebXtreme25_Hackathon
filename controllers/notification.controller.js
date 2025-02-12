import serviceAccount from "./firebase-adminsdk.json";
import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.cert({
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN,
  }),
});

const userTokens = {
  user1: "FCM_TOKEN_1",
  user2: "FCM_TOKEN_2",
};

export const sendNotificationTospecificUser = async (req, res) => {
  const { userId, title, message } = req.body;

  if (!userTokens[userId]) {
    return res.status(404).json({ error: "User not found" });
  }

  const payload = {
    notification: {
      title,
      body: message,
    },
    token: userTokens[userId],
  };

  try {
    await admin.messaging().send(payload);
    res.json({ success: true, message: "Notification sent" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const sendNotificationToAll = async (req, res) => {
  const { title, message } = req.body;

  const tokens = Object.values(userTokens);

  const payload = {
    notification: {
      title,
      body: message,
    },
    tokens,
  };

  try {
    await admin.messaging().sendMulticast(payload);
    res.json({ success: true, message: "Notification sent to all users" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
