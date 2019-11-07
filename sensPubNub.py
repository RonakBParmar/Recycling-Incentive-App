from Pubnub import Pubnub 
import RPi.GPIO as GPIO
import time
import sys


loopcount = 0

Publish_key = len(sys.argv) > 1 and sys.argv[1] or 'demo'
subscribe_key = len(sys.argv) > 2 and sys.argv[2] or 'demo'
secret_key = len(sys.argv) > 3 and sys.argv[3] or 'demo'
cipher_key = len(sys.argv) > 4 and sys.argv[4] or ''
ssl_on = len(sys.argv) > 5 and bool(sys.argv[5]) or False

pubnub = Pubnub(publish_key=publish_key, subscribe_key=subscribe_key,secret_key=secret_key, cipher_key=cipher_key, ssl_on=ssl_on)
channel = 'Rangefinder'

GPIO.setmode(GPIO.BCM)

TRIG = 20
ECHO = 26

print("Distance Measurement in Progess")
GPIO.setup(TRIG,GPIO.OUT)

GPIO.setup(ECHO,GPIO.IN)`

GPIO.output(TRIG,False)
print("Waiting for sensor to settle.")

time.sleep(2)

while True:
   GPIO.output(TRIG, True)
   time.sleep(0.00001)
   GPIO.output(TRIG, False)