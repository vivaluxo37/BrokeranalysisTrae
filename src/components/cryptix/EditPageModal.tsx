import React from 'react';
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface EditPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function EditPageModal({ isOpen, onClose }: EditPageModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111111]/90 backdrop-blur-lg border border-white/10 rounded-lg p-6 max-w-[220px] shadow-[0px_10px_20px_rgba(0,0,0,0.20)]">
        <DialogHeader className="relative">
          <button 
            onClick={onClose}
            className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center"
          >
            <X size={6} className="text-white" />
          </button>
        </DialogHeader>

        <div className="space-y-4">
          {/* Framer Logo */}
          <div className="flex justify-center">
            <img 
              src="/assets/framer-logo.png" 
              alt="Framer Logo" 
              className="w-9 h-9"
            />
          </div>

          {/* Content */}
          <div className="text-center space-y-1">
            <h3 className="text-[13px] font-semibold text-white font-['Inter']">
              Edit Page
            </h3>
            <p className="text-[13px] text-[#999999] font-['Inter'] leading-[18.2px]">
              Edit the page directly
              <br />
              in the browser, without
              <br />
              opening the app.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2.5">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-[13px] font-semibold text-white font-['Inter'] hover:bg-white/5"
            >
              Learn More
            </Button>
            <Button 
              size="sm" 
              className="text-[13px] font-semibold text-[#222222] bg-white hover:bg-gray-100 font-['Inter']"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}