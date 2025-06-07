import React from 'react';
import GenericFolderManager from '../components/GenericFolderManager';

const AksharavinyasayaPage = () => {
  return (
    <GenericFolderManager
      title="අක්ෂර වින්‍යාසය"
      description="සිංහල අක්ෂර මාලාවේ අක්ෂර වින්‍යාසය පිළිබඳ සම්පූර්ණ අධ්‍යයන සම්පත් මෙහි ඇත. අකුරුවල සංයෝජන, පිල්ලම් සහ අක්ෂර වින්‍යාස ක්‍රම පිළිබඳ විස්තර ලබා ගන්න."
      apiEndpoint="aksharavinyasaya"
      routePath="/aksharavinyasaya"
      sectionName="අක්ෂර වින්‍යාසය"
    />
  );
};

export default AksharavinyasayaPage;
