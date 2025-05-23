import React, { useEffect } from "react";
import { useSelector } from "react-redux";

function ContactInfoModal({ user, isOpen, onClose, isOwner }) {
  // Get email from Redux state
  const { email } = useSelector((state) => state.authentication);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const profileLink = `${window.location.origin}/users/${user._id}`;

  return (
    <div className="bg-modalbackground fixed inset-0 bg-black/40 z-50 flex justify-center items-start pt-24 px-4">
      <div className="bg-boxbackground rounded-lg w-full max-w-md shadow-xl relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-normaltext hover:text-companyheader text-2xl"
          title="Close"
          aria-label="Close modal"
        >
          &times;
        </button>
        {/* Header */}
        <div className="pt-4 px-4">
          <h2 className="text-lg font-semibold text-companyheader">
            {user.firstName} {user.lastName}
          </h2>
        </div>
        {/* Line after name */}
        <div className="border-b mt-2" />
        {/* Contact Info Heading */}
        <div className="px-4 pt-2 pb-3 ">
          <p className="text-sm text-normaltext font-semibold">Contact Info</p>
        </div>
        {/* Body */}
        <div className="p-4 space-y-4 text-sm text-normaltext">
          {/* Profile Link */}
          <div className="flex items-start gap-2">
            <span className="text-xl">🔗</span>
            <div className="flex flex-col">
              <span className="text-normaltext">
                {isOwner ? "Your Profile" : `${user.firstName}'s Profile`}
              </span>
              <a
                href={profileLink}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 hover:underline break-all"
              >
                {profileLink}
              </a>
            </div>
          </div>

          {/* Email */}
          {isOwner && (
            <div className="flex items-start gap-2">
              <span className="text-xl">✉️</span>
              <div className="flex flex-col">
                <span className="text-normaltext">Email</span>
                <a
                  href={`mailto:${email}`}
                  className="text-blue-600 hover:underline break-all"
                >
                  {email}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ContactInfoModal;
