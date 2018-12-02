const express = require('express');
const compression = require('compression');
const app = express();
const router = express.Router();
const path = require('path');
const bodyParser = require("body-parser");
const fs = require('fs');
const browserSync = require('browser-sync');
const pug = require('pug');
const multer = require('multer');
const minify = require('express-minify');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const json_body_parser = bodyParser.json();

const urlencoded_body_parser = bodyParser.urlencoded({ extended: true });
const site = {
	port: process.env.PORT || 8080,
	root: './',
	views: './src'
}
const files = ''
const OpensendMail = true
const smtpTransport = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "baonguyenyam@gmail.com",
		pass: "****************"
	}
});

app.use(json_body_parser);
app.use(urlencoded_body_parser);
app.use('/', express.static(site.root + '/src'));

process.env.ENVGLOBAL = false

if (process.argv.slice(2).toString() === '--production') {
	process.env.ENVGLOBAL = true
}

if (!process.env.ENVGLOBAL) {
	app.locals.pretty = true;
	app.listen(site.port, listening);
	function listening() {
		browserSync({
			files: [site.root + '/**/*.{js,css}'],
			notify: false,
			online: false,
			open: true,
			port: site.port + 1,
			proxy: 'localhost:' + site.port,
			ui: false
		});
	}
} else {
	app.use(compression());
	app.use(minify());
	app.listen(site.port, function () {
		console.log('App listening on port !' + site.port);
	});

}
app.set('view engine', 'pug')
app.set('views', site.views)

const Storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, site.views + "/files");
	},
	filename: function (req, file, callback) {
		files = crypto.createHash('md5').update(Date.now() + "_" + removeVietnam(file.originalname.substring(0, 10))).digest('hex') + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]
		callback(null, files);
	}
});
const upload = multer({
	storage: Storage,
	fileFilter: function (req, file, callback) {
		var ext = path.extname(file.originalname);
		if (ext !== '.pdf') {
			return callback(new Error('Only PDF are allowed'))
		}
		callback(null, true)
	},
	limits: {
		fileSize: 1024 * 1024 * 1024
	}
}).array(
	"customFile",
	10
);

app.post('/upload', function (req, res) {
	upload(req, res, function (err) {
		if (err) {
			return res.end("error");
		}
		return res.end(files);
	});
});

app.post('/save', function (req, res) {
	var json = req.body
	fs.readFile(site.root + 'src/data/tasks.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var getDat = JSON.parse(data)
			var newLeng = getDat.length + 1
			json.ObjectType = json.ObjectType + '' + newLeng
			getDat.push(json)
			var jsonJS = JSON.stringify(getDat, null, 4);
			fs.writeFileSync(site.root + 'src/data/tasks.json', jsonJS, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
			});
			if (OpensendMail && OpensendMail == true) {
				sendMail(json.from, json.to, json.ObjectType, json.Name, json.MetaDescription)
			}
		}
	});
	return res.end("done");
});

app.post('/edit', function (req, res) {
	var json = req.body

	fs.readFile(site.root + 'src/data/user.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var getContents = JSON.parse(data), newVal
			for (var key in getContents) {
				if (getContents.hasOwnProperty(key)) {
					if (key === json.id) {
						delete json.id;
						getContents[key] = json
					}
				}
			}
			var jsonJS = JSON.stringify(getContents, null, 4);
			fs.writeFileSync(site.root + 'src/data/user.json', jsonJS, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
			});
		}
	});

	return res.end("done");
});

app.post('/newuser', function (req, res) {
	var json = req.body
	var checkUser = req.body.username

	fs.readFile(site.root + 'src/data/user.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var indata = JSON.parse(data)
			var response = false
			for (var key in indata) {
				if (indata.hasOwnProperty(key)) {
					var element = indata[key].username;
					if (element === checkUser) {
						response = true
					}
				}
			}
			if (!response) {
				var getDat = JSON.parse(data)
				var count = (ObjectLength(getDat) + 1).toString()
				getDat[count] = json
				var jsonJS = JSON.stringify(getDat, null, 4);
				fs.writeFileSync(site.root + 'src/data/user.json', jsonJS, 'utf8', function (err) {
					if (err) {
						return console.log(err);
					}
				});
				return res.end("done");
			} else {
				return res.end("error");
			}
		}
	});
});


app.post('/update', function (req, res) {
	var json = req.body

	fs.readFile(site.root + 'src/data/tasks.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var indata = JSON.parse(data)
			for (var key in indata) {
				if (indata.hasOwnProperty(key)) {
					var element = indata[key].ObjectId;
					if (element === json.id) {
						indata[key].State = json.State
					}
				}
			}
			var jsonJS = JSON.stringify(indata, null, 4);
			fs.writeFileSync(site.root + 'src/data/tasks.json', jsonJS, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
			});
		}
	});

	return res.end("done");
});

app.post('/archive', function (req, res) {
	var json = req.body

	fs.readFile(site.root + 'src/data/tasks.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var indata = JSON.parse(data)
			for (var key in indata) {
				if (indata.hasOwnProperty(key)) {
					var element = indata[key].ObjectId;
					if (element === json.id) {
						indata[key].State = json.State
					}
				}
			}
			var jsonJS = JSON.stringify(indata, null, 4);
			fs.writeFileSync(site.root + 'src/data/tasks.json', jsonJS, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
			});
		}
	});

	return res.end("done");
});

app.post('/modify', function (req, res) {
	var json = req.body

	fs.readFile(site.root + 'src/data/tasks.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var indata = JSON.parse(data)
			for (var key in indata) {
				if (indata.hasOwnProperty(key)) {
					var element = indata[key].ObjectId;
					if (element === json.id) {
						indata[key].MetaIndex = json.MetaIndex
					}
				}
			}
			var jsonJS = JSON.stringify(indata, null, 4);
			fs.writeFileSync(site.root + 'src/data/tasks.json', jsonJS, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
			});
		}
	});

	return res.end("done");
});

app.post('/control', function (req, res) {
	var json = req.body

	fs.readFile(site.root + 'src/data/user.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var getContents = JSON.parse(data), newVal
			for (var key in json.settings) {
				if (json.settings.hasOwnProperty(key)) {
					if (json.settings[key] === 'true') {
						json.settings[key] = true
					} else {
						json.settings[key] = parseInt(json.settings[key])
					}
				}
			}
			for (var key in getContents) {
				if (getContents.hasOwnProperty(key)) {
					if (key === json.id) {
						getContents[key].settings = json.settings
					}
				}
			}
			var jsonJS = JSON.stringify(getContents, null, 4);
			fs.writeFileSync(site.root + 'src/data/user.json', jsonJS, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
			});
		}
	});

	return res.end("done");
});

app.post('/order', function (req, res) {
	var json = req.body

	fs.readFile(site.root + 'src/data/tasks.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var indata = JSON.parse(data)
			for (var key in indata) {
				if (indata.hasOwnProperty(key)) {
					var element = indata[key].ObjectId;
					if (element === json.id) {
						indata[key].order = parseInt(json.order)
					}
				}
			}
			var jsonJS = JSON.stringify(indata, null, 4);
			fs.writeFileSync(site.root + 'src/data/tasks.json', jsonJS, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
			});
		}
	});

	return res.end("done");
});

app.post('/delete', function (req, res) {
	var json = req.body

	fs.readFile(site.root + 'src/data/tasks.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		} else {
			var indata = JSON.parse(data)
			for (var i = 0; i < indata.length; i++) {
				if (indata[i].ObjectId === json.id) {
					indata.splice(i, 1);
				}
			}
			var jsonJS = JSON.stringify(indata, null, 4);
			fs.writeFileSync(site.root + 'src/data/tasks.json', jsonJS, 'utf8', function (err) {
				if (err) {
					return console.log(err);
				}
			});
		}
	});

	return res.end("done");
});

router.use(function (req, res, next) {
	next();
});

const genall = {
	key: makeid(200),
	val: makeid(20),
	memory: process.memoryUsage(),
	cpu: process.cpuUsage(),
	platform: process.platform,
	version: process.versions
}

router.get('/', function (req, res) {
	res.render('index', genall)
})
router.get('/login', function (req, res) {
	res.render('login', genall)
})
router.get('/addtask', function (req, res) {
	res.render('addtask', genall)
})
router.get('/users', function (req, res) {
	res.render('users', genall)
})
router.get('/getuser', function (req, res) {
	res.render('getuser', genall)
})
router.get('/gettask', function (req, res) {
	res.render('gettask', genall)
})
router.get('/settings', function (req, res) {
	res.render('settings', genall)
})
router.get('/adduser', function (req, res) {
	res.render('adduser', genall)
})
router.get('/edituser', function (req, res) {
	res.render('edituser', genall)
})
router.get('/nopermission', function (req, res) {
	res.render('nopermission', genall)
})
router.get('/archivetask', function (req, res) {
	res.render('archivetask', genall)
})

app.use('/', router);
app.use('/login', router);
app.use('/addtask', router);
app.use('/users', router);
app.use('/getuser', router);
app.use('/gettask', router);
app.use('/settings', router);
app.use('/adduser', router);
app.use('/edituser', router);
app.use('/nopermission', router);
app.use('/archivetask', router);

// handling 404 errors
app.get('*', function (req, res, next) {
	var err = new Error();
	err.status = 404;
	next(err);
});
app.use(function (err, req, res, next) {
	if (err.status !== 404) {
		return next();
	}
	res.status(400);
	res.render('404.pug', { title: "404 We're sorry!", desc: "We couldn't find what you're looking for", btn: "» Go back to the main page" });
});
app.use(function (err, req, res, next) {
	if (err.status !== 500) {
		return next();
	}
	res.status(500);
	res.render('500.pug', { title: "500 Internal server error", desc: "Application is shutting down on the web server." });
});

function sendMail(from, to, e, m, n) {
	var mailOptions = {
		from: from, // sender address
		to: to, // list of receivers
		subject: "Bạn có một nhiệm vụ mới " + e, // Subject line
		text: m + n, // plaintext body
		html: '<div>' + m + '<br>' + n + '</div>' // html body
	}
	smtpTransport.sendMail(mailOptions, function (error, response) {
		if (error) {
			console.log(error);
		} else {
			console.log("Message sent: " + response.message);
		}
		// if you don't want to use this transport object anymore, uncomment following line
		//smtpTransport.close(); // shut down the connection pool, no more messages
	});
}

function ObjectLength(object) {
	var length = 0;
	for (var key in object) {
		if (object.hasOwnProperty(key)) {
			++length;
		}
	}
	return length;
};

function makeid(e) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	for (var i = 0; i < e; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	return text;
}
function removeVietnam(s) {
	var r = s.toLowerCase().replace(/\s+/g, '-');
	non_asciis = {
		'-': '[`~!@#$%^&*()_|+=?;:",.<>/]',
		'a': '[ảàạảãàáâãäåắặẳằẵấầẩẫậâă]',
		'ae': 'æ',
		'c': 'ç',
		'e': '[èéẹẽẻềệếểễê]',
		'd': '[đ]',
		'i': '[ìíîïị]',
		'n': 'ñ',
		'o': '[òóôõöộồốổỗơởợỡờớôơ]',
		'oe': 'œ',
		'u': '[ùúûűüủụưửựứừữư]',
		'y': '[ýỳỷỵỹ]'
	};
	for (i in non_asciis) {
		r = r.replace(new RegExp(non_asciis[i], 'gi'), i);
	}
	r = r.replace(/[^\w\s]/gi, '-')
	return r
};


function PugCom(a, b) {
	var outFileStream, parseFiles, writeToOutput;
	parseFiles = function (dirname) {
		var compiled, file, fileContents, filenames, i, pathv, len, results, stats;
		file = path.join(dirname)
		results = [];
		fileContents = fs.readFileSync(file, 'utf8');
		compiled = pug.compile(fileContents, {
			client: true,
			compileDebug: false,
			filename: file
		});
		writeToOutput(compiled, file.replace('.pug', ''))

		return results;
	};

	writeToOutput = function (fn, fnName) {
		var fnString;
		var id = makeid(10)
		fnString = fn.toString().replace('function template(locals) {var pug_html = "", pug_mixins = {}, pug_interp;pug_html = pug_html +', "var " + id + " = ").replace('return pug_html;}', 'document.write(' + id + ');;')
		return outFileStream.write(fnString);
	};
	outFileStream = fs.createWriteStream(b, {
		flags: 'w'
	});
	parseFiles(a, b);
}
PugCom(site.views + '/_footer.pug', site.views + '/_footer.js')
PugCom(site.views + '/_header.pug', site.views + '/_header.js')
PugCom(site.views + '/__index.pug', site.views + '/__index.js')
PugCom(site.views + '/__login.pug', site.views + '/__login.js')
PugCom(site.views + '/__addtask.pug', site.views + '/__addtask.js')
PugCom(site.views + '/__users.pug', site.views + '/__users.js')
PugCom(site.views + '/__getuser.pug', site.views + '/__getuser.js')
PugCom(site.views + '/__gettask.pug', site.views + '/__gettask.js')
PugCom(site.views + '/__settings.pug', site.views + '/__settings.js')
PugCom(site.views + '/__adduser.pug', site.views + '/__adduser.js')
PugCom(site.views + '/__edituser.pug', site.views + '/__edituser.js')
PugCom(site.views + '/__nopermission.pug', site.views + '/__nopermission.js')
PugCom(site.views + '/__archivetask.pug', site.views + '/__archivetask.js')

