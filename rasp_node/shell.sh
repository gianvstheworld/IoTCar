#!/bin/bash

VIDSOURCE="/dev/video0"  # Caminho para o dispositivo de vídeo USB
AUDIO_OPTS=""  # Nenhum áudio disponível para a câmera
VIDEO_OPTS="-s 854x480 -c:v libx264 -b:v 800000"  # Opções de vídeo conforme necessário
OUTPUT_HLS="-hls_time 10 -hls_list_size 10 -start_number 1"  # Opções do HLS
OUTPUT_FILE="mystream.m3u8"  # Nome do arquivo de saída

ffmpeg -f v4l2 -input_format mjpeg -i "$VIDSOURCE" -y $AUDIO_OPTS $VIDEO_OPTS $OUTPUT_HLS $OUTPUT_FILE
