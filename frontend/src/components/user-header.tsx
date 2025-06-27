interface UserHeaderProps {
  name: string | null;
};

export const UserHeader = ({
  name = "User",
}: UserHeaderProps) => {
  return (
    <div className="space-y-1">
      <h1 className="text-3xl font-bold tracking-tight">Good morning, {name} 👋</h1>
      <p className="text-muted-foreground text-lg">Here's what's happening with your emails today</p>
    </div>
  )
};
