
Quick start
===========

You need virtualbox and the latest vagrant release : https://www.vagrantup.com/downloads.html

You may also need to configure your proxy with :

    vagrant plugin install vagrant-proxyconf

When the VM is started, you can launch the web server

    vagrant ssh
	cd /vagrant
	node server.js
	

Webservice usage example
========================

Push a new alert :

    curl -XPOST '127.0.0.1:8080/alert' -H "Content-Type: application/json" --data '{
         "topic" : "My topic",
         "subtopic" : "My subtopic",
         "criticity" : "MAJOR",
         "message" : "The message",
         "action" : "Nothing to do :)"
    }'

Retreive opened alert list :

    http://127.0.0.1:8080/alertsGroup
