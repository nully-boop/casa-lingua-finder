import { useState } from "react";
import { Share2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ShareButton() {
  const [open, setOpen] = useState(false);
  const [pageUrl, setPageUrl] = useState("");

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setPageUrl(url);
      setOpen(true);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="bg-background/80 backdrop-blur-sm border border-border/50"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Link Copied</DialogTitle>
            <DialogDescription>
              You can now share this page using the link or the buttons below.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center space-x-2">
            <Input value={pageUrl} readOnly className="flex-1" />
            <Button
              variant="secondary"
              onClick={() => {
                navigator.clipboard.writeText(pageUrl);
              }}
            >
              Copy again
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(pageUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="success"
                className="hover:bg-success/90"
              >
                WhatsApp
              </Button>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                pageUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Twitter
              </Button>
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                pageUrl
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Facebook
              </Button>
            </a>
            <a
              href={`mailto:?subject=Check this out&body=${encodeURIComponent(
                pageUrl
              )}`}
            >
              <Button
                variant="secondary"
              >
                Email
              </Button>
            </a>
          </div>

          <DialogFooter>
            <Button onClick={() => setOpen(false)} variant="ghost">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
