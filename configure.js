/**
 * main setup script - must be run as part of ./setup.sh unless you have already initialized npm for fs and prompt
 */
var fs      = require('fs');
var prompt  = require('prompt');
var shelljs = require('shelljs');

// allow user interaction
//
prompt.start();

var originalRootDir = undefined;
var rootDir         = undefined;
var configDir       = undefined;
var libsDir         = undefined;
var syncFolders     = undefined;
var npmModules      = undefined;
var setupModel      = undefined;
var newNpmModules   = [];

moveToRoot( process.argv[1] );
getScriptObjectsFromFiles();
parseArgs( process.argv.slice(2) );
writeScriptObjectsToFiles();
shelljs.cd( rootDir );

/*************************************************************************************************************
 * set up a git repo
 */
function setupGit( folder, repoName, syncKey ) {

	var target = folder + repoName;

	if( fs.existsSync( target ) ) {
		console.log( target + "already exists, skipping" );
	}
	else {

		// Run external tool synchronously 
		//
		console.log( 'cloning ' +  'git clone https://github.com/davidsi/'+repoName+'.git '+target );

		if( shelljs.exec('git clone https://github.com/davidsi/'+repoName+'.git '+ target ).code !== 0 ) {
	  		console.log('Error: Git commit failed');
	  		shelljs.exit(1);
		}

		syncFolders[ syncKey ].push( repoName );
	}
}

/*************************************************************************************************************
 * set up a repp
 */
function doSetup( folder, repo, syncKey ) {

	setupGit( folder, repo, syncKey );

	var target     = folder + repo;
	var repoConfig = getJSonObjectFromFile( target + "/" + "config.json", function() {

		console.log( "no config for " + repo + " at " + target + "/" + "config.json" );
		return undefined;
	});

	if( repoConfig !== undefined ) {

		if( repoConfig["npm"] !== undefined ) {
			console.log( "npm list for " + repo + " = " + JSON.stringify( repoConfig["npm"] ) );

			npmModules = npmModules.concat( repoConfig["npm"].filter( newModule => {

			// if( npmModules.indexOf( newModule ) < 0 ) {
			// 	console.log( "adding " + newModule + " to npm list" );
			// }
			// else {
			// 	console.log( newModule + " already exists in npmModules " );
			// }
			return( npmModules.indexOf(newModule) < 0 );
    	}));

//
// can't use this unless we can concat arrays
// let filteredSet = repoConfig["npm"].all.filter(newModule => {
//       return (npmModules.indexOf(newModule) <0 );
//     })
//    
			// repoConfig["npm"].forEach( function( newModule ) {
			// 	if( npmModules.indexOf( newModule ) < 0 ) {
			// 		npmModules.push( newModule );
			// 	}
			// });
		}
	}
}

/*************************************************************************************************************
 * set up a config
 */
function setupConfig( data ) {

	var gitLibs = data["git-libs"];
	var git     = data["git"];

	console.log( "git libs: ");
	gitLibs.map( function( libRepro ) {
		doSetup( libsDir, libRepro, "libs" );
	});

	console.log( "git: ");
	git.map( function( repro ) {
		doSetup( rootDir, repro, "main" );
	});
}

/*************************************************************************************************************
 * do the git sync for one folder
 */

function doOneGitSync( repo ) {

	console.log( "doing git sync for " + repo );
	shelljs.cd( repo );

	if( shelljs.exec('git stash save' ).code !== 0 ) {
	}

	if( shelljs.exec('git pull' ).code !== 0 ) {
	}

	if( shelljs.exec('git stash pop' ).code !== 0 ) {
		;
	}

	if( shelljs.exec('git commit -a -m "automated commit" ' ).code !== 0 ) {
	}

	if( shelljs.exec('git push' ).code !== 0 ) {
	}
}

/*************************************************************************************************************
 * do the git sync for one folder
 */

function doOneGitStatus( repo ) {

	console.log( "\n\ndoing git sync for " + repo );
	shelljs.cd( repo );

	if( shelljs.exec('git status' ).code !== 0 ) {
	}
}

/*************************************************************************************************************
 * do the git sync
 */
function doGitSync() {

	syncFolders["main"].forEach( function( repo ) {
		doOneGitSync( rootDir + repo );
	});

	syncFolders["libs"].forEach( function( repo ) {
		doOneGitSync( libsDir + repo );
	});
}

/*************************************************************************************************************
 * do the git sync
 */
function doGitStatus() {

	syncFolders["main"].forEach( function( repo ) {
		doOneGitStatus( rootDir + repo );
	});

	syncFolders["libs"].forEach( function( repo ) {
		doOneGitStatus( libsDir + repo );
	});
}

/*************************************************************************************************************
 * update / install the npm modules required
 */
function doNpmUpdate() {

	npmModules.forEach( function( modName ) {

		if( fs.existsSync( rootDir + "node_modules/" + modName ) ) {
			console.log( modName + " already installed, doing an update" );
			shelljs.exec('npm update -g ' + modName );
		}
		else {
			console.log( "installing " + modName );
			shelljs.exec('npm install -g ' + modName );
			shelljs.exec('npm link ' + modName );
		}
	});
}

/*************************************************************************************************************
 * parse the arguments
 */
function parseArgs( args) {

	args.map( function( arg ) {

		if( arg == "--help" ) {
			showHelp();
			return;
		}

		if( arg == "--gitSync" ) {
			doGitSync();
			return;
		}

		if( arg == "--gitStatus" ) {
			doGitStatus();
			return;
		}

		if( arg == "--npm" ) {
			doNpmUpdate();
			return;
		}

		var data = setupModel[arg];

		if( data === undefined ) {
			console.log( "can not find setup info for " + arg );
		}
		else {
			setupConfig( data );
		}
	});

	// Object.keys(setupModel).map( function( key ) {

	// 	console.log( "setup json obejct " + key );
	// });
}

/*************************************************************************************************************
 * get the objects we need from the json in the files
 */
function writeScriptObjectsToFiles() {

	var raw = JSON.stringify( syncFolders );
	fs.writeFileSync( configDir + "git-sync.json", raw, { "encoding" : "utf8" } );

	raw = JSON.stringify( npmModules );	
	fs.writeFileSync( configDir + "npmModules.json", raw, { "encoding" : "utf8" } );
}

/*************************************************************************************************************
 * get the objects we need from the json in the files
 */
function getScriptObjectsFromFiles() {

	//
	// make sure that the configure directory exists
	//
	if( fs.existsSync( configDir ) == false ) {
		console.log( "Can not continue, no configure folder." );
		process.exit(0);
	}

	// make sure that the libs directory exists
	//
	if( fs.existsSync( libsDir ) == false ) {
		console.log( "creating libs folder" );
		fs.mkdirSync( libsDir, 0744);
	}
	else {
		console.log( "libs folder exists" );
	}

	// see if the main sync script exists, if it does, read it in. If not, well, don't :-)
	//
	syncFolders = getJSonObjectFromFile( configDir + "git-sync.json", function() {
		var object = { "main" : ["configure"], "libs" : []} ;
		return object;

	});

	// get the npm modules list
	//
	npmModules = getJSonObjectFromFile( configDir + "npmModules.json", function() {

		var object = new Array();
		object.push( "fs" );
		object.push( "prompt" );
		object.push( "shelljs" );

		return object;
	});

	console.log( "npm modules:" + JSON.stringify( npmModules ) );

	// get the json file that contains the various requirements for each possible setup
	//
	setupModel = getJSonObjectFromFile( configDir + "setup.json", function() {

		console.log( "Can not continue, no setup.json." );
		process.exit(1);
	});

	console.log( "setup json:" + JSON.stringify( setupModel ) );
}

/*************************************************************************************************************
 * find the root
 */
function moveToRoot( thisScriptPath ) {

	originalRootDir = shelljs.pwd() + "/";

	if( thisScriptPath === undefined ) {
		console.log( "error in starting script - the process args are wrong" );
		process.exit(0);
	}

	const fileName = "configure/configure.js";

	if( thisScriptPath.endsWith( fileName ) == false ) {
		console.log( "error in starting script - do not understand script name" );
		process.exit(0);
	} 

	rootDir   = thisScriptPath.substring( 0, thisScriptPath.length - fileName.length );
	configDir = rootDir + "configure/";
	libsDir   = rootDir + "libs/";

	shelljs.cd( rootDir );
}

/*************************************************************************************************************
 * show the help file
 */
 function showHelp() {

	var helpText = fs.readFileSync( configDir + "help.txt", { "encoding" : "utf8" } );
	console.log( helpText );
	process.exit(0);
 }

/*************************************************************************************************************
 * get raw json out of a file and attach to an object. If it does not exist, create an empty object
 */
function getJSonObjectFromFile( fileName, createEmpty ) {

	if( fs.existsSync( fileName ) ) {
		var rawJson = fs.readFileSync( fileName );
		return JSON.parse( rawJson );
	}
	else {
		if( createEmpty ) {
			return createEmpty();
		}
		else {
			return new Object();
		}
	}
}

