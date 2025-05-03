import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Copy, CheckCircle, UserPlus, Mail, Phone, AlertTriangle } from 'lucide-react';
import { useNotification } from '@/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import RewardProgress from '@/components/dashboard/RewardProgress';
import { useProperties } from '@/hooks/useProperties';
import { Notification as AppNotification } from '@/context/NotificationContext';

interface Notification {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  properties: any;
}

interface WaitlistUser {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  id: string;
  created_at: string;
}

const Dashboard: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [waitlistUsers, setWaitlistUsers] = useState<WaitlistUser[]>([]);
  const [propertiesCount, setPropertiesCount] = useState(0);
  const [propertiesLoading, setPropertiesLoading] = useState(true);
  const { clearNotifications } = useNotification();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
          toast.error('Failed to load profile.');
        }

        setProfile(data);
      } catch (error) {
        console.error('Unexpected error fetching profile:', error);
        toast.error('Unexpected error loading profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;

      try {
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5);

        if (notificationsError) {
          console.error('Error fetching notifications:', notificationsError);
          return;
        }

        const notificationsList = notificationsData as unknown as AppNotification[];
        setNotifications(notificationsList);
      } catch (error) {
        console.error('Error processing notifications:', error);
      }
    };

    fetchNotifications();
  }, [user]);

  useEffect(() => {
    const fetchWaitlistUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('waitlist')
          .select('user_id, created_at, profiles(name, email, phone)')
          .limit(5);

        if (error) {
          console.error('Error fetching waitlist users:', error);
          return;
        }

        const formattedWaitlistUsers = data.map(item => ({
          user_id: item.user_id,
          name: item.profiles?.name || 'Unknown',
          email: item.profiles?.email || 'N/A',
          phone: item.profiles?.phone || 'N/A',
          status: 'Waitlist',
          id: item.user_id,
          created_at: item.created_at
        }));

        setWaitlistUsers(formattedWaitlistUsers);
      } catch (error) {
        console.error('Error processing waitlist users:', error);
      }
    };

    fetchWaitlistUsers();
  }, []);

  const { properties } = useProperties();

  useEffect(() => {
    if (properties) {
      setPropertiesCount(properties.length);
      setPropertiesLoading(false);
    }
  }, [properties]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleClearNotifications = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing notifications:', error);
        toast.error('Failed to clear notifications.');
        return;
      }

      setNotifications([]);
      clearNotifications();
      toast.success('Notifications cleared successfully!');
    } catch (error) {
      console.error('Unexpected error clearing notifications:', error);
      toast.error('Unexpected error clearing notifications.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />

      <div className="container mx-auto px-4 py-8 mt-16 sm:mt-20">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">

          <Card>
            <CardHeader>
              <CardTitle>Welcome!</CardTitle>
              <CardDescription>
                {loading ? <Skeleton className="h-4 w-[200px]" /> : `Hello, ${profile?.name || 'User'}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-[200px]" />
              ) : (
                <div className="space-y-2">
                  <p>Email: {profile?.email || 'N/A'}</p>
                  <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Properties</CardTitle>
              <CardDescription>Your listed properties</CardDescription>
            </CardHeader>
            <CardContent>
              {propertiesLoading ? (
                <Skeleton className="h-10 w-[100px]" />
              ) : (
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{propertiesCount}</p>
                  <p>Total Properties</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Rewards</CardTitle>
              <CardDescription>Your bounty progress</CardDescription>
            </CardHeader>
            <CardContent>
              <RewardProgress status="in_progress" />
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Your recent activity</CardDescription>
            </CardHeader>
            <CardContent className="pl-2 pr-0">
              <ScrollArea className="h-[300px] w-full pr-2">
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="border border-gray-200 rounded-md p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium">{notification.title}</h4>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => {
                                navigator.clipboard.writeText(notification.message);
                                toast.success('Notification message copied to clipboard!');
                              }}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-gray-500">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDistanceToNow(new Date(notification.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <Button variant="secondary" className="mt-4 w-full" onClick={handleClearNotifications}>
                Clear Notifications
              </Button>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2 lg:col-span-3">
            <CardHeader>
              <CardTitle>Waitlist Users</CardTitle>
              <CardDescription>New users on the waitlist</CardDescription>
            </CardHeader>
            <CardContent className="overflow-auto">
              <Table>
                <TableCaption>New users on the waitlist.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {waitlistUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 inline-block" />
                        {user.status}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={`https://avatar.vercel.sh/${user.email}.png`} alt={user.name} />
                            <AvatarFallback>{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <span>{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <a href={`mailto:${user.email}`} className="text-blue-500 hover:underline">
                          {user.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        {user.phone ? (
                          <a href={`tel:${user.phone}`} className="text-blue-500 hover:underline">
                            {user.phone}
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add to team
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send message
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={5}>
                      {waitlistUsers.length} users in total
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
