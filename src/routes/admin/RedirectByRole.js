import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const RedirectByRole = () => {
  const user = useSelector((state) => state.user?.currentUser);
  const history = useHistory();

  useEffect(() => {
    if (!user) return;

    switch (user.user_role) {
      case "admin":
      case "owner":
      case "agent_support":
        history.replace("/admin/dashboard"); // or your admin dashboard
        break;
      case "agent_dispatch":
        history.replace("/admin/commandes");
        break;
      case "agent_finance":
        history.replace("/admin/commandes");
        break;
      case "agent_collect":
        history.replace("/admin/commandes");
        break;
      case "agent_chef":
        history.replace("/admin/commandes");
        break;
      case "driver":
        history.replace("/admin/stats/dashboard");
        break;
      default:
        history.replace("/not-authorized");
    }
  }, [user, history]);

  return null; // Optional loading spinner if needed
};

export default RedirectByRole;
