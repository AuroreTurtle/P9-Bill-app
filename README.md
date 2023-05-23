# Projet 9 OpenClassrooms : Débuggez et testez un SaaS RH

![Logo Billed](https://user.oc-static.com/upload/2020/08/14/1597396368627_image2.png)

Le but du projet est de réaliser des tests unitaires et d'intégration avec JS et rédiger un plan de test end-to-end.

## Installation
1. Téléchargez le repository
2. Ouvrez le dossier principale contenant les dossiers Billed-app-FR-Front et Billed-app-FR-Back avec VSCode
3. Ouvrez deux terminaux dans VSCode
4. Dans le premier terminal :
- Tapez la commande `cd ./Billed-app-FR-Back`
- Tapez la commande `npm install`
- Une fois l'installation des dépendances terminée, tapez la commande `npm run run:dev`
- Lorsque le serveur sera lancé, la ligne "Example app listening on port 5678!" s'affichera dans la console.
5. Dans le second terminal :
- Tapez la commande `cd ./Billed-app-FR-Front`
- Tapez la commande `npm install`
- Tapez la commande `npm install -g live-server`
- Une fois l'installation des dépendances terminée, tapez la commande `live-server`
- Lorsque le frontend sera lancé, une page devrait s'ouvrir dans votre navigateur à l'adresse http://127.0.0.1:8080/.


## Comment lancer un test Jest ?
Si vous souhaitez lancer un test Jest, 
1. Ouvrez un nouveau terminal
2. Tapez la commande `cd ./Billed-app-FR-Front`
3. Tapez la commande `npm run test`

## Comment voir la couverture de test ?
`http://127.0.0.1:8080/coverage/lcov-report/`

## Comptes et utilisateurs :
Vous pouvez vous connecter en utilisant les comptes :

### Administrateur : 
```
utilisateur : admin@test.tld 
mot de passe : admin
```
### Employé :
```
utilisateur : employee@test.tld
mot de passe : employee
```

## Lien vers la page :
https://auroreturtle.github.io/P9-Bill-app
