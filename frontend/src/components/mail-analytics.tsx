import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart3, PieChart } from "lucide-react";

import { useMails } from "@/store/mail";
import { getMailsAnalyticsData } from "@/lib/mails";

const activityChartConfig = {
  emails: { label: "Received", color: "#f59e0b" },
};

export const MailAnalytics = () => {
  const { mails } = useMails();

  const { chartData, categoryData } = getMailsAnalyticsData(mails);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="border-0 shadow-sm bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" />
            Email Activity This Week
          </CardTitle>
          <CardDescription>Emails received</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={activityChartConfig}
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="day" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="emails" fill="var(--color-emails)" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="border-0 shadow-sm bg-background/80 backdrop-blur h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="size-5 text-primary" />
            Email Categories
          </CardTitle>
          <CardDescription>Distribution of your emails</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryData.map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-3 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${category.value}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{category.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
};
