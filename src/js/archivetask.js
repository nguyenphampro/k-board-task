checkLogin('archivetask')

function __archive__getData(go) {
	$.ajax({
		url: Global.API_URL + "/tasks.json",
		type: "GET",
		dataType: "json",
		cache: !0,
		beforeSend: function (xhr) {
			xhr.setRequestHeader("Authorization", 'Bearer ' + Cookies.get('Token'));
		},
		complete: function (data) {
			App.Data = data.responseJSON;
			var filtered = App.Data.filter(function (item) {
				return item.State === go;
			});
			filtered.sort(function compare(a, b) {
				var dateA = new Date(a.CreatedDate);
				var dateB = new Date(b.CreatedDate);
				return dateB - dateA;
			});
			filtered.sort(function compare(a, b) {
				var dateA = new Date(a.order);
				var dateB = new Date(b.order);
				return dateA - dateB;
			});
			var iTems = [], index = 1, Table_Header = '<thead> <tr> <th scope="col">#</th> <th scope="col">Tên nhiệm vụ</th> <th scope="col">Nội dung</th> <th scope="col">Ngày tạo</th> </tr></thead>'
			for (var key in filtered) {
				if (filtered.hasOwnProperty(key)) {
					var element = filtered[key];
					var item = '<tr><th>' + (index) + '</th><td><a href="/gettask?id=' + element.ObjectId + '&archive=true">' + checkNull(element.ObjectType) + '</a></td><td class="small">' + checkNull(element.Name) + '<br>' + checkNull(element.MetaDescription) + '</td><td class="small">' + checkNull(element.CreatedDate) + '</td></tr>';
					iTems.push(item)
					index++
				}
			}
			$('#lists-archive').html('<table class="table-md table-striped table-hover">' + Table_Header + '<tbody></tbody></table>')
			$('#pagination').pagination({
				dataSource: iTems,
				pageSize: Settings.pageSize,
				ulClassName: 'pagination',
				showPrevious: false,
				showNext: false,
				callback: function (data, pagination) {
					var html = data;
					$('#lists-archive table tbody').html(html);
					$('#pagination li').each(function () {
						$(this).addClass('page-item').find('a').addClass('page-link')
					})
				}
			})
		},
		error: function (jqXHR, textStatus, errorThrown) { }
	})
}

$(document).ready(function () {
	__archive__getData('N')
});
