import React from 'react';
import GenericFolderView from '../components/GenericFolderView';

const VideoLessonsFolderView = () => {
  return (
    <GenericFolderView
      title="වීඩියෝ පාඩම්"
      apiEndpoint="video-lessons"
      routePath="/video-lessons"
      sectionName="වීඩියෝ පාඩම්"
    />
  );
};

export default VideoLessonsFolderView;
