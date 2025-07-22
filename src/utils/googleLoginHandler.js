import axios from "axios";
import { setToken } from "./index";
import { servers } from "@/configs";

export const handleGoogleLogin = async (googleToken, showNotification, navigate) => {
  try {
    const res = await axios.post(`${servers.main_api}/auth/googleSignup`, {
      token: googleToken,
    });

    setToken(res.data.token);
    showNotification("Signed in successfully with Google", "success");
    window.location = "/"
  } catch (err) {
    console.error(err);
    showNotification(
      err?.response?.data?.message || "Google sign-in failed",
      "error"
    );
  }
};
