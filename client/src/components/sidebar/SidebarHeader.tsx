import React from 'react';
import { COLORS } from '@/constants/colors';

const SidebarHeader: React.FC = () => {
  return (
    <div className="mb-6 pb-4 flex items-center" style={{ borderBottom: `1px solid ${COLORS.sidebarBorder}` }}>
      <h1 
        className="text-3xl font-extrabold" 
        style={{ color: COLORS.sidebarText }}
      >
        atrova
      </h1>
    </div>
  );
};

export default SidebarHeader; 