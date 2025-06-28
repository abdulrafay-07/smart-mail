import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Send, Star } from "lucide-react";

export const EmailsAndSearch = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-sm bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="size-5 text-primary" />
            Emails That Need Your Attention
          </CardTitle>
          <CardDescription>High priority emails identified by AI</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          mails...
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="size-5 text-primary" />
            Search Assistant
          </CardTitle>
          <CardDescription>Ask questions about your emails in natural language</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input placeholder="Ask me anything about your emails..." className="pr-10" />
            <Button size="icon" className="absolute right-1 top-1 size-7">
              <Send className="size-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Try asking:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "Summarize today's emails",
                "Any follow-ups pending?",
                "What did Sarah say about the project?",
                "Show me emails with deadlines",
              ].map((prompt) => (
                <Button key={prompt} variant="outline" size="sm" className="text-xs h-7 px-2 bg-transparent">
                  {prompt}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
};
