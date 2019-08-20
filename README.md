# Design System


Le design system est divisé en deux parties : la documentation et le framework CSS/JS.

La documentation s'appuie sur un site Jekyll avec un outillage en Ruby.
Elle est disponible à cette adresse : https://departement-loire-atlantique.github.io/design-system-web/

Le framework s'appuie sur SCSS avec un outillage en NodeJS.

## Contribution

Récupérer le code du projet : `git clone https://github.com/departement-loire-atlantique/design-system-web`

### Contribuer à la documentation

#### Version manuelle

1. Installer [Ruby](https://www.ruby-lang.org/en/documentation/installation/)
2. Dans une console : installer Ruby bundler : `gem install bundler`
3. Dans une console, installer les dépendances : `cd docs && bundle install` (ou `bundle update` pour une mise à jour)
4. Dans une console, lancer le mode développement : `cd docs && bundle exec jekyll serve --incremental` 
5. Ouvrir le navigateur à l'addresse `http://localhost:4000/design-system-web/` pour voir le site (mise à jour automatique au fur et à mesure de l'édition des fichiers).

#### Version avec Docker

1. Installer Docker et [Docker compose](https://docs.docker.com/compose/install/) 
2. Pour démarrer le projet : `cd .docker && docker-compose up -d`
3. Ouvrez un navigateur à l'adresse : `http://localhost:4000/design-system-web/`

Si le port 4000 est déja utilisé sur votre machine, vous pouvez le modifier en modifiant la ligne `PORT:4000` du fichier `.docker/.env`

#### Description de l'arborescence de la documentation (sous dossier docs) :

* \_data/locale.yml : Fichier de traduction pour les templates
* \_data/primary_nav.yml : Arborescence du menu
* \_includes : Gabarits des éléments du site
* \_layout : Gabarits des différents types de page
* \_post : Un fichier par billet (Partie historique du site)
* \_sass : Librairies SCSS du site de documentation
* guidelines : Pages du menu "Philosophie"
* styles : Pages du menu "Styles web"
* utilities : Pages du menu "Modificateurs style web"
* assets : Dossier contenant les images, js, ... lié au site de documentation
* \_config.yml : Configuration Jekyll
* changes.md : Page historique (affiche les éléments du dossier \_post)
* Gemfile : Dépendance Ruby pour Jekyll
* index.md : Page d'accueil du site
* robots.txt : Interdiction d'indexation de la documentation par les moteurs de recherche

Pour chaque composant du design system :
* 1 entrée dans le dossier components au format markdown reprenant la documentation du composant
* 1 ou plusieurs illustrations HTML du composant stockées dans un sous dossier au nom du composant du dossier \_variations

### Contribuer et compiler le Framework

Le framework dérive de BootStrap et KNACSS

1. Installer [NodeJS](https://nodejs.org/en/download/)
2. Dans une console, installer les dépendances du projet : `npm install`
3. Compiler le projet : `gulp build`

Description de l'arborescence du framework (sous dossier framework) :

* framework/fonts : Polices du design system
* framework/images : Icones et images du design system
* framework/js : JS pour les composants du design system
* framework/scss : Projet SCSS du design system
* framework/css : Compislaation
* gulpfile.js : Tâches de compilation et de développemnet
* package.json : Dépendances NodeJS pour les tâches GULP

### Contribuer de manière avancée

Pour modifier ou ajouter un composant, il est possible d'activer un mode de développement.
Ce mode permet de recharger automatiquement le navigateur en temps réel suite à toute modification dans la documentation ou le framework. 

Simplement lancer `gulp serve` et ouvrir un http://localhost:3000

Puis, aller sur le composant ou la page que l'on souhaite modifier.
La mise à jour d'une modification dans le SCSS du framework est immédiate sans rechargement de la page.
La mise à jour de la documentation ou du gabarit HTML quelques secondes à s'afficher.

## License

Ce projet est basé sur un [modèle de site design-system](https://github.com/lundegaard/design-system-template) et est rendu sous public en open source suivant les termes de la licence [MIT License](https://opensource.org/licenses/MIT).