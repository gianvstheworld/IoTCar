import subprocess as sp
import os
from system import System


class VideoStream():

    def __init__(self, device_id: str):

        self.__streming_script = os.path.join(os.path.dirname(System.script_path), 'resources/stream.sh')
        self.__rtsp_server = f'rtsp://igbt.eesc.usp.br:1935/{device_id}'


    def enable_stream(self, enabled: bool) -> None:

        if enabled:
            sp.Popen([self.__streming_script, self.__rtsp_server])
        else: 
            sp.Popen(['pkill', 'ffmpeg'])