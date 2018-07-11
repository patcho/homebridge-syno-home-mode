# homebridge-syno-home-mode
Little plugin to switch Synology's Surveillance Station Home mode, which can be used to turn camera's on / off with Homekit when you leave / enter your home.

Add accessory to config.json, using the username and password of Surveillance Station account.
```
{ 
 	"accessory": "HomeMode",
 	"name":"Camera's",
 	"username":"__username__",
 	"password":"__password__",
 	"syno_address":"localhost"
}
```
