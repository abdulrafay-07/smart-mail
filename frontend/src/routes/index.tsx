import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
})

function Index() {
  const isLoggedIn = false; // Call api to check this
  
  const navigate = useNavigate();
  if (!isLoggedIn) {
    navigate({
      to: "/auth",
    });
  };

  return (
    <div>
      You are logged in
    </div>
  )
};
