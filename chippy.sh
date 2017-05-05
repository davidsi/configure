# set up the chippy ruxpin project
#
echo setting up chippy

git clone https://github.com/davidsi/chippy.git 
git clone https://github.com/davidsi/node-lib.git libs/node-lib

echo "cd libs/node-lib; git stash save; git pull; git stash pop; cd ../.. ">>git-sync.sh
echo "cd chippy; git stash save; git pull; git stash pop; cd .. ">>git-sync.sh
