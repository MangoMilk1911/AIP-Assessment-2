import admin, { ServiceAccount } from "firebase-admin";

// Get the service account
import serviceAccount from "../../service-account.json";

// Init a firebase app using the service acc
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  databaseURL: "https://aip-assessment-2.firebaseio.com",
});

export const auth = admin.auth();
