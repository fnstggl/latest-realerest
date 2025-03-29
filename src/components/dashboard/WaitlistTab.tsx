
import React from "react";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Check, X } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  property?: {
    title: string;
  };
  status: "pending" | "accepted" | "declined";
}

interface WaitlistTabProps {
  waitlistUsers: WaitlistUser[];
  setWaitlistUsers: React.Dispatch<React.SetStateAction<WaitlistUser[]>>;
}

const WaitlistTab: React.FC<WaitlistTabProps> = ({ waitlistUsers, setWaitlistUsers }) => {
  const handleUpdateWaitlistStatus = async (userId: string, newStatus: "accepted" | "declined", propertyId: string, propertyTitle: string, requesterName: string, userEmail: string) => {
    try {
      const { error } = await supabase
        .from('waitlist_requests')
        .update({ status: newStatus })
        .eq('id', userId);
        
      if (error) {
        console.error("Error updating waitlist status:", error);
        toast.error("Failed to update waitlist status");
        return;
      }
      
      // Update UI
      const updatedUsers = waitlistUsers.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      );
      
      setWaitlistUsers(updatedUsers);
      
      // Send notification to the user about their waitlist status
      try {
        // First get the user's actual user_id from the waitlist request
        const { data: userData, error: userError } = await supabase
          .from('waitlist_requests')
          .select('user_id')
          .eq('id', userId)
          .single();
          
        if (userError) {
          console.error("Error fetching user data:", userError);
          throw userError;
        }
        
        // Create notification with appropriate message based on status
        const notificationTitle = newStatus === "accepted" ? 
          "Waitlist Request Approved!" : 
          "Waitlist Request Declined";
          
        const notificationMessage = newStatus === "accepted" ? 
          `Great news! Your waitlist request for ${propertyTitle} has been approved. You can now view the full property details.` : 
          `Unfortunately, your waitlist request for ${propertyTitle} has been declined.`;
          
        await supabase
          .from('notifications')
          .insert({
            user_id: userData.user_id,
            title: notificationTitle,
            message: notificationMessage,
            type: newStatus === "accepted" ? "success" : "error",
            properties: {
              propertyId,
              propertyTitle,
              status: newStatus
            },
            read: false
          });
          
      } catch (error) {
        console.error("Error sending notification to user:", error);
      }
      
      if (newStatus === "accepted") {
        toast.success(`${requesterName} accepted to waitlist! A notification has been sent to ${userEmail}.`);
      } else {
        toast.success(`${requesterName} declined from waitlist. A notification has been sent to ${userEmail}.`);
      }
    } catch (error) {
      console.error("Error updating waitlist status:", error);
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      {waitlistUsers.length > 0 ? (
        <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
          <div className="border-b-4 border-black p-4 bg-gray-50">
            <h2 className="text-xl font-bold">Waitlist Requests</h2>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="border-b-4 border-black">
                <th className="text-left p-4 font-bold">Name</th>
                <th className="text-left p-4 font-bold">Contact</th>
                <th className="text-left p-4 font-bold">Property</th>
                <th className="text-left p-4 font-bold">Status</th>
                <th className="text-left p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {waitlistUsers.map((user) => (
                <tr key={user.id} className="border-b-2 border-gray-200">
                  <td className="p-4 font-bold">{user.name}</td>
                  <td className="p-4">
                    <div>{user.email}</div>
                    <div>{user.phone}</div>
                  </td>
                  <td className="p-4">{user.property?.title || 'Unknown Property'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 font-bold ${
                      user.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                      user.status === 'declined' ? 'bg-red-100 text-red-800' : 
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {user.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {user.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 border-2 border-black"
                            onClick={() => handleUpdateWaitlistStatus(
                              user.id, 
                              'accepted', 
                              user.propertyId, 
                              user.property?.title || 'Property', 
                              user.name,
                              user.email
                            )}
                          >
                            <Check size={16} className="mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700 border-2 border-black"
                            onClick={() => handleUpdateWaitlistStatus(
                              user.id, 
                              'declined', 
                              user.propertyId, 
                              user.property?.title || 'Property', 
                              user.name,
                              user.email
                            )}
                          >
                            <X size={16} className="mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border-4 border-black p-12 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <ClipboardCheck size={48} className="mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-4">No Waitlist Requests</h3>
          <p>You don't have any waitlist requests for your properties yet.</p>
        </div>
      )}
    </>
  );
};

export default WaitlistTab;
