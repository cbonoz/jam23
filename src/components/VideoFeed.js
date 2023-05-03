import React, { useEffect, useRef, useState } from 'react';

import { useEventListener, useHuddle01 } from '@huddle01/react';
import { Audio, Video } from '@huddle01/react/components';
import { MD5 } from 'crypto-js';
/* Uncomment to see the Xstate Inspector */
// import { Inspect } from '@huddle01/react/components';

import {
  useAudio,
  useLobby,
  useMeetingMachine,
  usePeers,
  useRoom,
  useVideo,
} from '@huddle01/react/hooks';
import { Button, Input } from 'antd';
import { HUDDLE_API_KEY } from '../util/constants';
import axios from 'axios';
import RecordingControl from './RecordingControl';
import { PROXY_URL } from '../util';

export default function VideoFeed({pathRoomId}) {
  const videoRef = useRef(null);
  const [roomId, setRoomId] = React.useState();
  const [ready, setReady] = React.useState(false);
  const [value, setValue] = React.useState();

  useEffect(() => {
    if (pathRoomId) {
      setRoomId(pathRoomId)
    }
  }, [pathRoomId])


  async function getRoomId() {
    // https://www.huddle01.com/docs/apis/create-room
    console.log('get room')
    try {
      const payload = {
        body: {
          title: 'Stream ' + Date.now(),
          hostWallets: ['0x29f54719E88332e70550cf8737293436E9d7b10b'],
        },
        hash: MD5(window.location.origin).toString(),
        url: 'https://iriko.testing.huddle01.com/api/v1/create-room',
        type: 'POST',
      }
      const { data } = await axios.post(
        PROXY_URL,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': HUDDLE_API_KEY
          },
        })
      console.log('data', data)
      setRoomId(data.data.roomId)
    } catch (error) {
      console.error('error getting room', error);

    }
  }

  const { state, send } = useMeetingMachine();
  // Event Listner
  useEventListener('lobby:cam-on', () => {
    if (state.context.camStream && videoRef.current)
      videoRef.current.srcObject = state.context.camStream;
  });

  const { joinLobby, error } = useLobby();
  const {
    fetchAudioStream,
    produceAudio,
    stopAudioStream,
    stopProducingAudio,
    stream: micStream,
  } = useAudio();
  const {
    fetchVideoStream,
    produceVideo,
    stopVideoStream,
    stopProducingVideo,
    stream: camStream,
  } = useVideo();
  const { joinRoom, leaveRoom } = useRoom();

  const { peers } = usePeers();

  const hasRoom = !!roomId;
  const shareableUrl = window.location.origin + '/stream/' + roomId

  return (
    <div className="grid grid-cols-2">
      <div>
        {/* <h2 className="text-2xl">LiveStream</h2> */}
        {/* <p>{JSON.stringify(state.value)}</p> */}
        {!hasRoom && <div>
        <Input style={{width: '400px'}} prefix="Room ID" value={value} onChange={(e) => setValue(e.target.value)} placeholder='Enter existing room ID'  />
        <br/>
        <br/>
        <Button
        className='standard-button'
        type='primary'
          disabled={!value}
          onClick={() => {
            setRoomId(value)
          }}
        >Save</Button>&nbsp;
        or &nbsp;
        <Button
        className='standard-button'
        type='secondary'
          disabled={roomId}
          onClick={getRoomId}
        >
          Create new room id
        </Button>

        </div>}

        {error && <p className='error-text'>{error}</p>}

        {hasRoom && <div>
          <h3>Room ID: {roomId}</h3>
          <p>
            <a href={shareableUrl} target='_blank'>Shareable URL</a>
          </p>
          

          <Button
            disabled={!joinLobby.isCallable && roomId}
            onClick={() => {
              joinLobby(roomId);
            }}
          >
            Join lobby
          </Button>&nbsp;

          <Button
              disabled={!state.matches('Initialized.JoinedLobby')}
              onClick={() => send('LEAVE_LOBBY')}
            >
              Leave lobby
            </Button>

          <br />
          <div>
            <h2>Stream:</h2>
            <video 
            ref={videoRef} 
            className='video-stream'
            autoPlay 
            />
            <div className="grid grid-cols-4">
              {Object.values(peers)
                .filter(peer => peer.cam)
                .map(peer => (
                  <Video
                  className='video-stream'
                    key={peer.peerId}
                    peerId={peer.peerId}
                    track={peer.cam}
                    debug
                  />
                ))}
              {Object.values(peers)
                .filter(peer => peer.mic)
                .map(peer => (
                  <Audio key={peer.peerId} peerId={peer.peerId} track={peer.mic} />
                ))}
            </div>
          <RecordingControl roomId={roomId}/>
          </div>

          <br />
          <h2 className="text-3xl text-yellow-500 font-extrabold">Main Controls</h2>
          <div className="flex gap-4 flex-wrap">
            <Button
              disabled={!fetchVideoStream.isCallable}
              onClick={fetchVideoStream}
            >
              Start streaming
            </Button>

            <Button
              disabled={!stopVideoStream.isCallable}
              onClick={stopVideoStream}
            >
              Stop streaming
            </Button>
        
            <Button
              disabled={!fetchAudioStream.isCallable}
              onClick={fetchAudioStream}
            >
              Enable Audio
            </Button>

            <Button
              disabled={!stopAudioStream.isCallable}
              onClick={stopAudioStream}
            >
              Pause audio
            </Button>
          </div>
          <br />
          <div>
          <h2 className="text-3xl text-green-600 font-extrabold">Sharing</h2>
          <div className="flex gap-4 flex-wrap">
          <Button disabled={!joinRoom.isCallable} onClick={joinRoom}>
              Join Room
            </Button>

            <Button disabled={!leaveRoom.isCallable} onClick={() => {
              setRoomId(null)
              leaveRoom()
            }}>
              Leave room
            </Button>
            <Button
              disabled={!produceAudio.isCallable}
              onClick={() => produceAudio(micStream)}
            >
              Share Mic
            </Button>

            <Button
              disabled={!produceVideo.isCallable}
              onClick={() => produceVideo(camStream)}
            >
              Share video
            </Button>

            <Button
              disabled={!stopProducingAudio.isCallable}
              onClick={() => stopProducingAudio()}
            >
              Stop sharing mic
            </Button>

            <Button
              disabled={!stopProducingVideo.isCallable}
              onClick={() => stopProducingVideo()}
            >
              Stop sharing video
            </Button>

   
          </div>
            </div>

          {/* Uncomment to see the Xstate Inspector */}
          {/* <Inspect /> */}
        
        </div>}
      </div>
    </div>
  );
};
