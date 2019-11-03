# this is a file for subsonic test

import RPi.GPIO as GPIO
import time
GPIO.setmode(GPIO.BCM)

TRIG = 20
ECHO = 26
LED = 18
print ("Distance measurement in progress")

GPIO.setup(TRIG,GPIO.OUT)
GPIO.setup(ECHO,GPIO.IN)
GPIO.setup(LED, GPIO.OUT)
GPIO.setwarnings(False)


# loop entire program
while True: 

#    GPIO.output(LED,GPIO.LOW)

    GPIO.output(TRIG, False)
#    print ("Waiting for sensor to settle")
#    time.sleep(2)                               #delay for 2 seconds
    time.sleep(0.1)

    GPIO.output(TRIG, True)                     # start the ultraSonic sensor send sound.
#    GPIO.output(LED,GPIO.HIGH)

    time.sleep(0.00001)                         # delay as it blast with ultrasonic for 1ms
    GPIO.output(TRIG, False)                    # stop sensor
#    GPIO.output(LED,GPIO.LOW)


    while GPIO.input(ECHO)==0:                  #low pulse is start of send Ultra sonic wave
        pulse_start=time.time()                 # gets the startTime

    while GPIO.input(ECHO)==1:                  #high pulse means the sound signal has returned
        pulse_end=time.time()                   # sets this as end time.

    pulse_duration = pulse_end - pulse_start    #gets the pulse duration

    distance = pulse_duration * 17150           #physics is involved, time and sound, but this figure gets the distance in cm

    distance = round(distance, 2)               # round off so number is human readable


    if distance > 2 and distance < 400:
        print ("** Distance: ", distance, "cm **")
    else:
        print ("!! Distance is out of range !!")


    if distance > 2 and distance <20:
        #print ("LED on")
        GPIO.output(LED,GPIO.HIGH)
    else:
        GPIO.output(LED,GPIO.LOW)
        #print ("LED off")
GPIO.cleanup()
    


# results
# the distance detected  get more precise at longer distance
#   most of the time, the error is under 1 cm. as in 20 cm is reported as 20.46cm
#   where else 4cm object is reported as 4.2-4.4 cm.
