
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileDown } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

const ContractDownloadButton = () => {
  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('contract_documents')
        .download('wholesale-contract-template.pdf');
        
      if (error) {
        toast({
          title: "Download Error",
          description: "Unable to download the contract template.",
          variant: "destructive"
        });
        console.error('Error downloading contract:', error);
        return;
      }

      // Create a blob URL and trigger download
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wholesale-contract-template.pdf';
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Contract Downloaded",
        description: "Wholesale contract template downloaded successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Download Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      console.error('Unexpected error downloading contract:', error);
    }
  };

  return (
    <Button 
      onClick={handleDownload}
      variant="outline"
      className="flex items-center gap-2 mt-4"
    >
      <FileDown className="h-5 w-5" />
      Download Contract Template
    </Button>
  );
};

export default ContractDownloadButton;
