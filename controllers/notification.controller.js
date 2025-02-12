import serviceAccount from "./firebase-adminsdk.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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
