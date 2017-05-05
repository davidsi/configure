# generic setup
#
if [ "$2" == "" ]; then 
	echo setting up "$1"

	if [ ! -d "$1" ]; then 
		git clone https://github.com/davidsi/$1.git 
		echo "cd $1; git stash save; git pull; git stash pop; cd .. ">>git-sync.sh
	else 
		echo "$1 repo already present"
	fi
elif  [ "$1" == "lib" ]; then 
	echo setting up "$2"

	if [ ! -d "libs/$2" ]; then 
		git clone https://github.com/davidsi/$2.git libs/$2
		echo "cd libs/$2; git stash save; git pull; git stash pop; cd ../.. ">>git-sync.sh
	else 
		echo "$2 repo already present"
	fi
else
fi


