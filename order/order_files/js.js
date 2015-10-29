$(document).ready(function() {  
	$(".leftSmalImgs .leftSmalImgsInc ").jCarouselLite({
			    btnNext: ".leftSmalImgs  .sliderTopArrow",
			    btnPrev: ".leftSmalImgs  .sliderBtmArrow",
			    visible: 3,
				vertical:true
	});		
	$('.styledForm').styler();	

	$('.view-image').fancybox({helpers: {
            overlay: {
              locked: true 
            }
    }});		
});

/*main page slider*/
function nextPage(){
		var indexItem = $('.MPSliderInc .item.active').index('.MPSliderInc .item')+1;
		var itemMax = $('.MPSliderInc .item').size();
		if (indexItem==itemMax){indexItem=0}
		$('.MPSliderInc .item.active').removeClass('active').hide(0);		
		$('.MPSliderInc .item').eq(indexItem).addClass('active').fadeIn(200);

}

function prevPage(){
		var indexItem = $('.MPSliderInc .item.active').index('.MPSliderInc .item');
		var itemMax = $('.MPSliderInc .item').size();
		if (indexItem==0){indexItem=itemMax-1}else{indexItem=indexItem-1}
		$('.MPSliderInc .item.active').removeClass('active').hide(0);		
		$('.MPSliderInc .item').eq(indexItem).addClass('active').fadeIn(200);

}

/*right column slider*/

$(document).on('click','.rightProjectList .navItem:not(.active)' ,function(e){
			var activeEl = $(this).index('.rightProjectList .nav .navItem');
			$('.rightProjectList .item').css('display','none');
			$('.rightProjectList .item').eq(activeEl).fadeIn(200);
			$('.rightProjectList .nav .navItem').removeClass('active');
			$(this).addClass('active');
});

$(document).on('click','.leftSmalImgsInc li:not(.active)' ,function(e){
			$('.leftLargeImg img').attr('src',$(this).attr('data-largeImg'));
			$('.leftSmalImgsInc li').removeClass('active');
			$(this).addClass('active');
});



/*var changeTimer;*/
$(document).on('mouseenter','.projectsBlock .image img' ,function(e){
			$(this).attr('data-width',$(this).width());
			$(this).attr('data-height',$(this).height());
			$(this).stop().animate({width:$(this).width()*2, height:$(this).height()*2},10000);
			$(this).parents('.image').addClass('workingDiv');
			
			/*if($('.workingDiv').find('img').size()>=2){
					changeTimer = setTimeout(function() {
        				$('.workingDiv').find('img').eq(0).fadeOut(200);
						$('.workingDiv').find('img').eq(1).fadeIn(200);
    				}, 3000);	
			}*/
});

$(document).on('mouseleave','.projectsBlock .image img' ,function(e){
			$('.workingDiv img').stop().animate({width:$(this).attr('data-width'), height:$(this).attr('data-height')},2000);
			$('.workingDiv').removeClass('workingDiv');
			/*clearTimeout(changeTimer);*/
			
});


$(document).on('click','.showAnswer:not(.opened)' ,function(e){
			$(this).addClass('opened').parents('.item').find('.answerText').slideDown(200);
			$(this).text('Скрыть ответ');
});

$(document).on('click','.showAnswer.opened' ,function(e){
			$(this).removeClass('opened').parents('.item').find('.answerText').slideUp(200);
			$(this).text('Ответ');
});

