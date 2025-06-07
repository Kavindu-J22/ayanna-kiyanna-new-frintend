import React from 'react';
import GenericFolderManager from '../components/GenericFolderManager';

const ViyanjanaPage = () => {
  return (
    <GenericFolderManager
      title="ව්‍යංජන"
      description="සිංහල අක්ෂර මාලාවේ ව්‍යංජන අකුරු පිළිබඳ සම්පූර්ණ අධ්‍යයන සම්පත් මෙහි ඇත. ව්‍යංජන අකුරුවල වර්ගීකරණය, ලක්ෂණ සහ භාවිතය පිළිබඳ විස්තර ලබා ගන්න."
      apiEndpoint="viyanjana"
      routePath="/viyanjana"
      sectionName="ව්‍යංජන"
    />
  );
};

export default ViyanjanaPage;
