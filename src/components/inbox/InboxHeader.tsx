
import React from 'react';
import { Inbox, Archive, Send, FileText, Trash2 } from 'lucide-react';
import InboxTabs from './InboxTabs';

interface InboxHeaderProps {
  unreadCount: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const InboxHeader = ({ 
  unreadCount, 
  activeTab, 
  onTabChange, 
  currentPage, 
  totalPages, 
  onPageChange 
}: InboxHeaderProps) => {
  const getTabIcon = () => {
    switch (activeTab) {
      case 'inbox':
        return <Inbox className="w-4 h-4 text-muted-foreground" />;
      case 'drafts':
        return <FileText className="w-4 h-4 text-muted-foreground" />;
      case 'sent':
        return <Send className="w-4 h-4 text-muted-foreground" />;
      case 'archive':
        return <Archive className="w-4 h-4 text-muted-foreground" />;
      case 'trash':
        return <Trash2 className="w-4 h-4 text-muted-foreground" />;
      default:
        return <Inbox className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getTabLabel = () => {
    switch (activeTab) {
      case 'inbox':
        return 'Inbox';
      case 'drafts':
        return 'Drafts';
      case 'sent':
        return 'Sent';
      case 'archive':
        return 'Archive';
      case 'trash':
        return 'Trash';
      default:
        return 'Inbox';
    }
  };

  return (
    <div className="border-b border-border">
      <div className="px-6 py-4">
        <div className="flex items-center gap-3">
          {getTabIcon()}
          <h1 className="text-sm font-medium">{getTabLabel()}</h1>
          {activeTab === 'inbox' && unreadCount > 0 && (
            <span className="text-xs text-muted-foreground">({unreadCount} unread)</span>
          )}
        </div>
      </div>
      <InboxTabs
        activeTab={activeTab}
        onTabChange={onTabChange}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default InboxHeader;
