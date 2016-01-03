# Projet XML miage1 : Annuaire Etablissement

## Introduction
Projet destiné à la géolocalisation des établissements français

## Petite architecture
- Le _client_ envoie une requête (souvent en _AJAX_) au serveur _Node.js_.
- Le serveur _Node.js_ fait suivre la requête au serveur _baseX_
- Le serveur _baseX_ répond au serveur _Node.js_
- Le serveur _Node.js_ formate la réponse de _baseX_ et la transmet au _client_
- Le _client_ réalise un formatage léger et l'intègre dans son HTML dynamiquement

## Démarrer l'application

### Configurer et lancer BaseX

- Télécharger _baseX_ qui est un logiciel _stand alone_ (sans installation)
- Télécharger le fichier BDD XML contenant les établissements
- Lancer la GUI de _baseX_ en lançant `./bin/basexgui` (ajouter `.bat` pour Windows)
- Créer une base en important le fichier XML dans _baseX_ et nommer la *etablissement_superieur*
- Installer le module __functx-1.0-doc__ présent dans le projet _git_ (`options > packages > install` dans la _gui_ de _baseX_)
- Pour activer les requêtes préconfigurées vous devez ajouter le fichier __adef.xq__ (présent dans le dossier __bd__ du projet) dans le dossier __webapp__ de _baseX_ (Pensez aux liens symboliques pour ne pas avoir à dupliquer les fichiers)
- _baseX_ est configuré, vous pouvez lancer le serveur en utilisant le script `./bin/basexhttp` (ajouter `.bat` pour Windows)
- Le serveur fonctionne sur à l'URL http://localhost:8984/ + `<id requête>`

### Installer et lancer le serveur Node.js

- Pour installer le serveur _Node.js_ utiliser simplement `npm install`

- Pour lancer le serveur _Node.js_, deux méthodes :

  - Utiliser simplement `npm start`

  - Utiliser l'outil __supervisor__ :
    - Lorsque vous changez un élément du serveur _Node.js_, il doit être redémarré, __supervisor__ le redémarre automatiquement (gain de temps)
    - Installer __supervisor__ : `npm install supervisor -g`
    - Lancer l'application avec __supervisor__: `supervisor ./bin/www`

- Lancer votre navigateur avec le http://localhost:30001/adef pour accéder à la page

## To do

- L'application ne fonctionne qu'en local, le client _localhost_ est hardcodé, il faudrait pouvoir le porter sur un serveur distant
- Reste à faire :
  - Affichage des établissements sur la carte (__Salwa__)
  - Réalisation des statistiques et des graphiques (__Thais__)
  - Réalisation des exports de statistiques (__Dragos__)
