# SunCulture Expense Management System API Endpoints

## Authentication Endpoints

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout
- `GET /api/auth/user-info` - Get current user information and permissions

## User Management Endpoints

- `GET /api/users` - List all users (with pagination and filtering)
- `GET /api/users/:id` - Get user details
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete/deactivate user
- `GET /api/users/:id/history` - Get user activity history
- `POST /api/users/delegate` - Set delegation for user absence

## Department Management Endpoints

- `GET /api/departments` - List all departments
- `GET /api/departments/:id` - Get department details
- `POST /api/departments` - Create new department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department
- `GET /api/departments/:id/users` - Get users in a department

## Expense Management Endpoints

- `GET /api/expenses` - List all expenses (with pagination and filtering)
- `GET /api/expenses/:id` - Get expense details
- `POST /api/expenses` - Create new expense request
- `PUT /api/expenses/:id` - Update expense request
- `DELETE /api/expenses/:id` - Delete expense request (draft only)
- `POST /api/expenses/:id/submit` - Submit expense for approval
- `POST /api/expenses/:id/approve` - Approve expense (HOD or Finance)
- `POST /api/expenses/:id/reject` - Reject expense (with reason)
- `POST /api/expenses/:id/pay` - Mark expense as paid (Finance only)
- `POST /api/expenses/:id/cancel` - Cancel expense request
- `GET /api/expenses/:id/history` - Get expense approval history
- `POST /api/expenses/:id/attachments` - Upload attachment for expense
- `DELETE /api/expenses/:id/attachments/:attachmentId` - Delete attachment

## Advance Management Endpoints

- `GET /api/advances` - List all advances
- `GET /api/advances/:id` - Get advance details
- `POST /api/advances` - Create new advance request
- `POST /api/advances/:id/accountability` - Submit accountability for advance
- `GET /api/advances/active/:userId` - Check if user has active advance

## Budget Management Endpoints

- `GET /api/budgets` - List all budgets (with filtering by department, date range)
- `GET /api/budgets/:id` - Get budget details
- `POST /api/budgets` - Create new budget
- `PUT /api/budgets/:id` - Update budget
- `DELETE /api/budgets/:id` - Delete budget
- `GET /api/budgets/departments/:departmentId` - Get budgets for specific department
- `GET /api/budgets/history/:id` - Get budget modification history
- `POST /api/budgets/upload` - Bulk upload budgets (CSV/Excel)

## Vendor Management Endpoints

- `GET /api/vendors` - List all vendors
- `GET /api/vendors/:id` - Get vendor details
- `POST /api/vendors` - Create new vendor
- `PUT /api/vendors/:id` - Update vendor
- `DELETE /api/vendors/:id` - Delete/deactivate vendor

## Expense Category Endpoints

- `GET /api/expense-categories` - List all expense categories
- `GET /api/expense-categories/:id` - Get category details
- `POST /api/expense-categories` - Create new category
- `PUT /api/expense-categories/:id` - Update category
- `DELETE /api/expense-categories/:id` - Delete category

## Business Organization Endpoints

- `GET /api/business-orgs` - List all business organizations
- `GET /api/business-orgs/:id` - Get business organization details
- `POST /api/business-orgs` - Create new business organization
- `PUT /api/business-orgs/:id` - Update business organization
- `DELETE /api/business-orgs/:id` - Delete business organization
- `GET /api/business-orgs/:id/cost-centers` - Get cost centers for a business organization

## Country and Currency Endpoints

- `GET /api/countries` - List all countries
- `GET /api/countries/:id` - Get country details
- `GET /api/currencies` - List all currencies
- `GET /api/currencies/:id` - Get currency details
- `GET /api/exchange-rates` - Get current exchange rates

## Reporting Endpoints

- `GET /api/reports/expenses` - Generate expense reports (with filtering)
- `GET /api/reports/budgets` - Generate budget utilization reports
- `GET /api/reports/departments` - Generate department spending reports
- `GET /api/reports/users` - Generate user activity reports
- `GET /api/reports/export/:reportType` - Export reports to CSV/Excel

## Dashboard Endpoints

- `GET /api/dashboard/summary` - Get dashboard summary data
- `GET /api/dashboard/pending-approvals` - Get pending approvals count
- `GET /api/dashboard/recent-activity` - Get recent activity
- `GET /api/dashboard/budget-status` - Get budget status overview
- `GET /api/dashboard/expense-trends` - Get expense trends data

## System Administration Endpoints

- `GET /api/admin/settings` - Get system settings
- `PUT /api/admin/settings` - Update system settings
- `GET /api/admin/audit-logs` - Get system audit logs
- `GET /api/admin/permissions` - List all permissions
- `POST /api/admin/roles` - Create new role
- `PUT /api/admin/roles/:id` - Update role
- `GET /api/admin/roles` - List all roles
- `GET /api/admin/feature-flags` - Get feature flags
- `PUT /api/admin/feature-flags` - Update feature flags
