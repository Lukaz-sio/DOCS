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
$IPreseau = "172.16.0.0"
$DebutEtendueDHCP = "172.16.0.150"
$FinEtendueDHCP = "172.16.0.200"
$MasqueIP = "255.255.255.0"
$IPPasserelle ="172.16.0.254"
$IPDNSPrimaire = "172.16.0.1"
$IPDNSSecondaire ="8.8.8.8"
$DomainNameDNS = "sodecaf.local"
$DureeBail ="14440" # Durée du bail = 4h

#Création de l'étendue
Add-DhcpServerv4Scope -Name $NomEtendue -StartRange $DebutEtendueDHCP -EndRange $FinEtendueDHCP -SubnetMask $MasqueIP
Set-DhcpServerv4OptionDefinition -ScopeId $IPreseau -OptionId 3 -Value $IPPasserelle
Set-DhcpServerv4OptionDefinition -ScopeId $IPreseau -OptionId 6 -Value $IPDNSPrimaire,$IPDNSSecondaire -Force
Set-DhcpServerv4OptionDefinition -ScopeId $IPreseau -OptionId 15 -Value $DomainNameDNS
Set-DhcpServerv4OptionDefinition -ScopeId $IPreseau -OptionId 51 -Valuev $DureeBail

#Activation de l'étendue
Set-DhcpServerv4Scope -ScopeId $IPreseau -Name $NomEtendue -State Active

#Vérification
Get-DhcpServerv4Scope
````
