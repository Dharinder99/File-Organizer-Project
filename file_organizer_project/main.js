#!/user/bin/env node
// shebang sytax for making things global

let inputArr = process.argv.slice(2);
var fs = require("fs");
var path = require("path");


let types = {
    media: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', "xz"],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex'],
    app: ['exe', 'dmg', 'pkg', "deb"]
}


console.log(inputArr);

let cmd = inputArr[0];

switch (cmd){
	case "tree":
		treefn(inputArr[1]);
		break;
	case "organize":
		organizefn(inputArr[1]);
		break;
	case "help":
		helpfn();
		break;
	default:
		console.log("please input right command");
		break;
}



function treefn(dirPath) {
	if (dirPath == undefined) {
		treeHelper(process.cwd()," ");
		return;
	}else{
		let doesExist = fs.existsSync(dirPath);
		if (doesExist) {
			treeHelper(dirPath," ");
		}else{
			console.log("Enter the correct path");
			return;
		}
	}
}

function treeHelper(dirPath,indent) {
	let isFile = fs.lstatSync(dirPath).isFile();
	if (isFile == true) {
		let fileName = path.basename(dirPath);
		console.log(indent+"├──"+fileName);
	}else{
		let dirName = path.basename(dirPath);
		console.log(indent+"└──"+dirName);
		let childrens = fs.readdirSync(dirPath);
		for (var i = 0; i < childrens.length; i++) {
			let childPath = path.join(dirPath,childrens[i]);
			treeHelper(childPath,indent+"\t");
		}
	}
}

function organizefn(dirPath) {
	if (dirPath == undefined) {
		console.log("Enter the correct path");
		return;
	}else{
		let doesExist = fs.existsSync(dirPath);
		if (doesExist) {
			let destPath = path.join(dirPath,"organized_files");
			if (fs.existsSync(destPath) == false) {
				fs.mkdirSync(destPath);
			}
			organizehelper(dirPath,destPath);
		}else{
			console.log("Enter the correct path");
			return;
		}
	}
}

function organizehelper(dirPath,destPath){
	let filename = fs.readdirSync(dirPath);
	for (var i = 0; i < filename.length; i++) {
		let filesAddress = path.join(dirPath,filename[i]);
		let isfile = fs.lstatSync(filesAddress).isFile();
		if (isfile) {	
			let catergory = getCatergory(filename[i]);

			sendFiles(filesAddress,destPath,catergory);
		}
	}
//	console.log(filename);
}



function getCatergory(name) {
	let ext = path.extname(name);
	ext = ext.slice(1);
	for (let type in types) {
		let currTypeArr = types[type];
		for (var i = 0; i < currTypeArr.length; i++) {
			if(ext == currTypeArr[i]){
				return type;
			}
		}
	}
	return "others";
//	console.log(ext);
}


function sendFiles(srcAddress,desAddress,cat) {
	let catergoryPath = path.join(desAddress,cat);
	if (fs.existsSync(catergoryPath) == false) {
		fs.mkdirSync(catergoryPath);
	}
	let destFileAddress = path.join(catergoryPath,path.basename(srcAddress));
	fs.copyFileSync(srcAddress,destFileAddress);
//	fs.unlinkSync(srcAddress); to remove origional file
	console.log(srcAddress,"copied to",destFileAddress);
}



function helpfn() {
	console.log(`
		List of all commands:
			node main help
			node main organize
			node main tree
		`);
}

