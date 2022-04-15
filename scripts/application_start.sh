#!/bin/bash

#give permission for everything in the express-app directory
sudo chmod -R 777 /home/ec2-user/babozar-be
sudo chmod -R 777 /home/ec2-user/redis-stable
sudo chmod -R 777 /home/ec2-user/keycloak-17.0.0

cd /home/ec2-user/redis-stable
src/redis-server --daemonize yes
#navigate into our working directory where we have all our github files
cd /home/ec2-user/babozar-be

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
npm install
pm2 install typescript

#start our node app in the background
pm2 start src/server.ts