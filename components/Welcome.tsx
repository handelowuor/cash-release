import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function WelcomeSection() {
  return (
    <Card className="border-none shadow-sm bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Welcome!
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
          We are excited to have you here. This platform will help you manage
          and track petty cash advances and expenses effectively.
        </p>
      </CardContent>
    </Card>
  );
}
