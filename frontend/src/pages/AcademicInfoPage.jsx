import React from 'react';
import GenericFolderManager from '../components/GenericFolderManager';

const AcademicInfoPage = () => {
  return (
    <GenericFolderManager
      title="අධ්‍යයන තොරතුරු"
      description="ආයතනයේ අධ්‍යයන තොරතුරු, විෂය නිර්දේශ, සහ අධ්‍යයන ක්‍රමවේද මෙහි ඇත. ශිෂ්‍යයන්ගේ අධ්‍යයන ගමන සඳහා අවශ්‍ය සියලුම තොරතුරු ලබා ගන්න."
      apiEndpoint="academic-info"
      routePath="/academic-info"
      sectionName="අධ්‍යයන තොරතුරු"
    />
  );
};

export default AcademicInfoPage;
