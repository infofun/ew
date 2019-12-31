function sendSms_test(url,idt,token) {
	api_test(url, {
		id : idt
	}, token)
}

function api_test(url, data, token){
	$.ajax({
		type: "POST",
		dataType: "json",
		url: url,
		contentType: "application/json",
		data: JSON.stringify(data),
		headers: {
			'X-CSRF-TOKEN': token
		},
		success: function(d) {
			console.log(d);
		},
		error: function(xhr, textStatus) {
			console.log('err: '+xhr+' :|: '+textStatus);
		}
	});
}

function sendSms_test2(url,idt,token) {
	api_test2(url, {
		id : idt
	}, token)
}

function api_test2(url, data, token){
	$.ajax({
		type: "POST",
		dataType: "json",
		url: url,
		contentType: "application/json",
		data: JSON.stringify(data),
		headers: {
			'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
		},
		success: function(d) {
			console.log(d);
		},
		error: function(xhr, textStatus) {
			console.log('err: '+xhr+' :|: '+textStatus);
		}
	});
}