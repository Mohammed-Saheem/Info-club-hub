import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Users() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">User Management</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">User management functionality is coming soon.</p>
                </CardContent>
            </Card>
        </div>
    );
}
