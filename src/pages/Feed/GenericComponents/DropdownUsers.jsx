import { useState, useEffect } from "react";
import { axiosInstance } from "../../../apis/axios";
import ActorHeader from "./ActorHeader";

const DropdownUsers = ({ name, onSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/connections/users", {
          params: {
            name: name,
            page: 1,
            limit: 3,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (name.length > 0) {
      fetchUsers();
    } else {
      setUsers([]);
    }
  }, [name]);

  return (
    <>
      {users.length > 0 && (
        <div className="absolute z-50 bg-cardBackground rounded-lg shadow-lg border border-cardBorder mt-1 w-64 max-h-60 overflow-y-auto">
          {users.map((user, index) => (
            <button
              key={index}
              className="hover:bg-buttonIconHover p-2 w-full"
              onClick={() =>
                onSelect(user.userId, user.firstName, user.lastName)
              }
            >
              <ActorHeader
                authorId={user.id}
                authorName={`${user.firstName} ${user.lastName}`}
                authorBio={
                  user.headline.length > 25
                    ? user.headline.slice(0, 25) + "..."
                    : user.headline
                }
                authorPicture={user.profilePicture}
                iconSize={32}
                enableLink={false}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
};

export default DropdownUsers;
