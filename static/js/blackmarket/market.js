
// Default Variable 
var currentPageNumber = 1
var categorySearch = 'all'
var is_paginate = true
var first_load = true

// Ready
$(document).ready(function(){

    if (window.location.pathname == "/market/"){
        getCategoryDataMarket();
        sliderData()
        loadDataMarket(currentPageNumber , categorySearch)

        $(window).scroll(function() {
            if ($(window).scrollTop() >= ($(document).height() - $(window).height() )) {
                if(first_load != true){
                    loadDataMarket(currentPageNumber , categorySearch)
                }
            }
        });
    }

    if (window.location.pathname == "/market-music/"){
        getMusicCategoryDataMarket();
        musicSliderData()
        loadDataMusicMarket(currentPageNumber , categorySearch)

        $(window).scroll(function() {
            if ($(window).scrollTop() >= ($(document).height() - $(window).height() )) {
                if(first_load != true){
                    loadDataMusicMarket(currentPageNumber , categorySearch)
                }
            }
        });
    }
    
}) 


function submitSearchBox(){
    $('#searchInput').submit()
}

function getCategoryDataMarket(){    
    $.post(getBaseUrl() + "getAllCategories/", { },
        function(returnedData){                  
            data = returnedData.data
            $.each( data, function( key, value ) {

                var card = '<li id="category-'+data[key].ID+'" onclick="categoryChange('+data[key].ID+')">'+ data[key].Title +'</li>'
                $('#categoryMarketPLace').append(card)
                return
            }); 
        });
}

function getMusicCategoryDataMarket(){    
    $.post(getBaseUrl() + "getAllMusicCategories/", { },
        function(returnedData){                  
            data = returnedData.data
            $.each( data, function( key, value ) {
                var card = '<li id="category-'+data[key].ID+'" onclick="categoryMusicChange('+data[key].ID+')">'+ data[key].Title +'</li>'
                $('#categoryMarketPLace').append(card)
                return
            }); 
        });
}

// Get Slider Data
function sliderData(){
    var addr = getCookie('addr');
    $.post(getBaseUrl() + "market/", { query: "slider" , address: addr},
        function(returnedData){ 
            $('.slider-loading').fadeOut(10);

            data = returnedData.new
            $.each( data, function( key, value ) {
                var card = '<div class="item"><div class="card-item"><div class="card-img"><a href="/market/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><span class="type">'+ "ART" +'</span><div class="shortcut shortcut-image" data-img="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'"><i class="fas fa-expand"></i></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p> '+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +' BNB</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + ' buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+ data[key].countLike +'</span></div></div></div></div></div>'
                $('#popular-art').append(card)
            });
            
            data = returnedData.popular
            $.each( data, function( key, value ) {
                var card = '<div class="item"><div class="card-item"><div class="card-img"><a href="/market/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><span class="type">'+ "ART" +'</span><div class="shortcut shortcut-image" data-img="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'"><i class="fas fa-expand"></i></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p> '+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +' BNB</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + ' buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+ data[key].countLike +'</span></div></div></div></div></div>'
                $('#new-music').append(card)
            });

            $('.owl-carousel-index-slider').owlCarousel({
                loop:false,
                margin:20,
                dots:true,
                nav:true,
                responsive:{
                    0:{
                        items:1
                    },
                    600:{
                        items:2
                    },
                    1000:{
                        items:4
                    }
                }
            })


            $(".shortcut-image").click(function(){
                var imageUrl = $(this).attr("data-img")                
                    $("#full-image").attr("src", imageUrl );
                    $('#image-viewer').show();
                });
                $("#image-viewer .close").click(function(){
                $('#image-viewer').hide();
            });     
            
            $(".owl-next").html('<i class="fas fa-chevron-right"></i>');
            $(".owl-prev").html('<i class="fas fa-chevron-left"></i>');
             
        });   


        

}

function musicSliderData(){
    var addr = getCookie('addr');
    $.post(getBaseUrl() + "market-music/", { query: "slider" , address: addr},
    function(returnedData){       
        $('.slider-loading').fadeOut(10);
                   
        data = returnedData.new
        $.each( data, function( key, value ) {
            var card = ' <div class="item"><div class="card-item"><div class="card-img"><a href="/market-music/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><div class="playing"><div class="page-loading"><div class="loader"><div class="loading d-flex"><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div></div></div></div></div><span class="type">'+ "MUSIC" +'</span><div class="music-shortcut-button"><div class="shortcut shortcut-music music-'+ data[key].groupID +'" id="play" onclick="plauMusic('+ data[key].groupID +')" data-music="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].musichash +'"><i class="fas fa-play"></i></div></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p>'+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +' BNB</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + 'buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+data[key].countLike+'</span></div></div></div></div></div>';
            $('#popular-art').append(card)
        });
        
        data = returnedData.popular
        $.each( data, function( key, value ) {
            var card = ' <div class="item"><div class="card-item"><div class="card-img"><a href="/market-music/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><div class="playing"><div class="page-loading"><div class="loader"><div class="loading d-flex"><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div></div></div></div></div><span class="type">'+ "MUSIC" +'</span><div class="music-shortcut-button"><div class="shortcut shortcut-music music-'+ data[key].groupID +'" id="play" onclick="plauMusic('+ data[key].groupID +')" data-music="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].musichash +'"><i class="fas fa-play"></i></div></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p>'+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +' BNB</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + 'buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+data[key].countLike+'</span></div></div></div></div></div>';
            $('#new-music').append(card)
        });

        $('.owl-carousel-index-slider').owlCarousel({
            loop:false,
            margin:20,
            dots:true,
            nav:true,
            responsive:{
                0:{
                    items:1
                },
                600:{
                    items:2
                },
                1000:{
                    items:4
                }
            }
        })


        $(".shortcut-image").click(function(){
            var imageUrl = $(this).attr("data-img")                
                $("#full-image").attr("src", imageUrl );
                $('#image-viewer').show();
            });
            $("#image-viewer .close").click(function(){
            $('#image-viewer').hide();
        });     
        
        $(".owl-next").html('<i class="fas fa-chevron-right"></i>');
        $(".owl-prev").html('<i class="fas fa-chevron-left"></i>');
         
    });   
        

}

// Get DataVariable
function loadDataMarket(currentPage , category){
    if (is_paginate){
        is_paginate = false
        $('#scroll-loader').fadeIn(10)
        // First Load
        if(categorySearch != category){
            var addr = getCookie('addr');
            categorySearch = category
            currentPageNumber = 1
            $.post(getBaseUrl() + "market/", { query: category , address: addr},
            function(returnedData){                  
                data = returnedData.data
                $.each( data, function( key, value ) {
                    
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href="/market/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><span class="type">'+ "ART" +'</span><div class="shortcut shortcut-image" data-img="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'"><i class="fas fa-expand"></i></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p>'+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +'</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + ' buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+ data[key].countLike +'</span></div></div></div></div></div>'
                    $('#explorer-content').html(card)
                    $('#scroll-loader').fadeOut(10)
                }); 
                is_paginate = true
                first_load = false
            });              
        }

        // Scroll Loading
        else{                
            var addr = getCookie('addr');
            $.post(getBaseUrl() + "market/", { query: categorySearch, address: addr},
            function(returnedData){                  
                data = returnedData.data
                $.each( data, function( key, value ) {
                    
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href="/market/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><span class="type">'+ "ART" +'</span><div class="shortcut shortcut-image" data-img="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'"><i class="fas fa-expand"></i></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p>'+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +'</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + ' buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+ data[key].countLike +'</span></div></div></div></div></div>'
                    
                    $('#explorer-content').append(card)
                    $('#scroll-loader').fadeOut(10)

                    $(".shortcut-image").click(function(){
                        var imageUrl = $(this).attr("data-img")                
                            $("#full-image").attr("src", imageUrl );
                            $('#image-viewer').show();
                        });
                        $("#image-viewer .close").click(function(){
                        $('#image-viewer').hide();
                    });
                }); 
                is_paginate = true
                first_load = false
            });
        }
    }
}

// Get DataVariable
function loadDataMusicMarket(currentPage , category){
    if (is_paginate){
        is_paginate = false
        $('#scroll-loader').fadeIn(10);
        // First Load
        if(categorySearch != category){
            var addr = getCookie('addr');
            categorySearch = category
            currentPageNumber = 1
            $.post(getBaseUrl() + "market-music/", { query: category , address: addr},
            function(returnedData){                  
                data = returnedData.data
                $.each( data, function( key, value ) {
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href="/market-music/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><div class="playing"><div class="page-loading"><div class="loader"><div class="loading d-flex"><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div></div></div></div></div><span class="type">'+ "MUSIC" +'</span><div class="music-shortcut-button"><div class="shortcut shortcut-music music-'+ data[key].groupID +'" id="play" onclick="plauMusic('+ data[key].groupID +')" data-music="https://ipfs.nftblackmarket.io/ipfs/'+data[key].musichash+'"><i class="fas fa-play"></i></div></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p>'+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +' BNB</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + 'buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+data[key].countLike+'</span></div></div></div></div></div>';
                    $('#explorer-content').html(card)
                    $('#scroll-loader').fadeOut(10)
                }); 
                is_paginate = true
                first_load = false
            });              
        }

        // Scroll Loading
        else{                
            var addr = getCookie('addr');
            $.post(getBaseUrl() + "market-music/", { query: categorySearch, address: addr},
            function(returnedData){                  
                data = returnedData.data
                $.each( data, function( key, value ) {
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href="/market-music/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><div class="playing"><div class="page-loading"><div class="loader"><div class="loading d-flex"><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div></div></div></div></div><span class="type">'+ "MUSIC" +'</span><div class="music-shortcut-button"><div class="shortcut shortcut-music music-'+ data[key].groupID +'" id="play" onclick="plauMusic('+ data[key].groupID +')" data-music="https://ipfs.nftblackmarket.io/ipfs/'+data[key].musichash+'"><i class="fas fa-play"></i></div></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p>'+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +' BNB</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + 'buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+data[key].countLike+'</span></div></div></div></div></div>';
                    
                    $('#explorer-content').append(card)
                    $('#scroll-loader').fadeOut(10)

                    $(".shortcut-image").click(function(){
                        var imageUrl = $(this).attr("data-img")                
                            $("#full-image").attr("src", imageUrl );
                            $('#image-viewer').show();
                        });
                        $("#image-viewer .close").click(function(){
                        $('#image-viewer').hide();
                    });
                }); 
                is_paginate = true
                first_load = false
            });
        }
    }
}

// Like Post
function likePost(id){
    var addr = getCookie('addr');
    var $buttons = $(".button");
    var $button = $('.buttonLike-' + id)
    var addr = getCookie('addr');
    // Button Off
    if ($button.hasClass('is-active')) {
        $button.removeClass('is-active');

        $.post(getBaseUrl() + "likeToken/", { gid: id, address: addr, status : 0},
        function(returnedData){
            var like = parseInt($("#getText-"  + id).text());
            like = like - 1
            $(".countLike-"  + id).text("");
            $(".countLike-"  + id).text(like);
        }); 
        return;
    }
    
    // Button On (with a loader)
    $button.addClass('is-loading');
    setTimeout(function () {
        $button.removeClass('is-loading').addClass('is-active');
        $.post(getBaseUrl() + "likeToken/", { gid: id, address: addr, status : 1},
        function(returnedData){
            var like = parseInt($("#getText-"  + id).text());
            like = like + 1
            $(".countLike-"  + id).text("");
            $(".countLike-"  + id).text(like);
        });

    }, 500);
}

function likeMusicPost(id){
    var addr = getCookie('addr');
    var $buttons = $(".button");
    var $button = $('.buttonLike-' + id)
    var addr = getCookie('addr');
    // Button Off
    if ($button.hasClass('is-active')) {
        $button.removeClass('is-active');

        $.post(getBaseUrl() + "likeMusicToken/", { gid: id, address: addr, status : 0},
        function(returnedData){
            var like = parseInt($("#getText-"  + id).text());
            like = like - 1
            $(".countLike-"  + id).text("");
            $(".countLike-"  + id).text(like);
        }); 
        return;
    }
    
    // Button On (with a loader)
    $button.addClass('is-loading');
    setTimeout(function () {
        $button.removeClass('is-loading').addClass('is-active');
        $.post(getBaseUrl() + "likeMusicToken/", { gid: id, address: addr, status : 1},
        function(returnedData){
            var like = parseInt($("#getText-"  + id).text());
            like = like + 1
            $(".countLike-"  + id).text("");
            $(".countLike-"  + id).text(like);
        });

    }, 500);
}


// Like Post Trade
function likePostTrade(id){
    var $buttons = $(".button");
    var $button = $('#likeButtonSinle')            
    var addr = getCookie('addr');   
    // Button Off
    if ($button.hasClass('is-active')) {
        $button.removeClass('is-active');
        $.post(getBaseUrl() + "likeToken/", { gid: id, address: addr, status : 0},
        function(returnedData){
            var like = parseInt($("#likeCountTrade").text());
            like = like - 1
            $("#likeCountTrade").text("");
            $("#likeCountTrade").text(like);
        }); 
        return;
    }
    
    // Button On (with a loader)
    $button.addClass('is-loading');
    setTimeout(function () {
        $button.removeClass('is-loading').addClass('is-active');
        $.post(getBaseUrl() + "likeToken/", { gid: id, address: addr, status : 1},
        function(returnedData){
            var like = parseInt($("#likeCountTrade").text());
            like = like + 1
            $("#likeCountTrade").text("");
            $("#likeCountTrade").text(like);
        }); 

    }, 500);
}

function likePostMusicTrade(id){
    var $buttons = $(".button");
    var $button = $('#likeButtonSinle')            
    var addr = getCookie('addr');   
    // Button Off
    if ($button.hasClass('is-active')) {
        $button.removeClass('is-active');
        $.post(getBaseUrl() + "likeMusicToken/", { gid: id, address: addr, status : 0},
        function(returnedData){
            var like = parseInt($("#likeCountTrade").text());
            like = like - 1
            $("#likeCountTrade").text("");
            $("#likeCountTrade").text(like);
        }); 
        return;
    }
    
    // Button On (with a loader)
    $button.addClass('is-loading');
    setTimeout(function () {
        $button.removeClass('is-loading').addClass('is-active');
        $.post(getBaseUrl() + "likeMusicToken/", { gid: id, address: addr, status : 1},
        function(returnedData){
            var like = parseInt($("#likeCountTrade").text());
            like = like + 1
            $("#likeCountTrade").text("");
            $("#likeCountTrade").text(like);
        }); 

    }, 500);
}  


// Change Category
function categoryChange(id){
    var li = $('#category-'+id)        
    $('.category li').removeClass('active')
    li.addClass('active')
    $('#explorer-content').html("");
    loadDataMarket(currentPageNumber , id)
}

function categoryMusicChange(id){
    var li = $('#category-'+id)        
    $('.category li').removeClass('active')
    li.addClass('active')
    $('#explorer-content').html("");
    loadDataMusicMarket(currentPageNumber , id)
}



// Add to Market PLace
function tradeToken(gid){
    
    var addr = getCookie('addr');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
        var statusWallectConnect = getCookie('walletconnectSelected');
        $('#butTokenButton').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Buying NFT TOKEN ')

        $.post(getBaseUrl() + "trade/", {address:addr , gid: gid },
        async function(returnedData){
            if(statusWallectConnect == 'true'){ 
                myAlert('info' , 'Trade' , 'Transaction Confirming...');
                const web3 = new Web3(provider);
                await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){
                    callBackTrade(addr, txHash , returnedData.xq2 , returnedData.xd, returnedData.th)
                });
            } else {
                if(typeof returnedData.message === "undefined"){
                    ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [
                            returnedData.approve,
                        ],
                    })
                    .then(function(txHash) {

                        myAlert('info' , 'Trade' , 'Transaction Confirming...');
                        callBackTrade(addr, txHash , returnedData.xq2 , returnedData.xd, returnedData.th)

                        })
                    .catch(function(error) {
                        if (error.message == "Invalid parameters: must provide an Ethereum address."){
                            myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                            $('#butTokenButton').html('BUY')
                        }else {
                            myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                            $('#butTokenButton').html('BUY')
                        }
                    } );
                } else {
                    $('#butTokenButton').html('BUY')
                }
            }

        }).fail(function(response) {
            $('#butTokenButton').html('BUY')
            myAlert('danger' , 'Trade' , response.responseJSON.message);
        });
    }
}

function tradeMusicToken(gid){
    
    var addr = getCookie('addr');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
        var statusWallectConnect = getCookie('walletconnectSelected');
        $('#butTokenButton').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Buying NFT TOKEN ')

        $.post(getBaseUrl() + "tradeMusic/", {address:addr , gid: gid },
        async function(returnedData){
            if(statusWallectConnect == 'true'){ 
                myAlert('info' , 'Trade' , 'Transaction Confirming...');
                const web3 = new Web3(provider);
                await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){
                    callBackTradeMusic(addr, txHash , returnedData.xq2 , returnedData.xd, returnedData.th)
                });
            } else {
                if(typeof returnedData.message === "undefined"){
                    ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [
                            returnedData.approve,
                        ],
                    })
                    .then(function(txHash) {

                        myAlert('info' , 'Trade' , 'Transaction Confirming...');
                        callBackTradeMusic(addr, txHash , returnedData.xq2 , returnedData.xd, returnedData.th)

                        })
                    .catch(function(error) {
                        if (error.message == "Invalid parameters: must provide an Ethereum address."){
                            myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                            $('#butTokenButton').html('BUY')
                        }else {
                            myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                            $('#butTokenButton').html('BUY')
                        }
                    } );
                } else {
                    $('#butTokenButton').html('BUY')
                }
            }

        }).fail(function(response) {
            $('#butTokenButton').html('BUY')
            myAlert('danger' , 'Trade' , response.responseJSON.message);
        });
    }
}


function callBackTrade(addr, transactionhash, xq1, xd, th){

        var statusConfirm = false;
        var firstRequest = true;
        var firstAlert = true;
        var firstAlertStatus = true;
    
        var intervalID = setInterval(function () {
            if (statusConfirm != true){
                if (firstRequest == true){
                    firstRequest = false;
                    $.post(getBaseUrl() + "callbacktrade/", { address: addr, trx: transactionhash , xq2: xq1, xd: xd, th:th},
                        function(data){
                            window.clearInterval(intervalID);
                            statusConfirm = true;
                            if (firstAlertStatus == true){
                                firstAlertStatus = false;
                                myAlert('success' , 'Trade' , 'Your purchase for NFT Token ' + xq1 + ' was successful');
                                $('#butTokenButton').html('BUY');
                            }
                    }).fail(function(response) {
                        window.clearInterval(intervalID);
                        statusConfirm = false;
                        if (firstAlertStatus == true){
                            firstAlertStatus = false;
                            myAlert('danger' , 'Trade' , response.responseJSON.message);
                            $('#butTokenButton').html('BUY');
                        }
                    });
                } else {
                    if (firstAlert == true){
                        firstAlert = false;
                        myAlert('info' , 'Trade' , 'Please wait, the BSC network is busy, and it will take time to confirm this transaction. Do not leave this page.');
                    }
                    $.post(getBaseUrl() + "callbacktrade/", { address: addr, trx: transactionhash , xq2: xq1, xd: xd, th:th},
                        function(data){
                            window.clearInterval(intervalID);
                            statusConfirm = true;
                            if (firstAlertStatus == true){
                                firstAlertStatus = false;
                                myAlert('success' , 'Trade' , 'Your purchase for NFT Token ' + xq1 + ' was successful');
                                $('#butTokenButton').html('BUY');
                            }
                    }).fail(function(response) {
                        window.clearInterval(intervalID);
                        statusConfirm = false;
                        if (firstAlertStatus == true){
                            firstAlertStatus = false;
                            myAlert('danger' , 'Trade' , response.responseJSON.message);
                            $('#butTokenButton').html('BUY');
                        }
                    });
                }
            }
    
         }, 3500);
}


function callBackTradeMusic(addr, transactionhash, xq1, xd, th){

    var statusConfirm = false;
    var firstRequest = true;
    var firstAlert = true;
    var firstAlertStatus = true;

    var intervalID = setInterval(function () {
        if (statusConfirm != true){
            if (firstRequest == true){
                firstRequest = false;
                $.post(getBaseUrl() + "callbacktrademusic/", { address: addr, trx: transactionhash , xq2: xq1, xd: xd, th:th},
                    function(data){
                        window.clearInterval(intervalID);
                        statusConfirm = true;
                        if (firstAlertStatus == true){
                            firstAlertStatus = false;
                            myAlert('success' , 'Trade' , 'Your purchase for NFT Token ' + xq1 + ' was successful');
                            $('#butTokenButton').html('BUY');
                        }
                }).fail(function(response) {
                    window.clearInterval(intervalID);
                    statusConfirm = false;
                    if (firstAlertStatus == true){
                        firstAlertStatus = false;
                        myAlert('danger' , 'Trade' , response.responseJSON.message);
                        $('#butTokenButton').html('BUY');
                    }
                });
            } else {
                if (firstAlert == true){
                    firstAlert = false;
                    myAlert('info' , 'Trade' , 'Please wait, the BSC network is busy, and it will take time to confirm this transaction. Do not leave this page.');
                }
                $.post(getBaseUrl() + "callbacktrademusic/", { address: addr, trx: transactionhash , xq2: xq1, xd: xd, th:th},
                    function(data){
                        window.clearInterval(intervalID);
                        statusConfirm = true;
                        if (firstAlertStatus == true){
                            firstAlertStatus = false;
                            myAlert('success' , 'Trade' , 'Your purchase for NFT Token ' + xq1 + ' was successful');
                            $('#butTokenButton').html('BUY');
                        }
                }).fail(function(response) {
                    window.clearInterval(intervalID);
                    statusConfirm = false;
                    if (firstAlertStatus == true){
                        firstAlertStatus = false;
                        myAlert('danger' , 'Trade' , response.responseJSON.message);
                        $('#butTokenButton').html('BUY');
                    }
                });
            }
        }

     }, 3500);
}

$('#descriptionInput').keyup(function(){
    var $element = $(this);
    var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    $element.val( $element.val().replace(regex, ""));            
})