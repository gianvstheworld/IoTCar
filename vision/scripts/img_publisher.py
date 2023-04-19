#!/usr/bin/env python3

import cv2
import rospy
from sensor_msgs.msg import Image
from cv_bridge import CvBridge, CvBridgeError

cap = cv2.VideoCapture(0)
print(cap.isOpened())
bridge = CvBridge()

if not cap.isOpened():
    print("Cannot open camera")
    exit()

def talker():
    pub = rospy.Publisher('image', Image, queue_size=1)
    rospy.init_node('image_publisher', anonymous=False)
    rate = rospy.Rate(10) # 10hz
    while not rospy.is_shutdown():
        ret, frame = cap.read()
        if not ret:
            print("Can't receive frame (stream end?)")
            break
        
        msg = bridge.cv2_to_imgmsg(frame, "bgr8")
        pub.publish(msg)

        if cv2.waitKey(1) == ord('q'):
            break

        if rospy.is_shutdown():
            cap.release()
            break
    

if __name__ == '__main__':
    try:
        talker()
    except rospy.ROSInterruptException:
        pass
