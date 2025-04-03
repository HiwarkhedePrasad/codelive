import Avatar from "react-avatar";

const Client = ({ username }) => {
  return (
    <div className="flex flex-col items-center w-20">
      <Avatar name={username} size={50} round="14px" />
      <span className="text-sm font-medium text-white truncate w-full text-center">
        {username.length > 10 ? `${username.substring(0, 10)}...` : username}
      </span>
    </div>
  );
};

export default Client;
