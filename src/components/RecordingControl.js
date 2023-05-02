
import { useRecording } from '@huddle01/react/hooks';
import { Button } from 'antd';
import { useEffect } from 'react';

const RecordingControl = () => {
    const { startRecording, stopRecording, isStarting, inProgress, isStopping, data, error } = useRecording();

    useEffect(() => {
        if (data && isStopping) {
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
    }, [isStopping])

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



            <Button disabled={!stopRecording?.isCallable} onClick={stopRecording}>
                Stop recording
            </Button>
            <p>{isStarting ? "Recording..." : error}</p>
        </div >
    );
};

export default RecordingControl;


