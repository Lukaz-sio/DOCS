# Mise en oeuvre d'un cluster d'une base de donnée
- Modification du fichier de conf (srv-web1)
````bash
nano /etc/mysql/mariadb.conf.d/50-server.cnf

#bin-address = 127.0.0.1 (commenter pour écouter toutes ses interfaces)
log_error = /var/log/mysql/error.log
server-id = 1
log_bin = /var/log/mysql/mysql-bin.log
expire_logs_days = 10
max_binlog_size = 100M
binlog_do_db = nom base de donnée
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

show master status; (visualiser le status, si rien = pas bon)
````
- Modification du fichier de conf (srv-web2)
````bash
nano /etc/mysql/mariadb.conf.d/50-server.cnf

log_error = /var/log/mysql/error.log
server-id = 2
expire_logs_days = 10
max_binlog_size = 100M
master-retry-count = 20
replicate-do-db = nom base de donnée

systemctl restart mariadb.service
````
- Stopper l'esclave
````sql
mysql

stop slave;
````
- Configurer le master
````sql
mysql

change master to master_host='172.16.0.10', master_user='replicateur', master_password='Btssio2017', master_log_file='mysql-bin.000001', master_log_pos=328;
````
- Activer l'esclave
````sql
mysql

start slave;
````
- Vérifier la bonne configuration du master
````sql
mysql

show slave status \G;
````
- Déverrouiller les tables de la bases (srv-web1)
````sql
my sql

unlock tables;
````
