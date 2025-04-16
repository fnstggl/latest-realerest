
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
  createdAt: string; // Added for sorting
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

  // Sort waitlist users by created_at in descending order (newest first)
  const sortedWaitlistUsers = [...waitlistUsers].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA; // Descending order (newest first)
  });

  return (
    <>
      {sortedWaitlistUsers.length > 0 ? (
        <div className="glass-card backdrop-blur-lg border border-white/40 rounded-xl shadow-lg overflow-hidden">
          <div className="border-b border-white/20 p-4 bg-white/30">
            <h2 className="text-xl font-bold">Waitlist Requests</h2>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 bg-white/10">
                <th className="text-left p-4 font-bold">Name</th>
                <th className="text-left p-4 font-bold">Contact</th>
                <th className="text-left p-4 font-bold">Property</th>
                <th className="text-left p-4 font-bold">Status</th>
                <th className="text-left p-4 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedWaitlistUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/10 hover:bg-white/20 transition-colors">
                  <td className="p-4 font-bold">{user.name}</td>
                  <td className="p-4">
                    <div>{user.email}</div>
                    <div>{user.phone}</div>
                  </td>
                  <td className="p-4">{user.property?.title || 'Unknown Property'}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md font-bold ${
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
                            className="bg-white text-green-600 hover:text-white hover:bg-green-600 border border-white/40 hover:border-green-600 transition-colors shadow-sm hover:shadow-[0_0_10px_rgba(22,163,74,0.5)]"
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
                            className="bg-white text-red-600 hover:text-white hover:bg-red-600 border border-white/40 hover:border-red-600 transition-colors shadow-sm hover:shadow-[0_0_10px_rgba(220,38,38,0.5)]"
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
        <div className="glass-card backdrop-blur-lg border border-white/40 rounded-xl p-12 text-center shadow-lg">
          <ClipboardCheck size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-2xl font-bold mb-4">No Waitlist Requests</h3>
          <p>You don't have any waitlist requests for your properties yet.</p>
        </div>
      )}
    </>
  );
};

export default WaitlistTab;
