# Mise en oeuvre d'un cluster d'une dns avec bind9
- Installation de bind 9
````bash
apt install bind9
````
- Déclaration d'une zone (srv-dns1)
````bash
nano /etc/bind/name.conf.local

//
// Do any local configuration here
//

// Consider adding the 1918 zones here, if they are not used in your
// organization
//include "/etc/bind/zones.rfc1918";
zone "sodecaf.fr" {
        type master;
        file "db.sodecaf.fr";
};
````
- Création du fichier de zone (srv-dns1)
````bash
cd /var/cache/bind
nano /var/cache/bind/db.sodecaf.fr

; fichier de zone db.sodecaf.fr
$TTL 86400
@               IN      SOA     srv-dns1.sodecaf.fr. hostmaster.sodecaf.fr. (
                                2025092201      ;serial
                                86400           ;refresh
                                21600           ;retry
                                3600000         ;expire
                                3600 )          ;negative cache TTL
@               IN      NS      srv-dns1.sodecaf.fr.
@               IN      NS      srv-dns2.sodecaf.fr.

srv-dns1        IN      A       172.16.0.3
srv-dns2        IN      A       172.16.0.4
srv-web1        IN      A       172.16.0.10
srv-web2        IN      A       172.16.0.11
www             IN      A       172.16.0.12
web1            IN      CNAME   srv-web1.sodecaf.fr.
web2            IN      CNAME   srv-web2.sodecaf.fr.
````
- Vérification (srv-dns1)
````bash
named-checkconf = si rien ok
name-chekzone sodecaf.fr db.sodecaf.fr = normalement ok

systemctl restart bind9
````
- Vérification (pc fixe et srv-dns2)
````bash
nslookup web1.sodecaf.fr 172.16.0.3
dig web1.sodecaf.fr @172.16.0.3
````
- Modification du fichier de déclaration de zone (srv-dns1)
````bash
nano /etc/bind/name.conf.local

//
// Do any local configuration here
//

// Consider adding the 1918 zones here, if they are not used in your
// organization
//include "/etc/bind/zones.rfc1918";
zone "sodecaf.fr" {
        type master;
        file "db.sodecaf.fr";
};

zone "0.16.172.in-addr.arpa" {
        type master;
        file "db.172.16.0.rev";
};
````
