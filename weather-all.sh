# set up the chippy ruxpin project
#
echo setting up weather-all

./configure/lib-setup.sh weather-station
./configure/lib-setup.sh lib node-lib
./configure/lib-setup.sh lib arduino-lib
./configure/lib-setup.sh boat-arduino