import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { QAQuestion } from "@shared/schema";

interface ExpandedAnswerModalProps {
  question: QAQuestion;
  isOpen: boolean;
  onClose: () => void;
}

export function ExpandedAnswerModal({ question, isOpen, onClose }: ExpandedAnswerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] p-0">
        <DialogHeader className="px-4 py-3 border-b border-gray-200">
          <DialogTitle className="text-lg font-semibold text-gray-900 text-left">
            {question.question}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="px-4 py-4 max-h-[60vh]">
          <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
            {question.fullAnswer ? (
              <p>{question.fullAnswer}</p>
            ) : (
              <p>{question.answer}</p>
            )}
            
            {question.category && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <span className="inline-block bg-catholic-green bg-opacity-10 text-catholic-green text-xs font-medium px-3 py-1 rounded-full">
                  {question.category}
                </span>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
