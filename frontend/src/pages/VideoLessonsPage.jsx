import React from 'react';
import GenericFolderManager from '../components/GenericFolderManager';

const VideoLessonsPage = () => {
  return (
    <GenericFolderManager
      title="වීඩියෝ පාඩම්"
      description="සිංහල විෂය වීඩියෝ පාඩම් සහ අධ්‍යයන සම්පත් මෙහි ඇත. දෘශ්‍ය අධ්‍යයන ක්‍රමවේදයෙන් ඔබේ දැනුම වර්ධනය කරගන්න."
      apiEndpoint="video-lessons"
      routePath="/video-lessons"
      sectionName="වීඩියෝ පාඩම්"
    />
  );
};

export default VideoLessonsPage;
