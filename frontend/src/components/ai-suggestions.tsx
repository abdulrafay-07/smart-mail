import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Brain, CheckCircle2, Sparkles } from "lucide-react";

export const AISuggestions = () => {
  return (
    <Card className="border-0 shadow-sm bg-gradient-to-r from-yellow-50 to-amber-50 backdrop-blur">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="size-5 text-primary" />
          AI Suggestions
        </CardTitle>
        <CardDescription>Smart recommendations to improve your email workflow</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg border border-blue-100">
            <AlertCircle className="size-5 text-amber-700 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">You haven't responded to these emails in 2+ days</p>
              <p className="text-xs text-muted-foreground mt-1">
                3 emails from Sarah, John, and the marketing team
              </p>
            </div>
            <Button size="sm" className="shrink-0">
              Reply Now
            </Button>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg border border-green-100">
            <CheckCircle2 className="size-5 text-amber-700 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">4 newsletters you usually ignore — unsubscribe?</p>
              <p className="text-xs text-muted-foreground mt-1">Clean up your inbox automatically</p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0">
              Review
            </Button>
          </div>

          <div className="flex items-start gap-3 p-4 bg-white/60 rounded-lg border border-purple-100">
            <Sparkles className="size-5 text-amber-700 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium">Draft a reply to John about your availability?</p>
              <p className="text-xs text-muted-foreground mt-1">AI can help compose a professional response</p>
            </div>
            <Button size="sm" variant="outline" className="shrink-0">
              Draft Reply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
};
