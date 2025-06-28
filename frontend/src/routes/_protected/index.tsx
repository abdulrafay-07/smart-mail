import { useEffect } from "react";

import { createFileRoute } from "@tanstack/react-router";

import { useGetUserMails } from "@/features/user/api/use-get-user-mails";

import { UserHeader } from "@/components/user-header";
import { OverviewCards } from "@/components/overview-cards";
import { MailAnalytics } from "@/components/mail-analytics";
import { AISuggestions } from "@/components/ai-suggestions";
import { EmailsAndSearch } from "@/components/emails-and-search";

import { useUser } from "@/store/user";
import { useMails } from "@/store/mail";

export const Route = createFileRoute("/_protected/")({
  component: Index,
});


function Index() {
  const { name } = useUser();
  const { setMails } = useMails();

  const { data, isLoading } = useGetUserMails();

  useEffect(() => {
    if (data?.data.mails) {
      setMails(data.data.mails);
    }
  }, [data, setMails]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="flex-1 overflow-auto px-8 py-8 space-y-8">
      <UserHeader name={name} />
      <OverviewCards />
      <MailAnalytics />
      <AISuggestions />
      <EmailsAndSearch />
    </div>
  )
};
