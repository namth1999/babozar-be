#!/bin/bash
#Stopping existing node servers
echo "Stopping any existing node servers"
#download node and npm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node
npm install pm2 -g
pm2 del all