import React from 'react';
import GenericFolderView from '../components/GenericFolderView';

const AcademicInfoFolderView = () => {
  return (
    <GenericFolderView
      title="අධ්‍යයන තොරතුරු"
      apiEndpoint="academic-info"
      routePath="/academic-info"
      sectionName="අධ්‍යයන තොරතුරු"
    />
  );
};

export default AcademicInfoFolderView;
