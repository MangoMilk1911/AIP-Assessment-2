import admin, { ServiceAccount } from "firebase-admin";

// Get the service account
import serviceAccount from "service-account.json";

if (!admin.apps.length) {
  // Init a firebase app using the service acc
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: "https://aip-assessment-2.firebaseio.com",
  });
}

export default admin;
