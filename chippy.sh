# set up the chippy ruxpin project
#
echo setting up chippy

if [ ! -d "chippy" ]; then 
	git clone https://github.com/davidsi/chippy.git 
	echo "cd chippy; git stash save; git pull; git stash pop; cd .. ">>git-sync.sh
else 
	echo "chippy repo already present"
fi

if [ ! -d "libs/node-lib" ]; then 
	git clone https://github.com/davidsi/node-lib.git libs/node-lib
	echo "cd libs/node-lib; git stash save; git pull; git stash pop; cd ../.. ">>git-sync.sh
else 
	echo "node library repo already present"
fi
