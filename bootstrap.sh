#!/usr/bin/env bash

#
# Installation outils de dev
#

apt-get update
apt-get install -y vim curl git build-essential libxml2-dev libxslt1-dev libcurl4-openssl-dev libsqlite3-dev libyaml-dev zlib1g-dev ruby1.9.1-dev ruby1.9.1

sudo apt-get install -y python-software-properties python g++ make
sudo add-apt-repository -y ppa:chris-lea/node.js
sudo apt-get update
sudo apt-get install -y nodejs mongodb-server


#
# préparation poste de dev
#

su - vagrant

cd /vagrant
npm install bower
bower install --config.interactive=false

echo "You can now lanch node server with 'node server.js' in $(pwd)"


