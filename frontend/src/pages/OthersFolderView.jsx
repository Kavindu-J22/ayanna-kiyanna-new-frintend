import React from 'react';
import GenericFolderView from '../components/GenericFolderView';

const OthersFolderView = () => {
  return (
    <GenericFolderView
      title="වෙනත් සම්පත්"
      apiEndpoint="others"
      routePath="/others"
      sectionName="වෙනත් සම්පත්"
    />
  );
};

export default OthersFolderView;
