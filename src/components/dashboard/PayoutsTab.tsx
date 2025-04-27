
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift } from 'lucide-react';

const PayoutsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gift className="h-5 w-5" />
          Payouts
        </CardTitle>
        <CardDescription>
          Track and manage your property deal payouts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No payouts to display yet</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayoutsTab;
