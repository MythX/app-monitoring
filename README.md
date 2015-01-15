
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
         "priority" : "MAJOR",
         "message" : "The message",
         "action" : "Nothing to do :)"
    }'

Retrieve opened alert list :

    http://127.0.0.1:8080/alertsGroup
	
	
Basic HTTP authentication
===========================

You just have to move `users.htpasswd.example` to `users.htpasswd`, and restart node server. Now login is required ! (use xavier:xavier to pass it).

Note that webservices will also need http authentication.


Deployment on openshift
=======================

Default openshift card comes with an old version of npm, which doesn't support modern syntax (see https://github.com/onepiecejs/nodejs-cantas/pull/21).

So, before pushing on openshift repo, I play :

    bower install
	
Note that you may need to configure the proxy, in `.bowerrc` :

    "proxy" : "http://proxy.priv.atos.fr:3128",
    "https-proxy" : "http://proxy.priv.atos.fr:3128"

And uncomment `/inc` in `.gitignore`.
	