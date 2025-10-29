import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Check, Copy, MessageCircle, Twitter } from "lucide-react";
import { useState } from "react";

interface ShareDialogProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title?: string;
  description?: string;
}

export const ShareDialog = ({ 
  isOpen, 
  onClose, 
  url, 
  title = "Check out this product!", 
  description = "Found something amazing on The Coutures" 
}: ShareDialogProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The link has been copied to your clipboard.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${description}\n\n${url}`)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'noopener,noreferrer');
  };

  const handleInstagramShare = () => {
    // Instagram doesn't support direct URL sharing, so we'll copy the link and notify the user
    handleCopyLink();
    toast({
      title: "Link copied for Instagram!",
      description: "Paste this link in your Instagram story or bio.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <MessageCircle className="h-5 w-5 text-primary" />
            Share this product
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Share this amazing product with your friends and family
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <Label htmlFor="share-link">Product Link</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="share-link"
                value={url}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                className="px-3"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* Social Media Sharing */}
          <div className="space-y-3">
            <Label>Share on social media</Label>
            <div className="flex flex-col space-y-2">
              {/* WhatsApp */}
              <Button
                variant="outline"
                onClick={handleWhatsAppShare}
                className="justify-start w-full h-12"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <span>Share on WhatsApp</span>
                </div>
              </Button>

              {/* Twitter */}
              <Button
                variant="outline"
                onClick={handleTwitterShare}
                className="justify-start w-full h-12"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Twitter className="h-4 w-4 text-white" />
                  </div>
                  <span>Share on Twitter</span>
                </div>
              </Button>

              {/* Instagram */}
              <Button
                variant="outline"
                onClick={handleInstagramShare}
                className="justify-start w-full h-12"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full flex items-center justify-center relative">
                    <div className="w-3 h-3 border-2 border-white rounded-full"></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full"></div>
                  </div>
                  <span>Copy for Instagram</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};