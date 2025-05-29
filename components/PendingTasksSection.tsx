import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, AlertTriangle, CreditCard, FileText, ChevronRight } from "lucide-react"

const pendingTasks = [
  {
    title: "Pending Approvals",
    description: "Requests awaiting your approval",
    count: 5,
    icon: Clock,
    href: "/approvals/pending",
    priority: "high" as const,
  },
  {
    title: "Unaccounted Advances",
    description: "Advances without submitted receipts",
    count: 3,
    icon: CreditCard,
    href: "/advances/unaccounted",
    priority: "medium" as const,
  },
  {
    title: "Incomplete Submissions",
    description: "Forms missing required information",
    count: 2,
    icon: FileText,
    href: "/submissions/incomplete",
    priority: "low" as const,
  },
  {
    title: "Overdue Reports",
    description: "Monthly reports past due date",
    count: 1,
    icon: AlertTriangle,
    href: "/reports/overdue",
    priority: "high" as const,
  },
]

const getPriorityColor = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "medium":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "low":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

const getIconColor = (priority: "high" | "medium" | "low") => {
  switch (priority) {
    case "high":
      return "text-red-600 bg-red-50 dark:bg-red-950/20"
    case "medium":
      return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20"
    case "low":
      return "text-blue-600 bg-blue-50 dark:bg-blue-950/20"
    default:
      return "text-gray-600 bg-gray-50 dark:bg-gray-950/20"
  }
}

export function PendingTasksSection() {
  const totalTasks = pendingTasks.reduce((sum, task) => sum + task.count, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold">Pending Tasks</CardTitle>
          <Badge variant="secondary" className="text-sm">
            {totalTasks} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {pendingTasks.map((task) => (
            <Button
              key={task.title}
              variant="ghost"
              className="w-full h-auto p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              asChild
            >
              <a href={task.href}>
                <div className="flex items-center gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${getIconColor(task.priority)}`}>
                    <task.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h3>
                      <Badge className={getPriorityColor(task.priority)} variant="secondary">
                        {task.count}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </a>
            </Button>
          ))}
        </div>

        {totalTasks === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <Clock className="h-8 w-8 mx-auto" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">No pending tasks</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">You're all caught up!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
