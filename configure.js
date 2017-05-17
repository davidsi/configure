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
var syncFoldersm    = undefined;
var npmModules      = undefined;
var setupModel      = undefined;

moveToRoot( process.argv[1] );
getScriptObjectsFromFiles();
parseArgs( process.argv.slice(2) );

/*************************************************************************************************************
 * parse the arguments
 */
function parseArgs( args) {

	args.map( function( arg ) {

		if( arg == "help" ) {
			showHelp();
			return;
		}

		var data = setupModel[arg];

		if( data === undefined ) {
			console.log( "can not find setup info for " + arg );
		}
		else {
			console.log( "setup data for " + arg + " = " + JSON.stringify( data ) );
		}
	});

	// Object.keys(setupModel).map( function( key ) {

	// 	console.log( "setup json obejct " + key );
	// });
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
	syncFolders = getFile( configDir + "git-sync.json", function() {
		var object = new Array();
		object.push( "configure" );
		return object;

	});

	console.log( "sync folders:" + JSON.stringify( syncFolders ) );

	// get the npm modules list
	//
	npmModules = getFile( configDir + "npmModules.json", function() {

		var object = new Array();
		object.push( "fs" );
		object.push( "prompt" );
		object.push( "shelljs" );

		return object;
	});

	console.log( "npm modules:" + JSON.stringify( npmModules ) );

	// get the json file that contains the various requirements for each possible setup
	//
	setupModel = getFile( configDir + "setup.json", function() {

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
function getFile( fileName, createEmpty ) {

	if( fs.existsSync( fileName ) ) {
		var rawJson = fs.readFileSync( fileName );
		return JSON.parse( rawJson );
	}
	else {
		return createEmpty();
	}
}

