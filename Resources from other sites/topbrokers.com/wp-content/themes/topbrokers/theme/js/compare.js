jQuery(document).ready(function ($) {
	let compare = $('.add-to-compare');
	let remove = $('.remove-from-compare');

	compare.click(function () {
		let self = this;
		let id = $(this).data('brokerId');
		$.ajax({
			url: topbrokers.restUrl + 'topbrokers/v1/compare/add',
			method: 'POST',
			data: {
				broker_id: id
			},
			success: function (result) {
				if (result.status === "success") {
					$('.compare-message').remove();
					$(self).parent().prepend(
						'<div class="compare-message">' +
						translations.compare_message + ' ' +
						'<a class="underline" href="' + translations.comparison_url + '">' +
						translations.comparison_list +
						'</a>!</div>'
					);
				}
			}

		});
	});


	remove.click(function () {
		let id = $(this).data('brokerId');

		$.ajax({
			url: topbrokers.restUrl + 'topbrokers/v1/compare/delete',
			method: 'POST',
			data: {
				broker_id: id
			},
			success: function (result) {
				if (result.status === "success") {
					location.reload();
				}
			}

		});
	});

	$('.choose-broker').click(function (){
		var arr = [];
		$('.choose-brokers input.broker-input:checkbox:checked').each(function () {
			arr.push($(this).val());
		});
		$.ajax({
			type: "POST",
			url: topbrokers.restUrl + 'topbrokers/v1/compare/add',
			data: {
				broker_ids: arr.join(','),
				empty: true
			},
			success: function (data){
				if(data.status === 'success') {
					window.location.href = '/compare-forex-brokers'
				}
			}
		});
	})

	$('.clear-selection').click(function (){
		$('.choose-brokers input.broker-input:checkbox').prop('checked', false);
	})

});
