# generic setup - find out what kind of setup this is
#
if [ "$2" == "" ]; then 
	echo setting up "$1"

	folder="."
	target=$1
	toRoot=".."

elif  [ "$1" == "lib" ]; then 
	echo setting up "$2"
	folder="libs"
	target=$2
	toRoot="../.."
else
	echo "configuration $1 $2 not recognized"
	exit
fi

# if the target does not exist, set it up
#
if [ ! -d $folder/$target ]; then 

	# get the git repro
	#
	git clone https://github.com/davidsi/$target.git $folder/$target
	echo "cd $folder/$target; git stash save; git pull; git stash pop; cd $toRoot ">>git-sync.sh

	if [ -f "$folder/$target/configure.sh" ]; then

		# the new repro has a config requirement
		#
		chmod 777 $folder/$target/configure.sh
		$folder/$target/configure.sh
		cd $folder/$target
		git checkout -- configure.sh
		cd $toRoot
	fi
else 

	# give a message, we already did this one
	#
	echo "$2 repo already present"
fi


