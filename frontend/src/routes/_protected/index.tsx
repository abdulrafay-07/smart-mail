import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/")({
  component: Index,
})

function Index() {
  return (
    <div>
      You are logged in
    </div>
  )
};
