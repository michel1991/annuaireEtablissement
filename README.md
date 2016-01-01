# annuaireEtablissement
projet exml miage1 
-projet destiné à la géolocalisation des établissments français 
-pour le lancer je vous mettre un fichier xq qui contient les requetes xq dans un dossier bd que vous placerez dans le 
dans le dossier webapp de baseX pour cela vous devrez charger la bd dans baseX et l'appeler etablissement_superieur. Une fois cela fait pour devrez demarer le fichier basexhttp.bat qui se trouve dans le repertoire bin de l'installation de basex pour pourvoir écouter les requettes http venant de node js.
- une fois cela fait vous devrez run le fichier app.js du projet qui lancera le serveur node pour ecouter les requetes venant du client nous utiliserons le framework express de node qui facilite grandement la tâche. S'agit du port du serveur node j'ai mis 30001 et vous pouvez le changer il se trouve à la fin du fichier app.js.
- voici une petite architecture du projet
 client(navigateur)----------------->requete vers le serveur node(Express) --------------> call http request in baseX server
                   <----------------reponse                                <--------------  reponse 
-une fois les consignes respecter vous pouvez lancez l'appli à:http://localhost:30001/adef  
et oups consulter
-importer le module functx-1.0-doc dans baseX main menu Options package install et vous indiquez la localisation de ce fichier
il sera importer dans le repertoire repo de baseX
- dernière remarque faudrait être derrière un réseau pour que l'application marche je ne sais pas pourquoi et j'ai pas encore fait des recherches à propos de cela
- Reste des Taches: Affichages des établissements sur la carte, création des statistiques et exportation
