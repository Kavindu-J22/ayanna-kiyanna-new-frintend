import React from 'react';
import GenericFolderManager from '../components/GenericFolderManager';

const OthersPage = () => {
  return (
    <GenericFolderManager
      title="වෙනත් සම්පත්"
      description="සිංහල විෂය අධ්‍යයනය සඳහා වෙනත් ප්‍රයෝජනවත් සම්පත් සහ මාර්ගෝපදේශන මෙහි ඇත. අතිරේක අධ්‍යයන සම්පත් ලබා ගන්න."
      apiEndpoint="others"
      routePath="/others"
      sectionName="වෙනත් සම්පත්"
    />
  );
};

export default OthersPage;
