jQuery(document).ready(function ($) {
	let customFilter = $('.custom-topbrokers-filter');
	let reviewsOrderSelect= $('#customer-reviews #orderSelect');
	let filterOrderSelect= $('.filters #orderSelect');
	let reviewsContainer = $('#customer-reviews #reviews-container');
	let allReviews = $('#customer-reviews .all-reviews-button');
	let showMore = $('#show-more-pages');
	let spinner = $('#spinner');

	setCheckboxes('.filter-data');
	customFilter.change(function (event) {
		filterItems();
	});

	$('.clear-all').click(clearAllFilters);
	$('.search-filter').keyup(function (event) {
		$(this).parent().parent().find('.filter-item').removeClass('hidden');
		searchInFilter.call(this, event);
	});

	reviewsOrderSelect.change(function () {
		filterReviews();
	});

	filterOrderSelect.change(function () {
		filterItems();
	});

	showMore.click(function (event) {
		event.preventDefault();
		filterShowMore();
	});

	allReviews.click(function () {
		toggleAllReviews();
		filterReviews();
	});

	hideFilterItems();
	$('.range-slider').each(function() {
		createslider(this);
	});

	$('.show-all').click(function () {
		$(this).parent().parent().find('.filter-item').removeClass('hidden');
		$(this).hide()
	});

	$(document).click(function (event) {
		if (!$(event.target).closest('.filter-dropdown').length &&
			(!$(event.target).is('.show-filter-dropdown') && !$(event.target).parents('.show-filter-dropdown').length)) {
			$('.filter-dropdown').addClass('hidden');
		}
		if(!$(event.target).parents('.filters-modal').length && !$(event.target).is('.filters-modal')
			&& !$(event.target).is('.show-filters') && !$(event.target).parents('.show-filters').length) {
			$('.filters-modal-container').addClass('hidden');
		}
	})

	function filterItems(clearAll = false) {
		if ($(this).attr('name')){
			let name = $(this).attr('name');
			let value = $(this).val();
			let checked = $(this).is(':checked');
			$('[name="' + name + '"][value="' + value + '"]').prop('checked', checked);
		}

		let filterType = $('.filtering').data('filterType');
		let termId = $('.filtering').data('termId');

		let params = retrieveParams();

		spinner.removeClass('hidden');
		$.ajax({
			url: topbrokers.restUrl + 'topbrokers/v1/filter',
			method: 'GET',
			data: {
				params: JSON.stringify(params),
				sort_by: filterOrderSelect.val(),
				filterType: filterType,
				termId: termId,
				language: filtering.language,
				countryCode : filtering.countryCode,
				clear_all:clearAll,
			},
			success: function (result){
				if (result.status == "success") {
					$('.selected-filter').each(function () {
						$(this).html(filtering.any);
					})

					$('.items-list').html(result.data.html);

					if(result.data.total_pages < result.data.next_page){
						showMore.hide();
					}
					if(result.data.total_pages >= result.data.next_page){
						showMore.show();
						showMore.data('next-page', result.data.next_page);
					}

					if(result.data.filteredIds){
						$('.filtered-ids').data('filtered-ids', JSON.parse(result.data.filteredIds));
					}

					if(result.data.filteredIdsByRanking){
						$('.filtered-ids-by-ranking').data('filtered-ids-by-ranking', JSON.parse(result.data.filteredIdsByRanking));
					}

					if($('.new-filter-data').length > 0){
						setCheckboxes('.new-filter-data');
					}
					markSelected(params);
				}
			},
			complete(jqXHR, textStatus) {
				spinner.addClass('hidden');
			}
		});
	}

	function filterShowMore() {
		let filterType = $('.filtering').data('filterType');
		let filterIds = $('.filtered-ids').data('filtered-ids');
		let filterIdsByRanking = $('.filtered-ids-by-ranking').data('filtered-ids-by-ranking');
		spinner.removeClass('hidden');
		$.ajax({
			url: topbrokers.restUrl + 'topbrokers/v1/show_more_ajax_items',
			method: 'GET',
			data: {
				filterType: filterType,
				language: filtering.language,
				countryCode : filtering.countryCode,
				filteredIds: JSON.stringify(filterIds),
				filteredIdsByRanking: JSON.stringify(filterIdsByRanking),
				page: showMore.data('next-page') ? showMore.data('next-page') : 1
			},
			success: function (result){
				if (result.status == "success") {
					$('.items-list').append(result.data.html);

					if(result.data.total_pages < result.data.next_page){
						showMore.hide();
					}
					if(result.data.total_pages >= result.data.next_page){
						showMore.show();
						showMore.data('next-page', result.data.next_page);
					}
				}
			},
			complete(jqXHR, textStatus) {
				spinner.addClass('hidden');
			}
		});
	}

	function retrieveParams() {
		let selectedCheckboxes = $('.checkbox input[type="checkbox"]:checked, .checkbox input[type="radio"]:checked');
		let selectedRanges = $('.range-slider');

		let params = {};
		selectedCheckboxes.each(function(index, checkbox) {
			let name = $(checkbox).attr('name');
			name = name.replace(/\[\]$/, '');
			name = name.replace('_modal', '');
			if(!params[name]){
				params[name] = [];
			}
			if(params[name].indexOf($(checkbox).val()) == -1){
				params[name].push($(checkbox).val());
			}
		});

		selectedRanges.each(function(index, range) {
			let minRange = $(range).find('.min-range');
			let maxRange = $(range).find('.max-range');

			if($(minRange).val() === $(minRange).attr('min') && $(maxRange).val() === $(maxRange).attr('max')) {
				return;
			}

			let name = minRange.attr('name');
			name = name.replace(/\[\]$/, '');
			name = name.replace('_modal', '');
			if(!params[name]){
				params[name] = [];
			}
			params[name].push(minRange.val())
			params[name].push(maxRange.val())
		});

		return params;
	}
	function markSelected(params){
		for(let k in params) {
			if(params[k].length > 0) {
				let text = '';
				for (let i = 0; i < params[k].length; i++) {
					if(i <= 1) {
						let input = $('[data-filter-key="' + k + '"]').find('input[value="' + params[k][i] + '"]');
						text += input.siblings('label').text() + ' ';
					}
				}

				if ( params[k].length >= 3 ) {
					text += '<span class="text-white aspect-square rounded-xl h-[20px] w-[40px] bg-lime-700 px-1.5"> +' + (params[k].length - 2) + '</span>';
				}

				if($('.selected-filter-' + k)){
					$('.selected-filter-' + k).html(text);
				}
			}
		}
	}
	function clearAllFilters() {
		$('.checkbox input[type="checkbox"]').prop('checked', false);
		$('.checkbox input[type="radio"]').prop('checked', false);
		$('.range-slider').each(function() {
			$(this).find('.min-range').val($(this).find('.min-range').attr('min'));
			$(this).find('.max-range').val($(this).find('.max-range').attr('max'));
			createslider(this);
		})
		filterItems(true);
	}

	function searchInFilter(event) {
		let filter, filterValue, filterItems;
		filter = $(event.currentTarget);
		filterValue = filter.val();
		filterItems = filter.parent().find('.filter-item');

		filterItems.each(function () {
			if ($(this).text().toUpperCase().indexOf(filterValue.toUpperCase()) > -1) {
				$(this).removeClass('hidden');
			} else {
				$(this).addClass('hidden');
			}
		});
	}


	function hideFilterItems() {
		let filterItems = $('.filter-modal.filter-items');

		filterItems.each(function () {
			$(this).find('.filter-item:gt(4)').addClass('hidden');
		});

	}

	function filterReviews(){
		let brokerId = reviewsContainer.data('brokerId');
		let show_all = allReviews.data('clicked');

		$.ajax({
			url: topbrokers.restUrl + 'topbrokers/v1/review-filter',
			method: 'GET',
			data: {
				broker_id: brokerId,
				sort_by: reviewsOrderSelect.val(),
				show_all: show_all ?? false,
				contryCode : filtering.countryCode,
				language : filtering.language
			},
			success: function (result){
				if (result.status == "success") {
					reviewsContainer.html(result.result);
				}
			}
		});
	}


	function toggleAllReviews(){
		if (!allReviews.data('clicked')) {
			allReviews.data('clicked', true);
		} else {
			allReviews.data('clicked', false);
		}
	}


	function createslider(element) {
		const inputs = element.querySelectorAll('input');

		const thumbLeft = element.querySelector('.thumb.left');
		const thumbRight = element.querySelector('.thumb.right');
		const rangeBetween = element.querySelector('.range-between');
		const labelMin = element.querySelector('.range-label-start');
		const labelMax = element.querySelector('.range-label-end');

		const [inputStart, inputEnd] = inputs;
		let min = inputStart.value;
		let max = inputEnd.value;

		setStartValueCustomSlider(inputStart, inputEnd, thumbLeft, rangeBetween);
		setEndValueCustomSlider(inputEnd, inputStart, thumbRight, rangeBetween);
		setLabelValue(labelMin, inputStart);
		setLabelValue(labelMax, inputEnd);

		setEvents(inputStart, inputEnd, thumbLeft, thumbRight, labelMin, labelMax, rangeBetween);
	}

	function setLabelValue(label, input) {
		label.innerHTML = `${input.value}`;
	}

	function setStartValueCustomSlider(inputStart, inputEnd, pseudoEl, range) {
		let step = parseFloat(inputEnd.step); // Use parseFloat for non-integer steps
		const maximum = Math.min(parseFloat(inputStart.value), parseFloat(inputEnd.value) - step);
		if(inputStart.value !== inputStart.min){
			inputStart.value = roundToStep(maximum, step); // Round to nearest
		}
		const percent = ((maximum - inputStart.min) / (inputStart.max - inputStart.min)) * 100;
		pseudoEl.style.left = percent + '%';
		range.style.left = percent + '%';
	}

	function setEndValueCustomSlider(inputEnd, inputStart ,pseudoEl, range) {
		let step = parseFloat(inputEnd.step); // Use parseFloat for non-integer steps
		const minimum = Math.max(parseFloat(inputEnd.value), parseFloat(inputStart.value) + step);
		if(inputEnd.value !== inputEnd.max){
			inputEnd.value = roundToStep(minimum, step); // Round to nearest
		}
		const percent = ((minimum - inputEnd.min) / (inputEnd.max - inputEnd.min)) * 100;
		pseudoEl.style.right = 100 - percent + '%';
		range.style.right = 100 - percent + '%';
	}

	function roundToStep(number, step) {
		return Math.round(number / step) * step;
	}

	function setEvents(
		inputStart,
		inputEnd,
		thumbLeft,
		thumbRight,
		labelMin,
		labelMax,
		rangeBetween,
		rangesValues
	) {
		inputStart.addEventListener('input', () => {
			setStartValueCustomSlider(inputStart, inputEnd, thumbLeft, rangeBetween);
			setLabelValue(labelMin, inputStart);
		});

		inputEnd.addEventListener('input', () => {
			setEndValueCustomSlider(inputEnd, inputStart, thumbRight, rangeBetween);
			setLabelValue(labelMax, inputEnd);
		});

		// add css clases on hover and drag
		inputStart.addEventListener('mouseover', function () {
			thumbLeft.classList.add('hover');
		});
		inputStart.addEventListener('mouseout', function () {
			thumbLeft.classList.remove('hover');
		});
		inputStart.addEventListener('mousedown', function () {
			thumbLeft.classList.add('active');
		});
		inputStart.addEventListener('pointerup', function () {
			thumbLeft.classList.remove('active');
		});

		inputEnd.addEventListener('mouseover', function () {
			thumbRight.classList.add('hover');
		});
		inputEnd.addEventListener('mouseout', function () {
			thumbRight.classList.remove('hover');
		});
		inputEnd.addEventListener('mousedown', function () {
			thumbRight.classList.add('active');
		});
		inputEnd.addEventListener('pointerup', function () {
			thumbRight.classList.remove('active');
		});

		// Mobile
		inputStart.addEventListener('touchstart', function () {
			thumbLeft.classList.add('active');
		});
		inputStart.addEventListener('touchend', function () {
			thumbLeft.classList.remove('active');
		});
		inputEnd.addEventListener('touchstart', function () {
			thumbRight.classList.add('active');
		});
		inputEnd.addEventListener('touchend', function () {
			thumbRight.classList.remove('active');
		});
	}

	function setCheckboxes(element){
		if($(element).length <= 0){
			return;
		}
		let filteredData = $(element).data('filter-data');
		let sliders = ['speed_of_execution', 'min_deposit', 'max_leverage', 'max_nr_orders', 'max_position', 'min_position', 'margin_call', 'stop_out', 'locked_margin', 'spread'];
		$.each(filteredData, function (key, values) {
			if(sliders.includes(key)){
				let minInput = $('[name="' + key + '[]"].min-range');
				let maxInput = $('[name="' + key + '[]"].max-range');
				let slider = minInput.parent('.range-slider');
				let filterMin = minInput.attr('min');
				let filterMax = maxInput.attr('max');
				let min = Math.max(Number(values[0]), Number(filterMin));
				let max = Math.min(Number(values[1]), Number(filterMax));

				minInput.val(min);
				maxInput.val(max);
				createslider(slider.get(0));
				return;
			}
			if (Array.isArray(values)) {
				values.forEach(function (value) {
					$('[name="' + key + '[]"][value="' + value + '"]').prop('checked', true);
					$('[name="' + key + '"][value="' + value + '"]').prop('checked', true);
				});
			}
		});

		let params = retrieveParams();
		markSelected(params);
	}
});
