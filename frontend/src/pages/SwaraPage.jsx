import React from 'react';
import GenericFolderManager from '../components/GenericFolderManager';

const SwaraPage = () => {
  return (
    <GenericFolderManager
      title="ස්වර"
      description="සිංහල අක්ෂර මාලාවේ ස්වර අකුරු පිළිබඳ සම්පූර්ණ අධ්‍යයන සම්පත් මෙහි ඇත. ස්වර අකුරුවල ලක්ෂණ, භාවිතය සහ උච්චාරණය පිළිබඳ විස්තර ලබා ගන්න."
      apiEndpoint="swara"
      routePath="/swara"
      sectionName="ස්වර"
    />
  );
};

export default SwaraPage;
