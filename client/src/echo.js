import Echo from "laravel-echo";
import Pusher from "pusher-js";

window.Pusher = Pusher;

const token = localStorage.getItem("token");

const echo = new Echo({
  broadcaster: "pusher",
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
  authEndpoint: "/api/broadcasting/auth",
  auth: {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  },
});

export default echo;
