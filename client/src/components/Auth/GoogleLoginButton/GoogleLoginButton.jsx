import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import userService from "../../../services/userService";
import { encryptedUserData, getRoleAfterLogin } from "../../../utils/auth";
import "./GoogleLoginButton.css";

function GoogleLoginButton({ actionText = "signin_with" }) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleConfigError, setGoogleConfigError] = useState("");
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const googleInitRef = useRef(false);
  const googleScriptId = "google-gsi-script";
  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  useEffect(() => {
    if (!googleClientId || googleInitRef.current) return undefined;

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) return;

      if (process.env.NODE_ENV === "development") {
        console.info("Google Login config:", {
          origin: window.location.origin,
          clientId: googleClientId,
        });
      }

      try {
        googleInitRef.current = true;
        setGoogleConfigError("");

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            if (!response?.credential) return;

            try {
              setIsGoogleLoading(true);
              const result = await userService.googleLogin(response.credential);
              toast.success(result?.message || "Xác thực Google thành công");
              encryptedUserData(result);
              const role = getRoleAfterLogin(result);
              navigate(role);
            } catch (error) {
              toast.error(error.message || "Xác thực Google thất bại");
            } finally {
              setIsGoogleLoading(false);
            }
          },
        });

        googleButtonRef.current.innerHTML = "";
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: document.documentElement.getAttribute("data-theme") === "light"
            ? "outline"
            : "filled_black",
          size: "large",
          text: actionText,
          shape: "rectangular",
          logo_alignment: "left",
          width: 360,
        });
      } catch (error) {
        googleInitRef.current = false;
        setGoogleConfigError(
          `Không thể tải Google Login. Kiểm tra OAuth client đã thêm origin ${window.location.origin}.`,
        );
        if (process.env.NODE_ENV === "development") {
          console.error("Google Login initialization failed:", error);
        }
      }
    };

    const existingScript = document.getElementById(googleScriptId);
    if (existingScript) {
      if (window.google?.accounts?.id) {
        initializeGoogle();
      } else {
        existingScript.addEventListener("load", initializeGoogle, { once: true });
      }
      return undefined;
    }

    const script = document.createElement("script");
    script.id = googleScriptId;
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    script.onerror = () => {
      setGoogleConfigError("Không tải được thư viện Google Login. Vui lòng kiểm tra kết nối mạng.");
    };
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
    };
  }, [googleClientId, navigate, actionText]);

  if (!googleClientId) return null;

  return (
    <div className="oauth-section">
      <div className="oauth-divider">
        <span>Hoặc</span>
      </div>
      <div className="google-button-wrap">
        {isGoogleLoading && <div className="google-loading">Đang xác thực Google...</div>}
        {googleConfigError && (
          <div className="google-config-error">{googleConfigError}</div>
        )}
        <div ref={googleButtonRef} className="google-button-slot" />
      </div>
    </div>
  );
}

export default GoogleLoginButton;
