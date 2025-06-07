import React from 'react';
import GenericFolderView from '../components/GenericFolderView';

const SwaraFolderView = () => {
  return (
    <GenericFolderView
      title="ස්වර"
      apiEndpoint="swara"
      routePath="/swara"
      sectionName="ස්වර"
    />
  );
};

export default SwaraFolderView;
