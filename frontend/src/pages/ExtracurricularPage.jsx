import React from 'react';
import GenericFolderManager from '../components/GenericFolderManager';

const ExtracurricularPage = () => {
  return (
    <GenericFolderManager
      title="විෂය බාහිර ක්‍රියාකාරකම්"
      description="ආයතනයේ විෂය බාහිර ක්‍රියාකාරකම්, තරඟ, සහ විශේෂ වැඩසටහන් පිළිබඳ තොරතුරු මෙහි ඇත. ශිෂ්‍යයන්ගේ සමස්ත දියුණුව සඳහා අවශ්‍ය සියලුම තොරතුරු ලබා ගන්න."
      apiEndpoint="extracurricular"
      routePath="/extracurricular"
      sectionName="විෂය බාහිර ක්‍රියාකාරකම්"
    />
  );
};

export default ExtracurricularPage;
