import {
  Card,
  CardContent,
} from "@/components/ui/card";

import { Mail, MessageSquare, TrendingDown, TrendingUp, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

const cardsData = [
  {
    title: "Unread Emails",
    value: "24",
    trendIcon: TrendingDown,
    trendDesc: "12% less than yesterday",
    icon: Mail,
    color: "text-destructive",
  },
  {
    title: "Inbox Health",
    value: "87%",
    trendIcon: TrendingUp,
    trendDesc: "Great job!",
    icon: Zap,
    color: "text-green-700",
  },
  {
    title: "Response Rate",
    value: "92%",
    trendIcon: TrendingUp,
    trendDesc: "Above average",
    icon: MessageSquare,
    color: "text-green-700",
  },
];

export const OverviewCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardsData.map((card, index) => (
        <Card
          key={index}
          className="border-0 shadow-sm bg-background/80 backdrop-blur"
        >
          <CardContent className="py-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </p>
                <p className="text-3xl font-bold">
                  {card.value}
                </p>
                <p
                  className={cn(
                    "text-xs text-destructive flex items-center gap-1 mt-1",
                    card.color
                  )}
                >
                  <card.trendIcon className="size-3" />
                  {card.trendDesc}
                </p>
              </div>
              <div className="size-12 bg-secondary rounded-lg flex items-center justify-center">
                <card.icon className="size-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
};
