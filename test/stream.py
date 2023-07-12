import cv2
import subprocess as sp
import threading


class VideoStream():

    def __init__(self):

        self.__is_streaming: bool = False
        self.rtsp_server = 'https://54.144.51.39/broadcast.html'

        self.cap = cv2.VideoCapture(0)

        sizeStr = str(int(self.cap.get(cv2.CAP_PROP_FRAME_WIDTH))) + 'x' + str(int(self.cap.get(cv2.CAP_PROP_FRAME_HEIGHT)))

        print(sizeStr)

        fps = int(self.cap.get(cv2.CAP_PROP_FPS))

        command = ['ffmpeg',
                '-re',
                '-s', sizeStr,
                '-r', str(fps),
                '-i', '-',
                '-pix_fmt', 'yuv420p',
                '-r', '30',
                '-g', '50',
                '-c:v', 'libx264',
                '-b:v', '10M',
                '-bufsize', '40M',
                '-maxrate', '10M',
                '-preset', 'veryfast',
                '-segment_times', '3',
                '-f', 'flv',
                #'-rtsp_transport', 'tcp',
                self.rtsp_server]

        self.process = sp.Popen(command, stdin=sp.PIPE)


    def enable_stream(self, enabled: bool) -> None:
        
        self.__is_streaming = enabled

        if enabled:
            self.streaming = threading.Thread(target=self.__streaming_routine)
            self.streaming.start()


    def __streaming_routine(self) -> None:
        
        while self.cap.isOpened() and self.__is_streaming:

            raw_frame = self.cap.read()[1]
            frame = cv2.imencode('.png', raw_frame)[1]
            self.process.stdin.write(frame.tobytes())

if __name__ == '__main__':

    stream = VideoStream()
    stream.enable_stream(True)

    while True:
        continue
