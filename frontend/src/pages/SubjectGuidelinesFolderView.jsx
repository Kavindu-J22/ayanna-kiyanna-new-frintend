import React from 'react';
import GenericFolderView from '../components/GenericFolderView';

const SubjectGuidelinesFolderView = () => {
  return (
    <GenericFolderView
      title="විෂය නිර්දේශ"
      apiEndpoint="subject-guidelines"
      routePath="/subject-guidelines"
      sectionName="විෂය නිර්දේශ"
    />
  );
};

export default SubjectGuidelinesFolderView;
