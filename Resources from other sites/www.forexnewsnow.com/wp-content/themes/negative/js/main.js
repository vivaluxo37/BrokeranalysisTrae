"use strict";

$(function(){
    // Header menu
    $('.header__menu-button').on('click', function(){
        $(this).toggleClass('header__menu-button--active');
        $('.header__mobile-menu').toggleClass('header__mobile-menu--active');
    });
    // Header menu end

    // Mobile menu
    $('.menu-item').on('click', function(){
        $(this).toggleClass('menu-item--active');
    });
    // Mobile menu end
});
