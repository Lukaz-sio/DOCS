# Mise en oeuvre d'un cluster d'une base de donnée
- Modification du fichier de conf (srv-web1)
````bash
nano /etc/mysql/mariadb.conf.d/50-server.cnf

#bin-address = 127.0.0.1 (commenter pour écouter toutes ses interfaces)
log_error = /var/log/mysql/error.log
server-id = 100
log_bin = /var/log/mysql/mysql-bin.log
expire_logs_days = 10
max_binlog_size = 100M
binlog_do_db = include_database_anme
````
- Création du dossier log si besoin
````bash
mkdir -m 2750 /var/log/mysql
chown mysql /var/log/mysql

systemctl restart mariadb.service
````
- Création du compte réplicateur + droit
````sql
mysql
create user 'replicateur'@'%' identified by 'Btssio2017';
grant replication slave on *.* to 'replicateur'@'%';
````
- Bloqué l'écriture sur les tables de la base de donnée
````sql
mysql
flush tables with read lock;
unlock tables (Débloque la table si besoin)
````
