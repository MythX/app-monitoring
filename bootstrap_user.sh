#!/usr/bin/env bash

#
# préparation poste de dev
#

cd /vagrant
npm install
bower install --config.interactive=false

echo "You can now lanch node server with 'node server.js' in $(pwd)"

