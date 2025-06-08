
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, Check, X, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/context/AuthContext";

interface WaitlistUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyId: string;
  user_id: string;
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
  const navigate = useNavigate();
  const { getOrCreateConversation } = useMessages();
  const { user } = useAuth();
  
  const handleMessageClick = async (userId: string) => {
    try {
      // First get the user's actual user_id from the waitlist request
      const { data: userData, error: userError } = await supabase
        .from('waitlist_requests')
        .select('user_id')
        .eq('id', userId)
        .single();
        
      if (userError) {
        console.error("Error fetching user data:", userError);
        toast.error("Could not find this user's details");
        return;
      }
      
      if (!userData?.user_id) {
        toast.error("Could not find user information");
        return;
      }
      
      // Create or get existing conversation
      const conversationId = await getOrCreateConversation(userData.user_id);
      
      if (conversationId) {
        // Navigate to the specific conversation
        navigate(`/messages/${conversationId}`);
      } else {
        toast.error("Could not create conversation with this user");
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    }
  };

  const handleUpdateWaitlistStatus = async (userId: string, newStatus: "accepted" | "declined", propertyId: string, propertyTitle: string, requesterName: string, userEmail: string, requesterUserId: string) => {
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
      
      // Create notification for the waitlist requester (buyer)
      await supabase.from("notifications").insert({
        user_id: requesterUserId,
        title: `Waitlist Request ${newStatus === "accepted" ? "Accepted" : "Declined"}`,
        message: newStatus === "accepted" 
          ? `Your request to join the waitlist for ${propertyTitle} has been accepted!` 
          : `Your request to join the waitlist for ${propertyTitle} has been declined.`,
        type: newStatus === "accepted" ? "success" : "info",
        properties: {
          propertyId: propertyId
        }
      });

      // Create notification for the seller (current user)
      if (user?.id) {
        await supabase.from("notifications").insert({
          user_id: user.id,
          title: `Waitlist Request ${newStatus === "accepted" ? "Accepted" : "Declined"}`,
          message: newStatus === "accepted"
            ? `You accepted ${requesterName}'s request to join the waitlist for ${propertyTitle}.`
            : `You declined ${requesterName}'s request to join the waitlist for ${propertyTitle}.`,
          type: "info",
          properties: {
            propertyId: propertyId,
            buyerId: requesterUserId
          }
        });
      }
      
      if (newStatus === "accepted") {
        toast.success(`${requesterName} accepted to waitlist!`);
      } else {
        toast.success(`${requesterName} declined from waitlist.`);
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
            <h2 className="text-xl font-polysans text-[#01204b]">Waitlist Requests</h2>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 bg-white/10">
                <th className="text-left p-4 font-polysans text-[#01204b]">Name</th>
                <th className="text-left p-4 font-polysans text-[#01204b]">Contact</th>
                <th className="text-left p-4 font-polysans text-[#01204b]">Property</th>
                <th className="text-left p-4 font-polysans text-[#01204b]">Status</th>
                <th className="text-left p-4 font-polysans text-[#01204b]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedWaitlistUsers.map((user) => (
                <tr key={user.id} className="border-b border-white/10 hover:bg-white/20 transition-colors">
                  <td className="p-4 font-polysans-semibold text-[#01204b]">{user.name}</td>
                  <td className="p-4">
                    <div>{user.email}</div>
                    <div>{user.phone}</div>
                    <div className="mt-2">
                      <Button 
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMessageClick(user.id)}
                        className="hover:bg-white/20 text-[#746d79] font-polysans-semibold px-0"
                      >
                        <MessageCircle size={16} className="mr-1" />
                        Message buyer
                      </Button>
                    </div>
                  </td>
                  <td className="p-4">
                    <Link 
                      to={`/property/${user.propertyId}`}
                      className="text-[#746d79] font-polysans-semibold hover:underline"
                    >
                      {user.property?.title || 'Unknown Property'}
                    </Link>
                  </td>
                  <td className="p-4">
                    <span className={`relative inline-flex px-3 py-1 rounded-md font-polysans ${
                      user.status === 'accepted' ? 'bg-white text-[#01204b]' : 
                      user.status === 'declined' ? 'bg-red-100 text-red-800' : 
                      'bg-white border border-[#01204b] text-[#01204b]'
                    }`}>
                      {user.status.toUpperCase()}
                      {user.status === 'accepted' && (
                     <span 
  className="absolute inset-0 rounded-md pointer-events-none border-2 border-[#fd4801]"
  style={{ background: "transparent" }}
/>

                      )}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {user.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
className="bg-white text-[#fd4801] hover:text-white hover:bg-[#fd4801] border border-white/40 hover:border-[#fd4801] transition-colors shadow-sm"
                            onClick={() => handleUpdateWaitlistStatus(
                              user.id, 
                              'accepted', 
                              user.propertyId, 
                              user.property?.title || 'Property', 
                              user.name,
                              user.email,
                              user.user_id
                            )}
                          >
                            <Check size={16} className="mr-1" />
                            <span className="font-polysans">Accept</span>
                          </Button>
                          <Button 
                            size="sm" 
className="bg-white text-[#01204b] hover:text-white hover:bg-[#01204b] border border-white/40 hover:border-[#01204b] transition-colors shadow-sm"
                            onClick={() => handleUpdateWaitlistStatus(
                              user.id, 
                              'declined', 
                              user.propertyId, 
                              user.property?.title || 'Property', 
                              user.name,
                              user.email,
                              user.user_id
                            )}
                          >
                            <X size={16} className="mr-1" />
                            <span className="font-polysans">Decline</span>
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
          <h3 className="text-2xl font-polysans mb-4">No Waitlist Requests</h3>
          <p>You don't have any waitlist requests for your properties yet.</p>
        </div>
      )}
    </>
  );
};

export default WaitlistTab;
