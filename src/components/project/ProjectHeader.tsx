
import React from 'react';
import { Calendar } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getProjectDisplayName, getClientData } from '@/data/projectClientData';

const ProjectHeader = () => {
  const { projectId } = useParams();
  const clientData = getClientData(projectId);

  return (
    <div className="border-b border-border px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-base">{getProjectDisplayName(projectId)}</span>
          </div>
        </div>
        
        {/* Right side - Status and Date Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>5/8/23, 5 Weeks</span>
          </div>
          <Select value="in-progress" onValueChange={() => {}}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="complete">Complete</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
              <SelectItem value="not-started">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
