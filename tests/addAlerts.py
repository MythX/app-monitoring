#!/usr/bin/python

import json
import random
import urllib2

topic	  = ['TOPIC_1', 'TOPIC_2']
subtopic  = ['SUB_TOPIC_1', 'SUB_TOPIC_2']
priority = ['BLOCKER', 'CRITICAL', 'MAJOR', 'WARNING']
message   = ['Hello', 'Bonjour']
action    = [None, 'xwiki action', 'http://wiki.org/action']

URL="http://localhost:8044/alert"
NUMBER_OF_ALERTS=100

print "Will generate " + str(NUMBER_OF_ALERTS) + " alerts"

for i in range(NUMBER_OF_ALERTS) :
	t = random.choice(topic)
	s = random.choice(subtopic)
	p = random.choice(priority)
	m = random.choice(message)
	a = random.choice(action)
	data = json.dumps({"topic":t, "subtopic":s, "priority":p, "message":m, "action":a})
	req = urllib2.Request(URL, data, {'Content-Type': 'application/json'})
	urllib2.urlopen(req)

print "Over !"
