# Mise en œuvre de Graylog

## Configuration initiale

### Modifier le fuseau horaire
```bash
timedatectl set-timezone Europe/Paris
```

## Configuration NTP (synchronisation de l’heure)

Éditer le fichier de configuration `timesyncd` :
```bash
nano /etc/systemd/timesyncd.conf
```

Modifier ou ajouter les lignes suivantes :
```ini
[Time]
NTP=ntp.univ-rennes2.fr
FallbackNTP=0.debian.pool.ntp.org 1.debian.pool.ntp.org 2.debian.pool.ntp.org 3.debian.pool.ntp.org
```

Redémarrer le service :
```bash
systemctl restart systemd-timesyncd
systemctl status systemd-timesyncd
```


### Activation de NTP si désactivé

Activer la synchronisation :
```bash
timedatectl set-ntp true
systemctl restart systemd-timesyncd
```

Vérifier l’état de la synchronisation :
```bash
timedatectl timesync-status
timedatectl status
```

### Mise à jour et installation des dépendances
```bash
apt update
apt install curl lsb-release ca-certificates gnupg2 pwgen
```

---

## Installation de MongoDB

### Importer la clé GPG
```bash
curl -fsSL https://www.mongodb.org/static/pgp/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor
```

### Ajouter le dépôt MongoDB
```bash
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] http://repo.mongodb.org/apt/debian bullseye/mongodb-org/6.0 main" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
```

### Installer MongoDB
```bash
apt update
apt install -y mongodb-org
```

---

## Installation de libssl1.1 (nécessaire à Graylog)
```bash
wget http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2.24_amd64.deb
dpkg -i libssl1.1_1.1.1f-1ubuntu2.24_amd64.deb
```

---

## Relancez l'installation de MongoDB
````bash
apt install -y mongodb-org
````
### Ensuite, relancez le service MongoDB et activez son démarrage automatique au lancement du serveur Debian.
````bash
systemctl daemon-reload
systemctl enable mongod.service
systemctl restart mongod.service
systemctl --type=service --state=active | grep mongod

apt update
````

---

## Installation d'OpenSearch
Nous allons passer à l'installation d'OpenSearch sur le serveur. La commande suivante permet d’ajouter la clé de signature pour les paquets OpenSearch

````bash
curl -o- https://artifacts.opensearch.org/publickeys/opensearch.pgp | sudo gpg --dearmor --batch --yes -o /usr/share/keyrings/opensearch-keyring
````

Puis, ajoutez le dépôt OpenSearch pour que nous puissions télécharger le paquet avec apt par la suite 
````bash
echo "deb [signed-by=/usr/share/keyrings/opensearch-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/apt stable main" | sudo tee /etc/apt/sources.list.d/opensearch-2.x.list
````

Mettez à jour votre cache de paquets
````bash
apt update
````
