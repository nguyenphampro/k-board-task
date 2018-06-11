
function __user_getLists() {
	$.ajax({
		url: Global.API_URL + "/user.json",
		type: "GET",
		async: true,
		dataType: "json",
		cache: !0,
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", 'Bearer ' + localStorage.getItem('Token'));
		},
		error: function (jqXHR, textStatus, errorThrown) {
		},
		complete: function (data) {
			var getContents = JSON.parse(data.responseText)
			var iTems = [], index = 1, Table_Header = '<thead> <tr> <th scope="col">#</th> <th scope="col">Họ và tên</th> <th scope="col">Email</th> <th scope="col">Username</th> </tr></thead>'
			for (var key in getContents) {
				if (getContents.hasOwnProperty(key)) {
					var element = getContents[key];
					var item = '<tr><th>' + (index) + '</th><td><a href="/getuser?id=' + key + '">' + checkNull(element.fullname) + '</a></td><td>' + checkNull(element.email) + '</td><td>' + checkNull(element.username) + '</td></tr>';
					iTems.push(item)
					index++
				}
			}
			$('.userlists').html('<table class="table-md table-striped table-hover">' + Table_Header + '<tbody></tbody></table>')
			$('#pagination').pagination({
				dataSource: iTems,
				pageSize: 5,
				ulClassName: 'pagination',
				showPrevious: false,
				showNext: false,
				callback: function (data, pagination) {
					var html = data;
					$('.userlists table tbody').html(html);
					$('#pagination li').each(function () {
						$(this).addClass('page-item').find('a').addClass('page-link')
					})
				}
			})
		}
	})
}

$(document).ready(function () {
	__user_getLists()
});
