import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { Home, Plus, Edit, Trash2, LogOut, Settings, User, KeyRound, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import SiteFooter from '@/components/sections/SiteFooter';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FCFBF8]">
      <Navbar />
      
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3">
              <Card className="shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Welcome to Your Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Manage your listings, update your profile, and more.</p>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="shadow-sm border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="secondary" className="w-full justify-start hover:bg-gray-100 hover:text-gray-800">
                    <Plus size={16} className="mr-2" />
                    Create New Listing
                  </Button>
                  <Button variant="secondary" className="w-full justify-start hover:bg-gray-100 hover:text-gray-800">
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Your Listings</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Status</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Badge variant="outline">Listed</Badge>
                  </TableCell>
                  <TableCell>Cozy Apartment in Downtown</TableCell>
                  <TableCell>New York, NY</TableCell>
                  <TableCell className="text-right">$2,500/month</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Badge variant="ghost">Pending</Badge>
                  </TableCell>
                  <TableCell>Spacious House with Garden</TableCell>
                  <TableCell>Los Angeles, CA</TableCell>
                  <TableCell className="text-right">$4,200/month</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </motion.div>
      </div>
      
      <SiteFooter />
    </div>
  );
};

export default Dashboard;
