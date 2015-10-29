; /* /bitrix/js/phpsolutions.backtotop/backtotop.js*/

; /* Start:/bitrix/js/phpsolutions.backtotop/backtotop.js*/
$(document).ready(function(){ 
	$( "body" ).append( "<a class='BackToTop' href='#'><img src='" + phpsolutions_backtotop_selected_image + "'></a>" ) ;
	$('.BackToTop').fadeTo( 0, phpsolutions_backtotop_button_opacity / 100 ) ;
	if ($(this).scrollTop() > phpsolutions_backtotop_skip ) {
        $('.BackToTop').fadeIn();
    }
	else {
        $('.BackToTop').fadeOut();
		$('.BackToTop').css( "display", 'none' ) ;	
    } 	
	
	if( phpsolutions_backtotop_position == 'top-left' ){
		$('.BackToTop').css( "top", phpsolutions_backtotop_position_indent_y + 'px' ) ;
		$('.BackToTop').css( "left", phpsolutions_backtotop_position_indent_x + 'px' ) ;				
	}
	else if( phpsolutions_backtotop_position == 'top-center' ){
		$('.BackToTop').css( "top", phpsolutions_backtotop_position_indent_y + 'px' ) ;
		$('.BackToTop').css( "left", ( $( window ).width() / 2 ) - ( phpsolutions_backtotop_image_width / 2 ) + 'px' ) ;				
	}
	else if(phpsolutions_backtotop_position=='top-right'){
		$('.BackToTop').css( "top", phpsolutions_backtotop_position_indent_y + 'px' ) ;
		$('.BackToTop').css( "right", phpsolutions_backtotop_position_indent_x + 'px' ) ;				
	}	
	else if( phpsolutions_backtotop_position == 'middle-left' ){
		$('.BackToTop').css( "top", ( $( window ).height() / 2 ) - ( phpsolutions_backtotop_image_height / 2 ) + 'px' ) ;
		$('.BackToTop').css( "left", phpsolutions_backtotop_position_indent_x + 'px' ) ;				
	}
	else if( phpsolutions_backtotop_position == 'middle-center' ){
		$('.BackToTop').css( "top", ( $( window ).height() / 2 ) - ( phpsolutions_backtotop_image_height / 2 ) + 'px' ) ;
		$('.BackToTop').css( "left", ( $( window ).width() / 2 ) - ( phpsolutions_backtotop_image_width / 2 ) + 'px' ) ;				
	}
	else if(phpsolutions_backtotop_position=='middle-right'){
		$('.BackToTop').css( "top", ( $( window ).height() / 2 ) - ( phpsolutions_backtotop_image_height / 2 ) + 'px' ) ;
		$('.BackToTop').css( "right", phpsolutions_backtotop_position_indent_x + 'px' ) ;				
	}	
	else if( phpsolutions_backtotop_position == 'bottom-left' ){
		$('.BackToTop').css( "bottom", phpsolutions_backtotop_position_indent_y + 'px' ) ;
		$('.BackToTop').css( "left", phpsolutions_backtotop_position_indent_x + 'px' ) ;				
	}
	else if( phpsolutions_backtotop_position == 'bottom-center' ){
		$('.BackToTop').css( "bottom", phpsolutions_backtotop_position_indent_y + 'px' ) ;
		$('.BackToTop').css( "left", ( $( window ).width() / 2 ) - ( phpsolutions_backtotop_image_width / 2 ) + 'px' ) ;				
	}
	else if(phpsolutions_backtotop_position=='bottom-right'){
		$('.BackToTop').css( "bottom", phpsolutions_backtotop_position_indent_y + 'px' ) ;
		$('.BackToTop').css( "right", phpsolutions_backtotop_position_indent_x + 'px' ) ;				
	}	
	
    $(window).scroll(function(){
		if ($(this).scrollTop() > phpsolutions_backtotop_skip ) {
            $('.BackToTop').fadeIn() ;
        }
		else {
            $('.BackToTop').fadeOut() ;
        } 
    }); 
    $('.BackToTop').click(function(){
        $("html, body").animate({ scrollTop: 0 }, phpsolutions_backtotop_scroll_speed ) ;
        return false ;
    }); 	
}); 	
/* End */
;