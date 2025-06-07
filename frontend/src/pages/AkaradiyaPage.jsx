import React from 'react';
import GenericFolderManager from '../components/GenericFolderManager';

const AkaradiyaPage = () => {
  return (
    <GenericFolderManager
      title="අකාරාදී පිළිවෙල"
      description="සිංහල අක්ෂර මාලාවේ අකාරාදී පිළිවෙල පිළිබඳ සම්පූර්ණ අධ්‍යයන සම්පත් මෙහි ඇත. අකුරුවල අනුක්‍රමික පිළිවෙල, වර්ගීකරණය සහ සම්ප්‍රදායික පිළිවෙල පිළිබඳ විස්තර ලබා ගන්න."
      apiEndpoint="akaradiya"
      routePath="/akaradiya"
      sectionName="අකාරාදී පිළිවෙල"
    />
  );
};

export default AkaradiyaPage;
