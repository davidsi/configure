# generic setup
#
echo setting up "$1"

if [ ! -d "$1" ]; then 
	git clone https://github.com/davidsi/$1.git 
	echo "cd $1; git stash save; git pull; git stash pop; cd .. ">>git-sync.sh
else 
	echo "$1 repo already present"
fi

