import { Button, Spin } from 'antd';
import React, {useState, useEffect} from 'react';
import { HUDDLE_PROJECT_ID } from '../util/constants';
import { useHuddle01 } from '@huddle01/react';
import { useRecording } from '@huddle01/react/hooks';
import Video from './VideoFeed';
import VideoFeed from './VideoFeed';


// import { useLivestream } from '@huddle01/react/hooks';

const LiveStream = () => {
    const { initialize, isInitialized } = useHuddle01();
 
    useEffect(() => {
      // its preferable to use env vars to store projectId
      console.log('init', HUDDLE_PROJECT_ID)
      initialize(HUDDLE_PROJECT_ID);
    }, []);
    // const isInitialized = true;
  
    if (!isInitialized) {
      return <Spin />;
    }
  
 
    // if(inProgress) return (<div>...loading</div>)
  
    return (
      <div>
        <VideoFeed/>
      </div>
    )}

export default LiveStream;



