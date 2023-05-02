import React, { useEffect, useRef, useState } from 'react';

import { useEventListener, useHuddle01 } from '@huddle01/react';
import { Audio, Video } from '@huddle01/react/components';
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
      const { data } = await axios.post(
        'https://iriko.testing.huddle01.com/api/v1/create-room',
        {
          title: 'Stream ' + Date.now(),
          hostWallets: ['0x29f54719E88332e70550cf8737293436E9d7b10b'],
        },
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

  const { initialize, isInitialized } = useHuddle01();
  const { joinLobby } = useLobby();
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

  return (
    <div className="grid grid-cols-2">
      <div>
        <h2 className="text-2xl">LiveStream</h2>
        <p>{JSON.stringify(state.value)}</p>
        {!hasRoom && <div>
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder='Enter existing room ID'  />
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

        {hasRoom && <div>
          <h3>Room ID: {roomId}</h3>

          <Button
            disabled={!joinLobby.isCallable && roomId}
            onClick={() => {
              joinLobby(roomId);
            }}
          >
            Join lobby
          </Button>
          <br />
          <div>
            <h2>Stream:</h2>
            <video ref={videoRef} 
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
          <RecordingControl/>
          </div>

          <br />
          <h2 className="text-3xl text-yellow-500 font-extrabold">Main Controls</h2>
          <div className="flex gap-4 flex-wrap">
            <Button
              disabled={!fetchVideoStream.isCallable}
              onClick={fetchVideoStream}
            >
              Enable Video
            </Button>

            <Button
              disabled={!fetchAudioStream.isCallable}
              onClick={fetchAudioStream}
            >
              Enable Audio
            </Button>

            <Button disabled={!joinRoom.isCallable} onClick={joinRoom}>
              Join Room
            </Button>

            <Button
              disabled={!state.matches('Initialized.JoinedLobby')}
              onClick={() => send('LEAVE_LOBBY')}
            >
              Leave lobby
            </Button>

            <Button
              disabled={!stopVideoStream.isCallable}
              onClick={stopVideoStream}
            >
              Stop streaming
            </Button>
            <Button
              disabled={!stopAudioStream.isCallable}
              onClick={stopAudioStream}
            >
              Pause audio
            </Button>
          </div>
          <br />
          {false && <div>
          <h2 className="text-3xl text-green-600 font-extrabold">Room</h2>
          <div className="flex gap-4 flex-wrap">
            <Button
              disabled={!produceAudio.isCallable}
              onClick={() => produceAudio(micStream)}
            >
              PRODUCE_MIC
            </Button>

            <Button
              disabled={!produceVideo.isCallable}
              onClick={() => produceVideo(camStream)}
            >
              PRODUCE_CAM
            </Button>

            <Button
              disabled={!stopProducingAudio.isCallable}
              onClick={() => stopProducingAudio()}
            >
              STOP_PRODUCING_MIC
            </Button>

            <Button
              disabled={!stopProducingVideo.isCallable}
              onClick={() => stopProducingVideo()}
            >
              STOP_PRODUCING_CAM
            </Button>

            <Button disabled={!leaveRoom.isCallable} onClick={() => {
              setRoomId(null)
              leaveRoom()
            }}>
              LEAVE_ROOM
            </Button>
          </div>
            </div>}

          {/* Uncomment to see the Xstate Inspector */}
          {/* <Inspect /> */}
        
        </div>}
      </div>
    </div>
  );
};
