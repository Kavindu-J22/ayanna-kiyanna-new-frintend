import React from 'react';
import GenericFolderManager from '../components/GenericFolderManager';

const SubjectGuidelinesPage = () => {
  return (
    <GenericFolderManager
      title="විෂය නිර්දේශ"
      description="සිංහල විෂය නිර්දේශ සහ අධ්‍යයන මාර්ගෝපදේශ මෙහි ඇත. විෂය අධ්‍යයනය සඳහා අවශ්‍ය සියලුම මාර්ගෝපදේශන සහ සම්පත් ලබා ගන්න."
      apiEndpoint="subject-guidelines"
      routePath="/subject-guidelines"
      sectionName="විෂය නිර්දේශ"
    />
  );
};

export default SubjectGuidelinesPage;
