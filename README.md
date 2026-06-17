# TW5-T-G-O

tiddlywiki deploy GitHub pages

> Este almacen imita las plantillas de conocimientos de chino Taiwei y Taiji para podergithubImplementar estatica entiddlywikiPagina。

Solo tres pasos: 1. HabilitarActions，2. ColocaciontwDatos, 3. Configurar los ajustes necesarios. Entonces puedes usarlo normalmente.。

- Enlace de vista previa del efecto：https://tiddly-gittly.github.io/TW5-T-ONLINE/
- Enlace de version sin conexion：https://tiddly-gittly.github.io/TW5-T-ONLINE/offline.html 

> Solo en tuTiddlyWikiAgregar al final del enlace.offline.htmlAcceso a disponible sin conexionTW。Como se muestra en el ejemplo anterior del enlace de la version sin conexion。

## Empieza
1. Haga clic`Use this template`Crea tu propio almacen。
2. ConfiguracionGitHub pages Habilitar Actions：Haga clic en Configuracion de almacen (encima de la paginacodeEl boton del extremo derecho.settingsboton) y haga clicpages。Entonces encuentraBuild and deploymentdeSourceEstablecer enActions。
![image](https://user-images.githubusercontent.com/32425955/211513957-2e679998-6035-4904-9c0e-58fab7963b05.png)
3. Clona tu repositorio localmente。
4. Utilice carpetas existenteswikiDatos en（tiddlerscarpeta) sobrescribe los archivos despues de clonarlos en localtiddlerscarpeta. (Solo necesita sobrescribir esta carpeta. Si tiene una ruta de archivo personalizada, puede simplemente copiarla.。）
5. ConfiguracionGithubRuta de ubicacion del almacen de imagenes: busque la entrada：tiddlers/mConfigs/`$__GitHub_Repo.tid` ，Se modifica el contenido de la entrada para：tiddly-gittly(Nombre de usuario)/TW5-T-ONLINE(Actualmente utilizadoWIKIAlmacen)。O puedes usarTidGioNodeJS TWAbre estowiki，Y en la "Consola-Configuracion- GithubPagesImage”Configuraciones medias。
6. Confirme los cambios y presione paragithubAlmacen。
7. EsperaactionsEjecucion completada. tu puedes（setting）Configuracion del almacen-PagesEncuentra el enlace generado en。


- HTML-WikigirarFolder-WikiMetodo：
    1. usoTidGiImportarWIKI.HTMLConversion de funcionesHTMLWiki，Encuentra el convertidowikiCarpetas (solo paraTidGi > v0.8.0Version）。
    2. usoNodeJSEdiciontiddlywiki，Entrada`tiddlywiki --load ./mywiki.html --savewikifolder ./mywikifolder explodePlugins=no`Conversion de comandos。


## Introduccion a los archivos de configuracion.

| Archivos de configuracion                                 | Descripcion                                   |
| ---------------------------------------- | -------------------------------------- |
| package.json                             | Archivo de descripcion del proyecto o modulo.                     |
| tiddlywiki.info                          | TiddlyWiki Archivo de configuracion                  |
| tiddlers\mConfigs\\$__GitHub_Repo.tid    | GithubArchivo de configuracion de ruta de almacen para imagenes y recursos de almacen |
| .github\workflows\deploy.yaml            | Github-ActionArchivos de configuracion                  |
| .gitignore                               | GitArchivo de configuracion que especifica elementos ignorados.                |
| public\service-worker.js                 | Archivo de configuracion de politica de cache                       |
| scripts\html-minifier-terser.config.json | HTML Archivo de configuracion del minificador                    |
| scripts\build.js                         | js                                     |
| scripts\build-wiki.mjs                   | zx                                     |


## Instrucciones y registros de mantenimiento.
> Archivos de configuracion modificables：build.js、package.json、deploy.yaml、tiddlywiki.info、build-wiki.mjs、.gitignore、service-worker.js  
> Otros：`https://raw.githubusercontent.com/Nombre de usuario/Almacen/Sucursal/Camino/Nombre del archivo.Sufijo`

Dos metodos de construccion.：
1. js：scripts\build.js（Metodo de compilacion predeterminado）
2. zx：scripts\build-wiki.mjs

> （Esta funcion se ha desactivado) Solo al agregar entradas modificadas, complementos ypackage.jsonActivado en el archivoactionsActualizacionGitHub Pages。
> 
> （Esta caracteristica esta habilitada) politica de cache public\service-worker.js Configurando index.html de StaleWhileRevalidate Estrategia。

