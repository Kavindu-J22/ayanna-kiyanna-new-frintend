import React from 'react';
import GenericFolderManager from '../components/GenericFolderManager';

const TeacherHandbookPage = () => {
  return (
    <GenericFolderManager
      title="ගුරු අත් පොත්"
      description="සිංහල ගුරුවරුන් සඳහා අත් පොත් සහ මාර්ගෝපදේශන මෙහි ඇත. ගුරුවරුන්ගේ වෘත්තීය දියුණුව සඳහා අවශ්‍ය සියලුම සම්පත් ලබා ගන්න."
      apiEndpoint="teacher-handbook"
      routePath="/teacher-handbook"
      sectionName="ගුරු අත් පොත්"
    />
  );
};

export default TeacherHandbookPage;
