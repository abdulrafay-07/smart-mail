import { createFileRoute } from "@tanstack/react-router";

import { UserHeader } from "@/components/user-header";
import { OverviewCards } from "@/components/overview-cards";

import { useUser } from "@/store/user";

export const Route = createFileRoute("/_protected/")({
  component: Index,
});

// Mock data for now
const chartData = [
  { day: "Mon", emails: 12, replied: 8 },
  { day: "Tue", emails: 19, replied: 15 },
  { day: "Wed", emails: 8, replied: 6 },
  { day: "Thu", emails: 25, replied: 18 },
  { day: "Fri", emails: 22, replied: 20 },
  { day: "Sat", emails: 5, replied: 4 },
  { day: "Sun", emails: 3, replied: 2 },
];

const categoryData = [
  { name: "Work", value: 45, color: "#3b82f6" },
  { name: "Personal", value: 25, color: "#10b981" },
  { name: "Shopping", value: 15, color: "#f59e0b" },
  { name: "Social", value: 10, color: "#ef4444" },
  { name: "Other", value: 5, color: "#8b5cf6" },
];

function Index() {
  const { name } = useUser();

  return (
    <div className="flex-1 overflow-auto px-8 py-8 space-y-8">
      <UserHeader name={name} />
      <OverviewCards />
    </div>
  )
};
