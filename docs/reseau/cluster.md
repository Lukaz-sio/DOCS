# Mise en oeuvre d'un cluster de serveur web
- Installation de corosync, pacemaker et crmsh
````bash
apt install corosync pacemaker crmsh
````
- Création de la clé authkey pour le chiffrement des échanges
````bash
corosync-keygen
ls -l /etc/corosync/
````
- Création d'un nouveau fichier de configuration de corosync
````bash
mv corosync.conf corosync.conf.sav
nano corosync.conf
````
- Vérification de la configuration
````bash
corosync-cfgtool -s
````
- Cloner le serveur web, modifier le nom et ip du clone
- Visualiser l'état du cluster
- Désactiver le stonith
````bash
stonith
````
