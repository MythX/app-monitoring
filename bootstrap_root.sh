#!/usr/bin/env bash

#
# Installation outils de dev
#

apt-get update
apt-get install -y vim curl git byobu build-essential libxml2-dev libxslt1-dev libcurl4-openssl-dev libsqlite3-dev libyaml-dev zlib1g-dev ruby1.9.1-dev ruby1.9.1

apt-get install -y python-software-properties python g++ make
add-apt-repository -y ppa:chris-lea/node.js
apt-get update
apt-get install -y nodejs mongodb-server

npm update -g npm
npm install -g bower
