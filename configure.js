/**
 * main setup script - must be run as part of ./setup.sh unless you have already initialized npm for fs and prompt
 */
var fs      = require('fs');
var prompt  = require('prompt');
var shelljs = require('shelljs');

// allow user interaction
//
prompt.start();

var argv      = process.argv.slice(2);
var rootDir   = shelljs.pwd() + "/";
var configDir = rootDir + "configure/";
var libsDir    = rootDir + "libs/";

console.log( "root at " + rootDir );

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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// make sure that the configure directory exists
//
if( fs.existsSync( configDir ) == false ) {
	console.log( "Can not continue, no configure folder." );
	return;
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
var syncFolders = getFile( rootDir + "git-sync.json", function() {
	var object = new Array();
	object.push( "configure" );
	return object;

});

console.log( "sync folders:" + JSON.stringify( syncFolders ) );

// get the npm modules list
//
var npmModules = getFile( rootDir + "npmModules.json", function() {

	var object = new Array();
	object.push( "fs" );
	object.push( "prompt" );
	object.push( "shelljs" );

	return object;
});

console.log( "npm modules:" + JSON.stringify( npmModules ) );

// get the json file that contains the various requirements for each possible setup
//
var setupModel = getFile( configDir + "setup.json", function() {

	console.log( "Can not continue, no setup.json." );
	process.exit(1);
});

console.log( "setup json:" + JSON.stringify( setupModel ) );
console.log( "\nparsing modules" );

argv.map( function( arg ) {

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

