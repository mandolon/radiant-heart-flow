
import React, { useRef } from 'react';
import { Paperclip, Plus } from 'lucide-react';
import { useTaskAttachmentContext } from '@/contexts/TaskAttachmentContext';
import { cn } from '@/lib/utils';

interface TaskRowFilesProps {
  hasAttachment: boolean;
  attachmentCount?: number;
  onAddFileClick?: (e: React.MouseEvent) => void;
  taskId?: string; // We now need the taskId to manage attachments
}

const TaskRowFiles = ({
  hasAttachment,
  attachmentCount = 0,
  onAddFileClick,
  taskId,
}: TaskRowFilesProps) => {
  const { getAttachments, addAttachments } = useTaskAttachmentContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get all attachments for this taskId
  const attachments = taskId ? getAttachments(taskId) : [];
  const hasFiles = attachments.length > 0;

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!taskId) return;
    if (e.target.files && e.target.files.length) {
      const files = Array.from(e.target.files);
      addAttachments(taskId, files, "ME");
      e.target.value = "";
    }
  };

  // Dropdown for multiple files
  const [showDropdown, setShowDropdown] = React.useState(false);

  // UI: 
  // - If 1 file: paperclip links directly to it.
  // - If >1: paperclip shows a dropdown with file links.
  return (
    <div className="flex items-center gap-2 relative select-none">
      {(hasFiles || hasAttachment) && (
        <div className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center relative group">
          {attachments.length === 1 ? (
            <a
              href={attachments[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center w-full h-full justify-center"
              title={attachments[0].name}
              onClick={e => e.stopPropagation()}
            >
              <Paperclip className="w-4 h-4 text-gray-600" />
            </a>
          ) : attachments.length > 1 ? (
            <>
              <button
                type="button"
                className="w-full h-full flex items-center justify-center"
                onClick={e => {
                  e.stopPropagation();
                  setShowDropdown(v => !v);
                }}
                aria-label="Show attachments"
              >
                <Paperclip className="w-4 h-4 text-gray-600" />
                <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full text-[10px] px-1">{attachments.length}</span>
              </button>
              {showDropdown && (
                <div
                  className="absolute left-0 top-7 z-20 bg-white border rounded shadow-lg min-w-[180px] py-1"
                  onClick={e => e.stopPropagation()}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  {attachments.map(att => (
                    <a
                      key={att.id}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-3 py-1 text-xs text-gray-800 hover:bg-accent truncate"
                      title={att.name}
                      style={{ maxWidth: 160 }}
                      download={att.name}
                    >
                      {att.name}
                    </a>
                  ))}
                </div>
              )}
            </>
          ) : (
            <Paperclip className="w-4 h-4 text-gray-600" />
          )}
          {(attachments.length === 1) && (
            <span className="absolute -top-2 -right-2 bg-orange-600 text-white rounded-full text-[10px] px-1">1</span>
          )}
          {/* If zero, show nothing */}
        </div>
      )}

      {/* File upload hidden input */}
      <input
        type="file"
        multiple
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileInputChange}
        aria-label="Upload file"
      />
      {/* "+" button always visible (could be on hover, made always visible for accessibility) */}
      <button
        className="p-1 hover:bg-accent rounded flex items-center justify-center"
        style={{ minWidth: 28, minHeight: 28 }}
        onClick={handleUploadClick}
        aria-label="Add file"
        tabIndex={0}
      >
        <Plus className="w-4 h-4" strokeWidth="2" />
      </button>
    </div>
  );
};

export default TaskRowFiles;

