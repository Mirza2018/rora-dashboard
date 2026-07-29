
import CustomersTable from "@/components/customers_page/customers_table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Download, Plus } from "lucide-react";


const CustomersPage = () => {
  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-title text-3xl font-bold">Customers</h1>
          <p className="text-muted-foreground ">All RORA app users worldwide</p>
        </div>
        <div className="flex gap-3">
          {/* <Button variant="cancel">Cancel</Button> */}
          <Button>
            {/* <Plus className="size-4" /> */}
            <Download className="size-4" />
            Export
          </Button>
        </div>
        
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total customers</CardDescription>
            <CardTitle className="text-2xl">22,418</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Active 30d</CardDescription>
            <CardTitle className="text-2xl">14,820</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>New this week</CardDescription>
            <CardTitle className="text-2xl">612</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Blocked</CardDescription>
            <CardTitle className="text-2xl">6</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <CustomersTable />
    </main>
  );
};

export default CustomersPage;
