# Script d'installation et confugartion role DHCP
````bash
$DomainNameDNS = "sodecaf.local"
$IPServeur = "172.16.0.2"

#Installer le role DHCP
Install-WindowsFeature -Name DHCP -IncludeManagementTools
#Crée le groupe de sécurité DHCP
Add-DhcpServerSecurityGroup
#Redémarre le service DHCP
Restart-Service dhcpserver
#Autoriser le serveur DHCP dans votre annuaire
Add-DhcpServerInDC -DnsName $DomainNameDNS -IPAddress $IPServeur
#Désactivation de l'alerte post-installation
Set-ItemProperty –Path registry::HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\ServerManager\Roles\12 –Name ConfigurationState –Value 2
````
