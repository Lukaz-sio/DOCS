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
### Nous allons passer à l'installation d'OpenSearch sur le serveur. La commande suivante permet d’ajouter la clé de signature pour les paquets OpenSearch

````bash
curl -o- https://artifacts.opensearch.org/publickeys/opensearch.pgp | sudo gpg --dearmor --batch --yes -o /usr/share/keyrings/opensearch-keyring
````

### Puis, ajoutez le dépôt OpenSearch pour que nous puissions télécharger le paquet avec apt par la suite 
````bash
echo "deb [signed-by=/usr/share/keyrings/opensearch-keyring] https://artifacts.opensearch.org/releases/bundle/opensearch/2.x/apt stable main" | sudo tee /etc/apt/sources.list.d/opensearch-2.x.list
````

### Mettez à jour votre cache de paquets
````bash
apt update
````

### Puis, installez OpenSearch en prenant soin de définir le mot de passe par défaut pour le compte Admin de votre instance.
````bash
env OPENSEARCH_INITIAL_ADMIN_PASSWORD=Rootsio2017! apt-get install opensearch
````

### Quand c'est terminé, prenez le temps d'effectuer la configuration minimale. Ouvrez le fichier de configuration au format YAML
````bash
nano /etc/opensearch/opensearch.yml

cluster.name: graylog
node.name: ${HOSTNAME}
path.data: /var/lib/opensearch
path.logs: /var/log/opensearch
discovery.type: single-node <- A ajouter dans Discovery
network.host: 127.0.0.1
action.auto_create_index: false <- A ajouter dans tout les plugins en bas
plugins.security.disabled: true <- A ajouter dans tout les plugins en bas
````

---

## Configurer Java(JVM)

### Vous devez configurer Java Virtual Machine utilisé par OpenSearch afin d'ajuster la quantité de mémoire que peut utiliser ce service. Éditez le fichier de configuration suivant
````bash
nano /etc/opensearch/jvm.options
````

### Modifier -Xms1g et -Xmx1g par (moitié de la RAM dispo sur la machine)
````bash
-Xms4g
-Xmx4g
````

### En principe, sur une machine Debian 12 fraîchement installée, la valeur est déjà correcte. Mais, nous allons le vérifier. Exécutez cette commande
````bash
cat /proc/sys/vm/max_map_count
````


### Si vous obtenez une valeur différente de "262144", exécutez la commande suivante, sinon ce n'est pas nécessaire.
````bash
sysctl -w vm.max_map_count=262144
````

### Enfin, activez le démarrage automatique d'OpenSearch et lancez le service associé.
````bash
systemctl daemon-reload
systemctl enable opensearch
systemctl restart opensearch

Puis top pour afficher la ligne tout en haut
````
