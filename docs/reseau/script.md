# Script d'installation et confugartion role DHCP
## Configuration à faire en Powershell Win CORE
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
---------------------------------------------------------------------------------------------------------------------------------
# Script Création d'une étendue DHCP
## Configuration à faire en Powershell Win CORE
````bash
$NomEtendue = "DHCP_sodecaf"
$DebutEtendueDHCP = 172.16.0.150
$FinEtendueDHCP = 172.16.0.200
$MasqueIP = 255.255.255.0

#Création d'étendue avec nom, ip et masque
Add-DhcpServerv4Scope -Name $NomEtendue -StartRange $DebutEtendueDHCP -EndRange $FinEtendueDHCP -SubnetMask $MasqueIP
````
