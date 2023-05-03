
import { useRecording } from '@huddle01/react/hooks';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useRecorder } from "@huddle01/react/app-utils";
import { IS_LOCAL } from '../util/constants';


const RecordingControl = ({roomId}) => {
    const { startRecording, stopRecording, isStarting, inProgress, isStopping, data, error } = useRecording();

    // useRecorder(roomId, process.env.REACT_APP_PROJECT_ID || "");

    const handleStopRecording = (data) => {
        console.log('data', data)
        // Download data as blob with name recording_{datetime}.mp4
        const fileName = `recording_${new Date().toISOString()}.mp4`;
        const blob = new Blob([data], { type: 'video/mp4' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    if (inProgress) return (<div>...loading</div>)

    return (
        <div>
            <Button
                type='primary'
                disabled={!startRecording?.isCallable}
                onClick={() => startRecording('video')}
            >
                Start recording
            </Button>


            <Button disabled={false} onClick={handleStopRecording}>
                Stop recording {IS_LOCAL ? '(demo)' : ''}
            </Button>
            <p>{isStarting ? "Recording..." : error}</p>
        </div >
    );
};

export default RecordingControl;


