import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FileText,
  HelpCircle,
  BookOpen,
  Apple,
  Smartphone,
} from "lucide-react";

const resources = [
  {
    title: "Help Documentation",
    icon: FileText,
    href: "/help",
    color: "text-pink-600",
  },
  {
    title: "FAQ",
    icon: HelpCircle,
    href: "/faq",
    color: "text-green-600",
  },
  {
    title: "Essential Business Guides",
    icon: BookOpen,
    href: "/guides",
    color: "text-purple-600",
  },
];

export function MobileAppResourcesSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Mobile App Section */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Expense on the go!
              </h2>
              <div className="flex justify-center mb-6">
                <img
                  src="/images/mobile-preview.jpg"
                  alt="Mobile app dashboard showing expense tracking interface"
                  className="max-w-full h-auto max-h-64 object-contain"
                />
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Download the mobile app for Android or iOS
              </p>

              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  asChild
                >
                  <a href="#" className="flex items-center gap-2">
                    <Apple className="h-5 w-5" />
                    <span>iOS</span>
                  </a>
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                  asChild
                >
                  <a href="#" className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5" />
                    <span>Android</span>
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources Section */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-8">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
              Resources
            </h2>

            <div className="space-y-4">
              {resources.map((resource) => (
                <Button
                  key={resource.title}
                  variant="ghost"
                  className="w-full justify-start h-auto p-4 hover:bg-gray-50 dark:hover:bg-gray-800"
                  asChild
                >
                  <a href={resource.href} className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 ${resource.color}`}
                    >
                      <resource.icon className="h-5 w-5" />
                    </div>
                    <span className="text-base font-medium text-gray-900 dark:text-gray-100">
                      {resource.title}
                    </span>
                  </a>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
