Ready to use packages bundle:
1. freeradius server 3.2.7 as radius server.
2. postgresql 15
3. nodejs backend (akses: http://mainhostipaddress:5000) as basic UI that can be use as basis of developing.
4. adminer (http://mainhostipaddress:8082) as additional UI that can directly access the database.

Requirement:
1. Internet connection of the mainhost.
2. *nix host environment with sudo or root access. Recommended fedora core os (FCOS).
3. docker and docker-compose installed.
   
Usage :
1. git clone https://github.com/lfsegoro/nodejs.git
2. docker-compose up --build

You can learn the detail on the docker-compose.yml if you want to see the password or make modification.

After that you can access the UI suing port 5000 or port 8082 as above mentioned.

The database already have sample username for testing. you can check the radcheck table.

You can test using ntradping or directly from a NAS like mikrotik.

If you need :
- custom freeradius configuration
- more polished UI
You can contact me.
