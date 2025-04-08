import lockIcon from "../../../../assets/icons/lock.svg";

const RestrictedProfilevisibility = ({ visibility }) => {
  const isPrivate = visibility === "private";

  return (
    <div className="text-center py-16 text-gray-700 px-4">
      <div className="flex justify-center mb-4">
        <img
          src={lockIcon}
          alt="Lock Icon"
          className="w-20 h-20 mx-auto mb-2 text-blue-600"
        />
      </div>
      <h2 className="text-2xl font-semibold mb-2">This Profile is Private</h2>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        {isPrivate
          ? "Only the profile owner can view this profile."
          : "Connect with this member to view their full profile and professional journey."}
      </p>
    </div>
  );
};

export default RestrictedProfilevisibility;
