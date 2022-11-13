// Default Variable 
var currentPageNumberP = 1
var categorySearchP = 'all'
var category = null
var order = null
var search = null
var pagination = true

 // Ready
 $(document).ready(function(){       
    if (window.location.pathname == "/search/"){
        pageHandle()
        loadDataSearch(currentPageNumberP , categorySearchP)

        if (pagination == true){
            $(window).scroll(function() {

                if ($(window).scrollTop() >= ($(document).height() - $(window).height() )) {
                    if(first_load != true){
                        if(is_paginate){
                            currentPageNumberP += 1
                                loadDataSearch(currentPageNumberP , categorySearchP)
                        }
                    }
                }
    
            });
        }
        
    }

    if (window.location.pathname == "/search-music/"){
        pageHandle()
        loadDataSearchMusic(currentPageNumberP , categorySearchP)

        if (pagination == true){
            $(window).scroll(function() {

                if ($(window).scrollTop() >= ($(document).height() - $(window).height() )) {
                    if(first_load != true){
                        if(is_paginate){
                            currentPageNumberP += 1
                            loadDataSearchMusic(currentPageNumberP , categorySearchP)
                        }
                    }
                }
    
            });
        }
        
    }

})  

// Get DataVariable
function loadDataSearch(currentPage , category){
    
    var urlParams = new URLSearchParams(window.location.search);  

    if(search != null && order == null){     
        pagination = false           
        mainApiRequest(0 , null, search)
    }

    if(search == null && order != null){
        pagination = true
        mainApiRequest(1 ,urlParams.get('order'), null)
    }

    // if(order == null && search == null && category != null ){
    //     mainApiRequest(category)
    // }
}

function loadDataSearchMusic(currentPage , category){
    
    var urlParams = new URLSearchParams(window.location.search);  

    if(search != null && order == null){     
        pagination = false           
        mainApiMusicRequest(0 , null, search)
    }

    if(search == null && order != null){
        pagination = true
        mainApiMusicRequest(1 ,urlParams.get('order'), null)
    }

    // if(order == null && search == null && category != null ){
    //     mainApiRequest(category)
    // }
}

// page Handle with query String
function pageHandle(){

    var urlParams = new URLSearchParams(window.location.search);
    
    

    if(urlParams.get('search') != null){
        $('#searchText').html('<span>Search <i class="fas fa-arrow-right mx-2"></i> </span>' + urlParams.get('search'))
        search = urlParams.get('search')
        console.log('search')
    }

    if(urlParams.get('order') != null){
        $('#searchText').html('<span>Order by <i class="fas fa-arrow-right mx-2"></i> </span>' + urlParams.get('order'))
        order = urlParams.get('order')
        console.log('order')
    }

    if(urlParams.get('category') != null){
        $('#searchText').html('<span>Category <i class="fas fa-arrow-right mx-2"></i> </span>' + urlParams.get('category'))
        categorySearchP = urlParams.get('category')
    }
    
}


// Send Api Here
function mainApiRequest(type, order, search){
    if(is_paginate){
        is_paginate = false
        $('#scroll-loader').fadeIn(10)
        // First Load
        if(categorySearchP != category){
            categorySearchP = category
            currentPageNumberP = 1

            // Search Api First

            var addr = getCookie('addr');
            categorySearchP = category
            currentPageNumberP = 1

            currentURL = window.location.href
            path = url.split( '/' );
            profileADDr = path[4]

            $.post(getBaseUrl() + "search/", { type: type,  query: category , address: addr , page: currentPageNumberP , order: order, search: profileADDr},
            function(returnedData){                  
                data = returnedData.data
                $.each( data, function( key, value ) {
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href="/market/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><span class="type">'+ "ART" +'</span><div class="shortcut shortcut-image" data-img="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'"><i class="fas fa-expand"></i></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p>'+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +'</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + ' buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+ data[key].countLike +'</span></div></div></div></div></div>'
                    $('#explorer-content').append(card);
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
            // Search Api Scroll
        else{                
            var addr = getCookie('addr');
            $.post(getBaseUrl() + "search/", { query: category , address: addr , page: currentPageNumberP , order: order, search: search},
            function(returnedData){                  
                data = returnedData.data
                $.each( data, function( key, value ) {
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href="/market/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><span class="type">'+ "ART" +'</span><div class="shortcut shortcut-image" data-img="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'"><i class="fas fa-expand"></i></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p>'+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +'</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + ' buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+ data[key].countLike +'</span></div></div></div></div></div>'
                    $('#explorer-content').append(card);
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


function mainApiMusicRequest(type, order, search){
    if(is_paginate){
        is_paginate = false
        $('#scroll-loader').fadeIn(10)
        // First Load
        if(categorySearchP != category){
            categorySearchP = category
            currentPageNumberP = 1

            // Search Api First

            var addr = getCookie('addr');
            categorySearchP = category
            currentPageNumberP = 1
            $.post(getBaseUrl() + "search-music/", { type: type,  query: category , address: addr , page: currentPageNumberP , order: order, search: search},
            function(returnedData){                  
                data = returnedData.data
                $.each( data, function( key, value ) {
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href="/market-music/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><div class="playing"><div class="page-loading"><div class="loader"><div class="loading d-flex"><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div></div></div></div></div><span class="type">'+ "MUSIC" +'</span><div class="music-shortcut-button"><div class="shortcut shortcut-music music-'+ data[key].groupID +'" id="play" onclick="plauMusic('+ data[key].groupID +')" data-music="https://ipfs.nftblackmarket.io/ipfs/'+data[key].musichash+'"><i class="fas fa-play"></i></div></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p>'+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +' BNB</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + 'buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+data[key].countLike+'</span></div></div></div></div></div>';
                    $('#explorer-content').append(card);
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
            // Search Api Scroll
        else{                
            var addr = getCookie('addr');
            $.post(getBaseUrl() + "search-music/", { query: category , address: addr , page: currentPageNumberP , order: order, search: search},
            function(returnedData){                  
                data = returnedData.data
                $.each( data, function( key, value ) {
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href="/market-music/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><div class="playing"><div class="page-loading"><div class="loader"><div class="loading d-flex"><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div></div></div></div></div><span class="type">'+ "MUSIC" +'</span><div class="music-shortcut-button"><div class="shortcut shortcut-music music-'+ data[key].groupID +'" id="play" onclick="plauMusic('+ data[key].groupID +')" data-music="https://ipfs.nftblackmarket.io/ipfs/'+data[key].musichash+'"><i class="fas fa-play"></i></div></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p>'+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +' BNB</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + 'buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+data[key].countLike+'</span></div></div></div></div></div>';
                    $('#explorer-content').append(card);
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



