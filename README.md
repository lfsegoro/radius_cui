Ready to use OUT-OF-THE-BOX packages bundle, with 4 services in docker-compose.yml configuration:
1. freeradius server 3.2.7 as radius server.
2. postgresql 15
3. nodejs backend (akses: http://mainhostipaddress:5000) as basic custom UI that can be use as basis of developing.
4. adminer (http://mainhostipaddress:8082) as additional general UI that can directly access the database.

Requirement:
1. Internet connection of the mainhost.
2. *nix host environment with sudo or root access. Recommended fedora core os (FCOS).
3. docker and docker-compose installed.
   
Usage :
```
git clone https://github.com/lfsegoro/radiusapp.git \
cd ./radiusapp \
docker-compose up --build
```


1. bash# git clone https://github.com/lfsegoro/radiusapp.git
2. bash# cd ./radiusapp
3. bash# docker-compose up --build
4. Let the the script do autmatic pull and installing.
5. access from the UI.
6. test using Ntradping or directly from NAS like mikrotik.

You can learn the detail on the docker-compose.yml if you want to see the password or make modification.

The database already have sample username for testing. you can check the radcheck table.

You can test using ntradping or directly from a NAS like mikrotik.

If you need :
- custom freeradius configuration
- more polished UI

Detailed note:
- username and password user testing, 1 entry in 'radcheck' table.
- all host/nas allowed, to see the secret: 1 entry in 'nas' table.
- adminer can have access to all table, make sure choose Postgresql, dbHost ip ADDRESS, username/password you can see in docker-compose.yml
- the only difference with default freeradius config is modified modules only  'sql' inside the /etc/freeradius/mods-enable
