# set up the project(s) to work on
#
if [[ "$0" != "configure/setup.sh" ]] && [[ "$0" != "./configure/setup.sh" ]] ; then
	echo The shell script must be run from the parent of the directory containing the configure git repro
	exit
fi

# set up the initial files and folders
#
echo "cd configure; git stash save; git pull; git stash pop; cd .. " >git-sync.sh

if [ ! -d "libs" ]; then
	mkdir libs
fi

# now see which repos we need
#
while [ "$1" != "" ]; do
	if [ "$1" == "help" ] ; then
		cat configure/help.txt
	elif [ -f "$1.sh" ] ; then
		chmod 777 ./configure/$1.sh 
		./configure/$1.sh 
	else
		echo $1 shell script NOT found
	fi

	shift
done
