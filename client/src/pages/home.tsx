import { useState, useEffect } from "react";
import { SearchBar } from "@/components/search-bar";
import { BottomNavigation } from "@/components/bottom-navigation";
import { QASection } from "@/components/qa-section";
import { PrayersSection } from "@/components/prayers-section";
import { DocumentsSection } from "@/components/documents-section";
import { BibleSection } from "@/components/bible-section";
import { ExpandedAnswerModal } from "@/components/expanded-answer-modal";
import { LanguageSelector } from "@/components/language-selector";
import { useOfflineStorage } from "@/hooks/use-offline-storage";
import { useToast } from "@/hooks/use-toast";
import { Settings } from "lucide-react";

type ActiveTab = 'qa' | 'prayers' | 'documents' | 'bible';

export default function Home() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('qa');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  const { isOnline, initializeOfflineData } = useOfflineStorage();
  const { toast } = useToast();

  useEffect(() => {
    // Initialize offline data on first load
    initializeOfflineData().catch((error) => {
      console.error('Failed to initialize offline data:', error);
      toast({
        title: "Offline Initialization Failed",
        description: "Some content may not be available offline",
        variant: "destructive"
      });
    });
  }, [initializeOfflineData, toast]);

  useEffect(() => {
    // Update online status
    const handleOnline = () => {
      toast({
        title: "Back Online",
        description: "Content will now sync with the server"
      });
    };

    const handleOffline = () => {
      toast({
        title: "Offline Mode",
        description: "Using cached content"
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const renderContent = () => {
    switch (activeTab) {
      case 'qa':
        return <QASection searchQuery={searchQuery} onExpandAnswer={setSelectedQuestion} />;
      case 'prayers':
        return <PrayersSection searchQuery={searchQuery} />;
      case 'documents':
        return <DocumentsSection searchQuery={searchQuery} />;
      case 'bible':
        return <BibleSection searchQuery={searchQuery} />;
      default:
        return <QASection searchQuery={searchQuery} onExpandAnswer={setSelectedQuestion} />;
    }
  };

  return (
    <div className="min-h-screen pb-20 bg-catholic-cream">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-semibold catholic-green text-shadow">
              Catholic Faith Defender
            </h1>
            <div className="flex items-center space-x-3">
              {!isOnline && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs text-gray-600">Offline</span>
                </div>
              )}
              <LanguageSelector />
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-all">
                <Settings className="w-6 h-6 text-gray-600" />
              </button>
            </div>
          </div>
          
          <SearchBar 
            value={searchQuery} 
            onChange={setSearchQuery}
            placeholder="Search questions, prayers, documents..."
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Expanded Answer Modal */}
      {selectedQuestion && (
        <ExpandedAnswerModal 
          question={selectedQuestion}
          isOpen={!!selectedQuestion}
          onClose={() => setSelectedQuestion(null)}
        />
      )}
    </div>
  );
}
