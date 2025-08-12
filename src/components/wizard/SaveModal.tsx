import { X, Bookmark } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface SaveModalProps {
  isOpen: boolean
  onClose: () => void
  onLogin: () => void
}

export function SaveModal({ isOpen, onClose, onLogin }: SaveModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-accent-blue/10 rounded-full flex items-center justify-center mb-4">
            <Bookmark className="w-6 h-6 text-accent-blue" />
          </div>
          <DialogTitle className="text-xl font-semibold text-professional-black">
            Save your toplist
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center space-y-4">
          <p className="text-medium-grey">
            To save your current toplist, please log in or register.
          </p>
          <p className="text-sm text-medium-grey">
            This allows you to revisit and research these brokers later.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={onLogin}
              className="flex-1 bg-accent-blue hover:bg-accent-blue/90"
            >
              Log In or Register
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}