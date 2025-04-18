import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Clock, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WaitlistUser } from "@/hooks/useProperties";

interface WaitlistTabProps {
  waitlistUsers: WaitlistUser[];
  setWaitlistUsers: React.Dispatch<React.SetStateAction<WaitlistUser[]>>;
  propertyFilter?: string | null;
}

const WaitlistTab: React.FC<WaitlistTabProps> = ({ waitlistUsers, setWaitlistUsers, propertyFilter }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter waitlist users if propertyFilter is provided
  const filteredUsers = propertyFilter 
    ? waitlistUsers.filter(user => user.propertyId === propertyFilter)
    : waitlistUsers;

  const handleStatusChange = async (userId: string, status: "accepted" | "declined") => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase
        .from('waitlist_requests')
        .update({ status })
        .eq('id', userId);
        
      if (error) {
        console.error("Error updating waitlist status:", error);
        toast.error("Failed to update waitlist status");
        return;
      }
      
      // Update UI without a page refresh
      setWaitlistUsers(prevUsers =>
        prevUsers.map(user =>
          user.id === userId ? { ...user, status } : user
        )
      );
      
      toast.success(`Request ${status === "accepted" ? "approved" : "declined"}`);
    } catch (error) {
      console.error("Exception updating waitlist status:", error);
      toast.error("Failed to update waitlist status");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4">Waitlist Requests</h2>
        
        {propertyFilter && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg text-blue-800 border border-blue-200">
            <p className="font-medium">Filtered by property ID: {propertyFilter}</p>
          </div>
        )}
        
        {filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto text-gray-400 mb-2" size={32} />
            <p className="text-gray-500">No waitlist requests found.</p>
            {propertyFilter && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => window.location.href = '/dashboard?tab=waitlist'}
              >
                View all requests
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between bg-white"
              >
                <div className="mb-4 md:mb-0">
                  <h3 className="font-bold text-lg">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                  {user.phone && (
                    <p className="text-gray-600">{user.phone}</p>
                  )}
                  <div className="mt-2">
                    <span className="text-sm text-gray-500">
                      Interested in:{" "}
                      <span className="font-medium text-black">
                        {user.property?.title || "Unknown Property"}
                      </span>
                    </span>
                  </div>
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : user.status === "accepted"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}>
                      {user.status === "pending" && <Clock size={12} className="mr-1" />}
                      {user.status === "accepted" && <Check size={12} className="mr-1" />}
                      {user.status === "declined" && <X size={12} className="mr-1" />}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                {user.status === "pending" && (
                  <div className="space-x-2 flex">
                    <Button
                      variant="outline"
                      className="border-green-500 text-green-600 hover:bg-green-50"
                      disabled={isLoading}
                      onClick={() => handleStatusChange(user.id, "accepted")}
                    >
                      <Check size={16} className="mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="outline" 
                      className="border-red-500 text-red-600 hover:bg-red-50"
                      disabled={isLoading}
                      onClick={() => handleStatusChange(user.id, "declined")}
                    >
                      <X size={16} className="mr-1" />
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WaitlistTab;
