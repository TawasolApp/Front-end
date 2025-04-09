import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { axiosInstance } from "../../../apis/axios";

const VerificationPendingForm = ({ type = null }) => {
  const { email } = useSelector((state) => state.authentication);

  const [canResend, setCanResend] = useState(true);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    let interval;
    if (!canResend && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [timer, canResend]);

  const handleResend = async () => {
    try {
      await axiosInstance.post(`/auth/resend-confirmation`, { email, type });
      setCanResend(false);
      setTimer(30); // 30-second cooldown
    } catch (err) {
      console.error(err);
    }
  };

  const serializeEmail = (email) => {
    return email[0] + "*****@" + email.split("@")[1];
  };

  return (
    <div>
      <h2 className="text-3xl font-semibold text-textContent mb-8">
        Email Verification Pending
      </h2>

      {/* Display Email */}
      <p className="text-lg text-textContent">
        A verification link was sent to{" "}
        <span className="font-semibold">{serializeEmail(email)}</span>. Please
        check your email and verify to continue.
      </p>
      {/* Info Text */}
      <p className="text-textPlaceholder text-lg my-2">
        If you don’t see the email in your inbox, check your spam folder. If
        it’s not there, the email address may not be confirmed, or it may not
        match an existing Tawasol account.
      </p>
      {type && (canResend ? (
        <div>
          <button
            type="button"
            onClick={handleResend}
            className="text-buttonSubmitEnable hover:underline inline-block text-lg my-2 font-medium p-1 rounded-full transition duration-200 ease-in-out"
          >
            Resend code
          </button>
        </div>
      ) : (
        <p className="text-textPlaceholder text-lg">
          You can resend in {timer} second{timer !== 1 ? "s" : ""}
        </p>
      ))}
    </div>
  );
};

export default VerificationPendingForm;
