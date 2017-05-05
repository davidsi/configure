#npm update -g

npm install -g os           ; npm link os				# os utils
npm install -g fs           ; npm link fs				# file systems
npm install -g formidable	; npm link formidable		# server
npm install -g querystring	; npm link querystring		# server
npm install -g url			; npm link url				# server
npm install -g request		; npm link request			# server

npm install -g bleno		; npm link bleno			# BLE
#npm install -g serial-port
npm install -g epoll		; npm link epoll			# GPIO polling

npm install -g espeak 		; npm link espeak			# chippy ruxpin
npm install -g tcp-ping		; npm link tcp-ping

npm install -g gamepad		; npm link gamepad			# controller for ROV

npm install -g dgram		; npm link dgram			

npm install -g i2c-bus		; npm link i2c-bus			# i2c
npm install -g events		; npm link events
npm install -g util			; npm link util

npm install -g sleep 		; npm link sleep 			# used for delay in i2c 

# echo attaching to modules

# echo epoll --}  gpio
# cd ./library/nodejs/device/chip/gpio
# npm link epoll

# echo bleno --} bluetooth
# cd ../../../bluetooth/characteristics
# npm link bleno

# cd ../../../../..
