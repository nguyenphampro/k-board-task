var express = require('express');
var compression = require('compression');
var app = express();
var router = express.Router();
var path = require('path');
var bodyParser = require("body-parser");
var fs = require('fs');
var browserSync = require('browser-sync');
var pug = require('pug');
var multer = require('multer');
var minify = require('express-minify');
var crypto = require('crypto');
var json_body_parser = bodyParser.json();
var urlencoded_body_parser = bodyParser.urlencoded({ extended: true });
var site = {
	port: process.env.PORT || 8080,
	root: './',
	views: './src'
}
var files = ''
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
		require("openurl").open("http://localhost:" + site.port + '/')
	});

}
app.set('view engine', 'pug')
app.set('views', site.views)

var Storage = multer.diskStorage({
	destination: function (req, file, callback) {
		callback(null, site.views + "/files");
	},
	filename: function (req, file, callback) {
		let type = 'pdf'
		files = crypto.createHash('md5').update(Date.now() + "_" + removeVietnam(file.originalname.substring(0, 10))).digest('hex') + '.' + type
		callback(null, files);
	}
});
var upload = multer({
	storage: Storage
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

router.use(function (req, res, next) {
	next();
});

var genall = {
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

app.use('/', router);
app.use('/login', router);
app.use('/addtask', router);
app.use('/users', router);
app.use('/getuser', router);
app.use('/gettask', router);

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
PugCom(site.views + '/_header.pug', site.views + '/_header.js')
PugCom(site.views + '/_footer.pug', site.views + '/_footer.js')
PugCom(site.views + '/__index.pug', site.views + '/__index.js')
PugCom(site.views + '/__login.pug', site.views + '/__login.js')
PugCom(site.views + '/__addtask.pug', site.views + '/__addtask.js')
PugCom(site.views + '/__users.pug', site.views + '/__users.js')
PugCom(site.views + '/__getuser.pug', site.views + '/__getuser.js')
PugCom(site.views + '/__gettask.pug', site.views + '/__gettask.js')

