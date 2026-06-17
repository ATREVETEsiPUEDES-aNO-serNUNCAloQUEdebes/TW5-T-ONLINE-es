const path = require('path');
const {
    execSync
} = require('child_process');

/** Ruta del proyecto */
const repoFolder = path.join(path.dirname(__filename), '..');
/** obtenerTWNumero de version */
const getVersion = '$(npx tiddlywiki . --version | grep -Eo \'^[0-9]+\.[0-9]+\.[0-9]+.*$\' | head -n 1)';

/** Establecer variables de entorno，TWBuscara complementos, temas e idiomas tanto en su propia ruta de codigo fuente como en las rutas definidas por las variables de entorno.
 *  Si no escribes asi，plugins、themes、languagesyeditionsEl contenido de no se puede cargar.
 */
process.env.TIDDLYWIKI_PLUGIN_PATH = `${repoFolder}/plugins`;
process.env.TIDDLYWIKI_THEME_PATH = `${repoFolder}/themes`;
process.env.TIDDLYWIKI_LANGUAGE_PATH = `${repoFolder}/languages`;
process.env.TIDDLYWIKI_EDITION_PATH = `${repoFolder}/editions`;

/**
 * Ejecute el comando de linea de comando e imprima el resultado del comando.
 * @param {string} command Comando a ejecutar
 * @param {object} options execSyncParametros
 */
function shell(command, options) {
    if (options !== undefined) options = {};
    console.log(String(execSync(command, {
        cwd: repoFolder,
        ...options,
    })));
}
/**
 * Ejecute un comando de linea de comando e imprima los resultados del comando, ignorando cualquier error.
 * @param {string} command Comando a ejecutar
 * @param {object} options execSyncParametros
 */
function shellI(command, options) {
    try {
        shell(command, options);
    } catch (error) {
        console.error(`[Shell Command Error] ${error}`)
    }
}

/**
 * Construye en lineaHTMLVersion: NucleoJSy los archivos de recursos no estan incluidos enHTMLEn, no se puede utilizar despues de la descarga.
 * @param {string} distDir Ruta de destino, si esta vacia o no esta completa, el valor predeterminado es'dist'
 * @param {string} htmlName HTMLNombre, si esta vacio o no esta completado, el valor predeterminado es'index.html'
 * @param {boolean} minify Ya sea para minimizarJSyHTML，El valor predeterminado estrue
 * @param {string} excludeFilter Ser excluidotiddlerLa expresion de filtro, el valor predeterminado es'-[is[draft]]'
 */
function buildOnlineHTML(distDir, htmlName, minify, excludeFilter) {
    if (typeof distDir !== 'string' || distDir.length === 0) distDir = 'dist';
    if (typeof htmlName !== 'string' || htmlName.length === 0) htmlName = 'index.html';
    if (typeof minify !== 'boolean') minify = true;
    if (typeof excludeFilter !== 'string') excludeFilter = '-[is[draft]]';

    // Limpia el objetivo de construccion.
    shell(`rm -rf ${distDir}`);

    // Copia de recursos estaticos
    shellI(`cp -r public/ ${distDir} &> /dev/null`);
    shellI(`cp tiddlers/favicon.ico ${distDir}/favicon.ico &> /dev/null`);
    shellI(`cp vercel.json ${distDir}/vercel.json &> /dev/null`);

    // construirHTML
    shell('cp -r tiddlers/ tmp_tiddlers_backup &> /dev/null'); // Copia de seguridad porque hay cambios a continuacion.tiddlerdefieldOperaciones(Convierta todos los archivos multimedia acanonical)
    shell(`npx tiddlywiki . --output ${distDir}` +
        ' --deletetiddlers \'[[$:/UpgradeLibrary]] [[$:/UpgradeLibrary/List]]\'' +
        ' --setfield \'[is[image]] [is[binary]] [type[application/msword]] [type[image/svg+xml]]\' _canonical_uri $:/core/templates/canonical-uri-external-image text/plain' +
        ' --setfield \'[is[image]] [is[binary]] [type[application/msword]] [type[image/svg+xml]]\' text "" text/plain' + /* Tenga en cuenta que este paso tambien hara que el contenido de todos los archivos multimedia este vacio. */
        ` --rendertiddler $:/core/save/offline-external-js index-raw.html text/plain "" publishFilter "${excludeFilter}"` +
        ' --rendertiddler $:/core/templates/tiddlywiki5.js tiddlywikicore.js text/plain'
    );
    shell('cp -r tmp_tiddlers_backup/* tiddlers &> /dev/null'); // Recuperar archivos multimedia que se han borrado.
    // Elimine archivos no binarios, el tipo de sufijo se define en boot.js ($tw.utils.registerFileType(...))
    shellI('cd tiddlers && rm *.meta *.tid *.multids *.tiddler *.recipe *.txt *.css *.html *.htm *.hta *.js *.json *.md *.bib &> /dev/null');
    shellI(`mkdir ${distDir}/images &> /dev/null`);
    shell(`mv tiddlers/*.* ${distDir}/images &> /dev/null`); // Los archivos no binarios son copias de archivos de recursos.
    shell('rm -rf tiddlers && mv tmp_tiddlers_backup tiddlers &> /dev/null'); // Restaurar

    // Minimalizacion: NucleoJSyHTML
    if (minify) {
        shellI(`npx uglifyjs ${distDir}/tiddlywikicore.js -c -m --v8 --webkit --ie --output '${distDir}/tiddlywikicore-'${getVersion}'.js' && rm ${distDir}/tiddlywikicore.js`);
        shellI(`npx html-minifier-terser -c scripts/html-minifier-terser.config.json -o ${distDir}/${htmlName} ${distDir}/index-raw.html && rm ${distDir}/index-raw.html`);
    } else {
        shellI(`mv ${distDir}/tiddlywikicore.js '${distDir}/tiddlywikicore-'${getVersion}'.js'`);
        shellI(`mv ${distDir}/index-raw.html ${distDir}/${htmlName}`);
    }
}

/**
 * Construye sin conexionHTMLVersion: NucleoJSy archivos de recursos incluidos enHTMLEn, puedes usarlo despues de descargarlo.(Es una version de un solo archivo.wiki)
 * @param {string} distDir Ruta de destino, si esta vacia o no esta completa, el valor predeterminado es'dist'
 * @param {string} htmlName HTMLNombre, si esta vacio o no esta completado, el valor predeterminado es'index.html'
 * @param {boolean} minify Ya sea para minimizarJSyHTML，El valor predeterminado estrue
 * @param {string} excludeFilter Ser excluidotiddlerLa expresion de filtro, el valor predeterminado es'-[is[draft]]'
 */
function buildOfflineHTML(distDir, htmlName, minify, excludeFilter) {
    if (typeof distDir !== 'string' || distDir.length === 0) distDir = 'dist';
    if (typeof htmlName !== 'string' || htmlName.length === 0) htmlName = 'index.html';
    if (typeof minify !== 'boolean') minify = true;
    if (typeof excludeFilter !== 'string') excludeFilter = '-[is[draft]]';

    // construirHTML
    shell(`npx tiddlywiki . --output ${distDir}` +
        ' --deletetiddlers \'[[$:/UpgradeLibrary]] [[$:/UpgradeLibrary/List]]\'' +
        ` --rendertiddler $:/core/save/all index-raw.html text/plain "" publishFilter "${excludeFilter}"`
    );

    // Minimizar：HTML
    if (minify) {
        shellI(`npx html-minifier-terser -c scripts/html-minifier-terser.config.json -o ${distDir}/${htmlName} ${distDir}/index-raw.html && rm ${distDir}/index-raw.html`);
    } else {
        shellI(`mv ${distDir}/index-raw.html ${distDir}/${htmlName}`);
    }
}

/**
 * Construir fuente de complemento
 * @param {string} pluginFilter El filtro para publicar el complemento, el valor predeterminado es '[prefix[$:/plugins/]!prefix[$:/plugins/tiddlywiki/]!prefix[$:/languages/]!prefix[$:/themes/tiddlywiki/]!tag[$:/tags/PluginLibrary]]'
 * @param {string} distDir Ruta de destino, si esta vacia o no esta completa, el valor predeterminado es'dist/library'
 * @param {boolean} minify Ya sea para minimizarHTML，El valor predeterminado estrue
 */
function buildLibrary(pluginFilter, distDir, minify) {
    if (typeof pluginFilter !== 'string' || pluginFilter.length === 0) pluginFilter = '[prefix[$:/plugins/]!prefix[$:/plugins/tiddlywiki/]!prefix[$:/languages/]!prefix[$:/themes/tiddlywiki/]!tag[$:/tags/PluginLibrary]]';
    if (typeof distDir !== 'string' || distDir.length === 0) distDir = 'dist/library';
    if (typeof minify !== 'boolean') minify = true;

    shell(`npx tiddlywiki . --output ${distDir}` +
        ' --makelibrary $:/UpgradeLibrary' +
        ` --savelibrarytiddlers $:/UpgradeLibrary ${pluginFilter} recipes/library/tiddlers/ $:/UpgradeLibrary/List` +
        ' --savetiddler $:/UpgradeLibrary/List recipes/library/tiddlers.json' +
        ' --rendertiddler $:/plugins/tiddlywiki/pluginlibrary/library.template.html index-raw.html text/plain' +
        ' --deletetiddlers \'[[$:/UpgradeLibrary]] [[$:/UpgradeLibrary/List]]\'', { env: { TIDDLYWIKI_PLUGIN_PATH: path.resolve(distDir, '..', 'plugins')}}
    );

    // Minimizar：HTML
    if (minify) {
        shellI(`npx html-minifier-terser -c scripts/html-minifier-terser.config.json -o ${distDir}/index.html ${distDir}/index-raw.html && rm ${distDir}/index-raw.html`);
    } else {
        shellI(`mv ${distDir}/index-raw.html ${distDir}/${htmlName}`);
    }
}

module.exports = {
    buildOnlineHTML: buildOnlineHTML,
    buildOfflineHTML: buildOfflineHTML,
    buildLibrary: buildLibrary,
};
