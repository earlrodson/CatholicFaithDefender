import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, BookMarked, ScrollText, BookText, ListChecks } from "lucide-react";
import type { QAQuestion } from "@shared/schema";

interface ExpandedAnswerModalProps {
  question: QAQuestion;
  isOpen: boolean;
  onClose: () => void;
}

function formatTextWithNewlines(text?: string | null) {
  if (!text) return null;
  return text.split('\n').map((paragraph, i) => (
    <p key={i} className="mb-4 last:mb-0">
      {paragraph.startsWith('• ') ? (
        <span className="flex items-start">
          <span className="mr-2">•</span>
          <span>{paragraph.substring(2)}</span>
        </span>
      ) : (
        paragraph
      )}
    </p>
  ));
}

export function ExpandedAnswerModal({ question, isOpen, onClose }: ExpandedAnswerModalProps) {
  const [activeTab, setActiveTab] = useState("answer");
  
  const hasAdditionalContent = [
    question.subjectOverview,
    question.etymology,
    question.churchDocuments,
    question.scriptureSupport,
    question.earlyChurchFathers,
    question.summaryPoints
  ].some(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b border-gray-200">
          <DialogTitle className="text-xl font-bold text-gray-900 text-left">
            {question.question}
          </DialogTitle>
          {question.category && (
            <div className="mt-1">
              <span className="inline-block bg-catholic-green bg-opacity-10 text-catholic-green text-xs font-medium px-3 py-1 rounded-full">
                {question.category}
              </span>
            </div>
          )}
        </DialogHeader>
        
        <div className="flex flex-col h-[calc(90vh-140px)]">
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="w-full justify-start rounded-none border-b px-6 bg-transparent">
              <TabsTrigger value="answer" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>Answer</span>
              </TabsTrigger>
              
              {question.subjectOverview && (
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <BookText className="h-4 w-4" />
                  <span>Overview</span>
                </TabsTrigger>
              )}
              
              {question.scriptureSupport && (
                <TabsTrigger value="scripture" className="flex items-center gap-2">
                  <ScrollText className="h-4 w-4" />
                  <span>Scripture</span>
                </TabsTrigger>
              )}
              
              {question.churchDocuments && (
                <TabsTrigger value="documents" className="flex items-center gap-2">
                  <BookMarked className="h-4 w-4" />
                  <span>Church Teaching</span>
                </TabsTrigger>
              )}
              
              {question.summaryPoints && (
                <TabsTrigger value="summary" className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4" />
                  <span>Summary</span>
                </TabsTrigger>
              )}
            </TabsList>
            
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full w-full">
                <div className="p-6">
                  <TabsContent value="answer" className="m-0">
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                      {question.fullAnswer ? (
                        formatTextWithNewlines(question.fullAnswer)
                      ) : (
                        <p>{question.answer}</p>
                      )}
                      
                      {question.etymology && (
                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                          <h4 className="text-sm font-semibold text-gray-800 mb-2">Etymology</h4>
                          <p className="text-sm text-gray-700">{question.etymology}</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  {question.subjectOverview && (
                    <TabsContent value="overview" className="m-0">
                      <div className="prose prose-sm max-w-none text-gray-700">
                        {formatTextWithNewlines(question.subjectOverview)}
                      </div>
                    </TabsContent>
                  )}
                  
                  {question.scriptureSupport && (
                    <TabsContent value="scripture" className="m-0">
                      <div className="prose prose-sm max-w-none text-gray-700">
                        {formatTextWithNewlines(question.scriptureSupport)}
                      </div>
                    </TabsContent>
                  )}
                  
                  {question.churchDocuments && (
                    <TabsContent value="documents" className="m-0">
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Church Documents & Teachings</h3>
                        {formatTextWithNewlines(question.churchDocuments)}
                        
                        {question.earlyChurchFathers && (
                          <>
                            <h4 className="text-sm font-semibold text-gray-800 mt-6 mb-3">Early Church Fathers</h4>
                            {formatTextWithNewlines(question.earlyChurchFathers)}
                          </>
                        )}
                      </div>
                    </TabsContent>
                  )}
                  
                  {question.summaryPoints && (
                    <TabsContent value="summary" className="m-0">
                      <div className="prose prose-sm max-w-none text-gray-700">
                        <h3 className="text-base font-semibold text-gray-900 mb-3">Key Points</h3>
                        <div className="space-y-2">
                          {formatTextWithNewlines(question.summaryPoints)}
                        </div>
                      </div>
                    </TabsContent>
                  )}
                </div>
              </ScrollArea>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
