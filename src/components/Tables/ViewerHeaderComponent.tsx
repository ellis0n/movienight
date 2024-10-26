import React from 'react';

interface ViewerHeaderComponentProps {
  displayName: string;
  viewerId: string;
}

const ViewerHeaderComponent: React.FC<ViewerHeaderComponentProps> = ({ displayName, viewerId }) => {
  return (
    <div>
      <a href={`/viewers/${viewerId}`} className="text-blue-600 hover:underline">
        {displayName}
      </a>
    </div>
  );
};

export default ViewerHeaderComponent;
