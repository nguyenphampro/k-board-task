var Global = {
		API_URL: "http://demo.hainamswitchboards.com",
		URLPath: ""
	},
	App = {
		Data: null,
		txtNewSelect: "",
		txtNewTitle: "",
		txtNewDate: "",
		txtNewMesage: "",
		txtNewProject: "",
		txtNewColor: "",
		txtNewMaterial: "",
		__template: function (t, e, a, o, n, i, r, s, u, w, x, g ) {
			var meuy = makeid(10)
			return '<li class="list-group-item list-group-item-action status-' + checkNull(e) + '" id="' + checkNull(t) + '"><div class="move"></div><div class="content"><div class="pot pot-' + checkNull(e) + '"><a href="/gettask?id=' + t + '"><h3>' + checkNull(a) + '</h3></a><p class="mb-0 pb-2 pr-5">' + checkNull(n) + '<button class="pdf btn btn-link btn-sm" type="button" data-toggle="modal" data-target="#pdfModal" data-backdrop="static" data-keyboard="false" data-files="' + checkNull(i) + '">Xem PDF<i class="fa fa-file-pdf ml-2"></i></button><button class="btn btn-sm btn-tg collapsed" type="button" data-toggle="collapse" data-target="#' + meuy + '" aria-expanded="false" aria-controls="' + meuy + '"><i class="fa fa-angle-down"></i></button></p></div><div class="collapse" id="' + meuy + '"><div class="details small"><hr><div class="row"><div class="col"><i class="fa fa-briefcase mr-2"></i><a href="#">' + checkNull(w) + '</a></div><div class="col-auto"><span>' + checkNull(x) + '</span></div><div class="col-auto"><span>' + checkNull(g) + '</span></div></div></div><hr><div class="create small"><div class="row no-gutters"><div class="col"><i class="fa fa-user mr-2"></i><a href="#">' + checkNull(r) + '</a></div><div class="col-auto"><span class="text-date" data-toggle="tooltip" data-placement="top" title="' + moment(checkNull(o)).format('DD/MM/YYYY') + ' lúc ' + moment(checkNull(o)).format('HH:MM') + '">' + moment(checkNull(o), "YYYYMMDD").fromNow() + '</span></div></div><hr><div class="row no-gutters"><div class="col"><i class="fa fa-cog mr-2"></i><a href="#">' + checkNull(s) + '</a></div><div class="col-auto"><span class="text-date" data-toggle="tooltip" data-placement="top" title="' + moment(checkNull(u)).format('DD/MM/YYYY') + ' lúc ' + moment(checkNull(u)).format('HH:MM') +'">' + moment(checkNull(u), "YYYYMMDD").fromNow() + '</span></div></div></div></div></div></li>'
		}
	};

function checkNull(params) {
	var g = params
	if (g) {
		return g
	} else {
		return 'Chưa xác định'
	}

}

function getParameterByName(t, e) {
	e || (e = window.location.href), t = t.replace(/[\[\]]/g, "\\$&");
	var a = new RegExp("[?&]" + t + "(=([^&#]*)|&|#|$)").exec(e);
	return a ? a[2] ? decodeURIComponent(a[2].replace(/\+/g, " ")) : "" : null
}

function makeid(t) {
	for (var e = "", a = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", o = 0; o < t; o++) e += a.charAt(Math.floor(Math.random() * a.length));
	return e
}

function checkReadyLogin() {
	localStorage.getItem("Token") && 0 < localStorage.getItem("Token").length ? $("#login").hide() : $("#login").show()
}

function logOut() {
	localStorage.removeItem("Token"), window.location.href = "/login"
}

function b64EncodeUnicode(str) {
	return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
		function toSolidBytes(match, p1) {
			return String.fromCharCode('0x' + p1);
		}));
}
function b64DecodeUnicode(str) {
	return decodeURIComponent(atob(str).split('').map(function (c) {
		return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
	}).join(''));
}

document.onkeyup = function (t) {
	if ((t = t || window.event).altKey && t.ctrlKey && t.shiftKey && 13 == t.which) return $("body"), alert(b64DecodeUnicode("QkFPIE5HVVlFTiAtIDA5Njk2ODk4OTMKRW1haWw6IGJhb25ndXllbnlhbUBnbWFpbC5jb20KV2ViOiBiYW9uZ3V5ZW55YW0uZ2l0aHViLmlv")), !1

}, $(function () {
	$('[data-toggle="tooltip"]').tooltip()
}), $(document).ready(function () {
	checkReadyLogin()
});

// Ripple
function ccCreateRipple() {
	$('[ripple]').on('click', function (e) {
		var rippleDiv = $('<div class="ripple" />'),
			rippleOffset = $(this).offset(),
			rippleY = e.pageY - rippleOffset.top,
			rippleX = e.pageX - rippleOffset.left,
			ripple = $('.ripple');

		rippleDiv.css({
			top: rippleY - (ripple.height() / 2),
			left: rippleX - (ripple.width() / 2),
			background: $(this).attr("ripple-color")
		}).appendTo($(this));
		window.setTimeout(function () {
			rippleDiv.remove();
		}, 1500);
	});
}

$(document).ready(function () {
	ccCreateRipple()
});
