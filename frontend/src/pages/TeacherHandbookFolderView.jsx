import React from 'react';
import GenericFolderView from '../components/GenericFolderView';

const TeacherHandbookFolderView = () => {
  return (
    <GenericFolderView
      title="ගුරු අත් පොත්"
      apiEndpoint="teacher-handbook"
      routePath="/teacher-handbook"
      sectionName="ගුරු අත් පොත්"
    />
  );
};

export default TeacherHandbookFolderView;
