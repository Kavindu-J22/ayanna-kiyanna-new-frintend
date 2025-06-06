import React from 'react';
import GenericFolderView from '../components/GenericFolderView';

const ExtracurricularFolderView = () => {
  return (
    <GenericFolderView
      title="විෂය බාහිර ක්‍රියාකාරකම්"
      apiEndpoint="extracurricular"
      routePath="/extracurricular"
      sectionName="විෂය බාහිර ක්‍රියාකාරකම්"
    />
  );
};

export default ExtracurricularFolderView;
