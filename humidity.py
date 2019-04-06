#!/usr/bin/python

import RPi.GPIO as GPIO
import time

#GPIO setup
channel=26
GPIO.setmode(GPIO.BCM)
GPIO.setup(channel, GPIO.IN)

def check(channel):
	if GPIO.input(channel):
		print ("water me")
	else:
		print("I'm drowning")

GPIO.add_event_detect(channel, GPIO.BOTH, bouncetime= 300)
GPIO.add_event_callback(channel, check)

while True:
	time.sleep(1)
	check(channel)

