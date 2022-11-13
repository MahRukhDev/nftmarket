let accounts = [];
const showAccount = document.querySelector('.showAccount');
const connectButton = document.querySelector('.connectButton');
const connectButton2 = document.querySelector('.connectButton2');
const balanceBNB = document.querySelector('.balanceBNB');
const balanceNBM = document.querySelector('.balanceNBM');
const nameProfileConnect = document.querySelector('.nameProfileConnect');
const mailProfileConnect = document.querySelector('.mailProfileConnect');

var darkMode = '<link rel="stylesheet" href="/static/css/blackmarket/style-dark.css" id="darktheme">'
var lightMode = '<link rel="stylesheet" href="/static/css/blackmarket/style.css" id="lighetheme">'

var firstLoadModal = new bootstrap.Modal(document.getElementById('updateModal'))


// Walletconnect
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
let web3Modal;
let provider;

window.addEventListener('load', async () => {
    init();
    document.querySelector("#connectWalletConnect").addEventListener("click", onConnect);
});

function init() {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          rpc: {
             56: 'https://bsc-dataseed.binance.org/'
          },
          network: 'binance',
        }
      },
    };
    web3Modal = new Web3Modal({
      cacheProvider: true, 
      providerOptions, 
    });
}

$(document).ready(async function(){

    
    $("#status_option").hide();
    $("#token_option").hide();
    $("#market_place_management").hide();
    

    autoCheckUrlCarefully();

    $.ajaxSetup({
        headers: { "X-CSRFToken": getCookie("csrftoken") }
    });

    
    var addr = getCookie('addr');
    if (addr == ""){
        connectButton.innerHTML = "Connect";
        connectButton2.innerHTML = "Connect";
        $("#modalConnect").show();
        $("#modalConnected").hide();
    }
    else {
        var statusWallectConnect = getCookie('walletconnectSelected');
        if(statusWallectConnect == 'true'){

            $("#modalConnect").show();
            $("#modalConnected").hide();

        } else {
            getAccount();
            $("#modalConnect").hide();
            $("#modalConnected").show();
        }
        
    }

        // LIVE Chart
    if (window.location.pathname == "/"){

        firstLoadModal.show();

        $.ajax({
            type:"POST",
            url: getBaseUrl(),
            contentType: "application/json; charset=utf-8",
            datatype:"json",
            success:function(response)
                {
                    const liveVlue = document.querySelector('.liveVlue');
                    const liveHolders = document.querySelector('.liveHolders');
                    const liveMarketCap = document.querySelector('.liveMarketCap');
                    const liveBurned = document.querySelector('.liveBurned');
                    
                    liveVlue.innerHTML = response.livechart.value;
                    liveHolders.innerHTML = response.livechart.holders;
                    liveMarketCap.innerHTML = response.livechart.marketcap;
                    liveBurned.innerHTML = response.livechart.burned;
                },
            error: function (Result, Status, Error) {
                // console.log("Error: " + Error);
                }
            });
        
        homeSliderData()   
        getTopUsers()
        
    }
    
 
    //     setInterval(function()
    //     {
    //         $.ajax({
    //         type:"POST",
    //         url: getBaseUrl(),
    //         contentType: "application/json; charset=utf-8",
    //         datatype:"json",
    //         success:function(response)
    //             {
    //                 liveVlue.innerHTML = response.livechart.value;
    //                 liveHolders.innerHTML = response.livechart.holders;
    //                 liveLiquidity.innerHTML = response.livechart.liquidity;
    //                 liveMarketCap.innerHTML = response.livechart.marketcap;
    //                 liveBurned.innerHTML = response.livechart.burned;
    //             },
    //         error: function (Result, Status, Error) {
    //             // console.log("Error: " + Error);
    //             }
    //         });
    //     }, 10000);//time in milliseconds 
    // }
    // END LIVE Chart

    // METAMASK
    $("#connectMetamask").click(function(){
        if (typeof window.ethereum !== 'undefined') {
            getAccount();
          } else {
              myAlert('danger' , 'Metamask' , 'Please use Metamask on your browser.');
          }
    });

    // TRUSTWALLET
    $("#connectTrustwallet").click(function(){
        if (typeof window.ethereum !== 'undefined') {
            getAccount();
          }else {
            myAlert('danger' , 'TrustWallet' , 'Please use TrustWallet dapp browser.');
        }
    });

    // TokenPocket
    $("#connectTokenPocket").click(function(){
        if (typeof window.ethereum !== 'undefined') {
            getAccount();
          }else {
            myAlert('danger' , 'TokenPocket' , 'Please use TokenPocket dapp browser.');
        }
    });

    // MathWallet
    $("#connectMathWallet").click(function(){
        if (typeof window.ethereum !== 'undefined') {
            getAccount();
          }else {
            myAlert('danger' , 'MathWallet' , 'Please use MathWallet dapp browser.');
        }
    });

    // SafePalWallet
    $("#connectSafePalWallet").click(function(){
        if (typeof window.ethereum !== 'undefined') {
            getAccount();
          }else {
            myAlert('danger' , 'SafePalWallet' , 'Please use SafePalWallet dapp browser.');
        }
    });
    

    $("#logoutMetamask").click(function(){
        setCookie('addr', "", 1);
        setCookie('minter', false, 1);
        setCookie('minterMusic', false, 1);
        connectButton.innerHTML = "Connect";
        connectButton2.innerHTML = "Connect";
        $("#modalConnect").show();
        $("#modalConnected").hide();
        $("#status_option").hide();
        $("#token_option").hide();
        $("#market_place_management").hide();
        var statusWallectConnect = getCookie('walletconnectSelected');
        if(statusWallectConnect == 'true'){
            onDisconnect();
        }
        
    });

    $('[data-toggle="tooltip"]').tooltip();
    window.onload = shareToken();


    changeTexttoLinksTrade();

    // Submenu
    $(".navbar .navbar-nav .nav-item").click(function () { //When trigger is hovered...        
        
        if($( this ).hasClass('active')){
            $('.nav-item').removeClass('active')        
            $('.nav-link').removeClass('active')
            $('.fa-angle-down').css({'transform' : 'rotate('+ 0 +'deg)'})

            $(this).find('.nav-link').removeClass('active')
            $(this).removeClass('active');
            $(this).find('.fa-angle-down').css({'transform' : 'rotate('+ 0 +'deg)'})


        }else{
            $('.nav-item').removeClass('active')        
            $('.nav-link').removeClass('active')
            $('.fa-angle-down').css({'transform' : 'rotate('+ 0 +'deg)'})


            $(this).find('.nav-link').addClass('active')
            $(this).addClass('active');
            $(this).find('.fa-angle-down').css({'transform' : 'rotate('+ 180 +'deg)'})

        }
    });


    // Calc tax app
    var nameValue = "";
    $("input[id=priceInput]").on('keyup paste',function(){

        calcPrice($(this).val());
        // nameValue = $(this).val();

    });
    function calcPrice(price){
        var recive =  0
        var taxValue = (price * 2.5) / 100
        var orginal =  $('#orginalValue').find('h4').html(price+ ' BNB')
        $('#taxValue').find('h4').html(taxValue + ' BNB')
        $('#reviceValue').find('h4').html(price - taxValue + ' BNB')

    }

    //
    $("#tokeninputSubmit").val(window.location.href);

})

function setCookie(c_name, value, c_days) {
    var myTime = new Date();
    myTime.setTime(myTime.getTime() + (c_days * 24 * 60 * 1000));
    var expires = "expires=" + myTime.toUTCString();
    document.cookie = c_name + "=" + value + ";" + expires + ";SameSite=Lax;path=/";
}


function getBaseUrl() {
    var pathArray = location.href.split('/');
    var protocol = pathArray[0];
    var host = pathArray[2];
    var url = protocol + '//' + host + '/';
    return url;
}

async function getAccount() {
    if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ 
                    method: 'wallet_addEthereumChain',
                    params: [{ 
                        chainId: '0x38',
                        chainName: 'Binance Smart Chain',
                        nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                        rpcUrls: ['https://bsc-dataseed.binance.org/'],
                        blockExplorerUrls: ['https://bscscan.com/'] 
                    }]
                });
        accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        $("#modalConnect").hide();
        $("#modalConnected").show();

        const account = accounts[0];
        showAccount.innerHTML = account;
        $("#walletInputVerification").val(account);
        $("#reporterinputSubmit").val(account);
        connectButton.innerHTML = account.substring(0, 4) + "..." + account.slice(-4);
        connectButton2.innerHTML = account.substring(0, 4) + "..." + account.slice(-4);
        $("#viewOnBscLink").attr("href", "https://bscscan.com/address/" + account);
        $("#showProfile").attr("href", "/profile/" + account);

        // Save account to Cookie
        setCookie('addr', account, 2);
        setCookie('walletconnectSelected', false, 2);
        getRequestList();
        $.post(getBaseUrl() + "balance/", { address: account },
            function(returnedData){
                balanceBNB.innerHTML = "<span>Balance BNB : </span>" + returnedData.bnb;
                balanceNBM.innerHTML = "<span>Balance NBM : </span>" + returnedData.nbm;
                setCookie('minter',returnedData.minter, 2);
                setCookie('minterMusic',returnedData.minterMusic, 2);
                
                if (getAppUrl() == 'app'){
                    var statusMinter = getCookie('minter');
                    if (statusMinter == 'true'){
                        $('#actionApprove').fadeOut(0)
                        $('#actionMint').fadeIn(0)
                    } else {
                        $('#actionApprove').fadeIn(0)
                        $('#actionMint').fadeOut(0)
                    }
                }
                
                if (getAppUrl() == 'app-music'){
                    var statusminterMusic = getCookie('minterMusic');
                    if (statusminterMusic == 'true'){
                        $('#actionApprove').fadeOut(0)
                        $('#actionMint').fadeIn(0)
                    } else {
                        $('#actionApprove').fadeIn(0)
                        $('#actionMint').fadeOut(0)
                    }
                }
        });

        getProfileData(account);

        $(".owl-next").html('<i class="fas fa-chevron-right"></i>');
        $(".owl-prev").html('<i class="fas fa-chevron-left"></i>');

        $(".shortcut-image").click(function(){
            var imageUrl = $(this).attr("data-img")                
            $("#full-image").attr("src", imageUrl );
            $('#image-viewer').show();
            });

            $("#image-viewer .close").click(function(){
            $('#image-viewer').hide();
        });

        if (window.location.pathname == "/app/"){
            getDataNFTList();
        }

        if (window.location.pathname == "/app-music/"){
            getDataNFTMusicList();
        }

        if (window.location.pathname == "/myassets/"){
            getAssetsArt();   
            getAssetsMusic();
        }

        var owener = $("#oweneraddress").text();
        var addr = getCookie('addr');
        if (owener.toString().toUpperCase() == addr.toString().toUpperCase()){
            $("#status_option").show();
            $("#token_option").show();
            $("#market_place_management").show();
            if (getAppUrl() == 'app'){
                getCategoryData();
            } else {
                getMusicCategoryData();
            }
        } else {
            $("#status_option").hide();
            $("#token_option").hide();
            $("#market_place_management").hide();
        }
        

    } else {
        // myAlert('info' , 'Wallet' , 'Please connect your wallet.');
    };
};

// Default Data
var imageUploaded = null , titleInput = '' , originInput = '' , descriptionInput = '' , imageProfile = null  , fileMusic = null
var audioElement = document.createElement('audio');
var picture_national_driving_passport = null , pictureYourFace = null , picture_face_with_paper = null
var prgoressPecent = 0


// Create music NFT P
function plauMusic(id){
    var $buttons = $('.shortcut-music')                           
            var $button = $('.music-' + id)
            var $parent = $button.parents('.card-img')
            var $parents = $buttons.parents('.card-img')            
                                                        
            // Button Off
            if ($button.hasClass('is-active')) {
                $buttons.html('<i class="fas fa-play"></i>')                
                $button.html('<i class="fas fa-play"></i>')
                $button.removeClass('is-active');
                audioElement.pause();
                $parent.find('.playing').hide()
                return;
            }

            $buttons.html('<i class="fas fa-play"></i>')
            $parents.find('.playing').hide()
            $parent.find('.playing').show()
            var musicUrl = $button.attr('data-music')
            $button.html('<i class="fas fa-pause"></i>')
            audioElement.setAttribute('src', musicUrl);
            audioElement.play();
            $button.addClass('is-active')

            setTimeout(function(){
                console.log('worked')
                $buttons.html('<i class="fas fa-play"></i>')                
                $button.html('<i class="fas fa-play"></i>')
                $button.removeClass('is-active');
                audioElement.pause();
                $parent.find('.playing').hide()
                return;
            }, 15000);

} 


// success - danger - warning - info
function myAlert(type , title , text){
    $('.modal-backdrop').hide()
    var alert = '<div class="modal-'+type+'"><div class="modal fade" id="my-alert" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true"><div class="modal-dialog modal-dialog-centered"><div class="modal-content"><div class="modal-header"><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body text-center"><img src="/static/images/resource/alerts/'+type+'.svg" width="198px" alt=""><h5 class="alert-heading pt-4">'+title+'</h5><p>'+text+'</p></div></div></div></div></div>' 
    $('.modal-alerts').html(alert)
    var myAlert = new bootstrap.Modal(document.getElementById('my-alert'))
    myAlert.show()
}

        
// How show the token lost 
function changeStyle(type){
    var el = $('.content-list-token')
    var head = $('.header-list-token')
    if(type == 1){
        el.removeClass('list-style')
        head.removeClass('list-style')
    }else if(type == 0){
        el.addClass('list-style')
        head.addClass('list-style')
    }
}

function callBackTRX(addr, transactionhash){

    if (getAppUrl() == 'app'){
    
        $.post(getBaseUrl() + "callbackminter/", { address: addr, trx: transactionhash },
                function(data){
                    myAlert('success' , 'Transaction' , 'You can now create NFT Token : Click Mint');
                    $('#actionApprove').fadeOut(0)
                    $('#actionMint').fadeIn(0)
                    $('#actionApprove').html('Approve')
                    
            }).fail(function(response) {
                myAlert('danger' , 'Mint' , response.responseJSON.message);
                $('#actionMint').html('Mint')
            }); 
    } else {

        $.post(getBaseUrl() + "callbackmintermusic/", { address: addr, trx: transactionhash },
                function(data){
                    myAlert('success' , 'Transaction' , 'You can now create NFT Token : Click Mint');
                    $('#actionApprove').fadeOut(0)
                    $('#actionMint').fadeIn(0)
                    $('#actionApprove').html('Approve')
                    
            }).fail(function(response) {
                myAlert('danger' , 'Mint' , response.responseJSON.message);
                $('#actionMint').html('Mint')
            }); 

    }
}

function callBackMint(addr, transactionhash, gid){

    var statusConfirm = false;
    var firstRequest = true;
    var firstAlert = true;
    var firstAlertStatus = true;

    var intervalID = setInterval(function () {
        if (statusConfirm != true){
            if (firstRequest == true){
                firstRequest = false;
                $.post(getBaseUrl() + "callback/", { address: addr, trx: transactionhash , gid: gid},
                    function(data){
                        window.clearInterval(intervalID);
                        statusConfirm = true;
                        if (firstAlertStatus == true){
                            firstAlertStatus = false;
                            myAlert('success' , 'Mint' , 'Your NFT Token was created');
                            $('#actionApprove').fadeIn(0)
                            $('#actionMint').fadeOut(0)
                            $('#actionApprove').html('Approve')
                            $('#actionMint').html('Mint')
                            getDataNFTList();
                        }
                }).fail(function(response) {
                    window.clearInterval(intervalID);
                    statusConfirm = false;
                    if (firstAlertStatus == true){
                        firstAlertStatus = false;
                        myAlert('danger' , 'Mint' , response.responseJSON.message);
                        $('#actionMint').html('Mint')
                    }
                });
            } else {
                if (firstAlert == true){
                    firstAlert = false;
                    myAlert('info' , 'Mint' , 'Please wait, the BSC network is busy, and it will take time to confirm this transaction. Do not leave this page.');
                }
                $.post(getBaseUrl() + "callback/", { address: addr, trx: transactionhash , gid: gid},
                    function(data){
                        window.clearInterval(intervalID);
                        statusConfirm = true;
                        if (firstAlertStatus == true){
                            firstAlertStatus = false;
                            myAlert('success' , 'Mint' , 'Your NFT Token was created');
                            $('#actionApprove').fadeIn(0)
                            $('#actionMint').fadeOut(0)
                            $('#actionApprove').html('Approve')
                            $('#actionMint').html('Mint')
                            getDataNFTList();
                        }
                }).fail(function(response) {
                    window.clearInterval(intervalID);
                    statusConfirm = false;
                    if (firstAlertStatus == true){
                        firstAlertStatus = false;
                        myAlert('danger' , 'Mint' , response.responseJSON.message);
                        $('#actionMint').html('Mint')
                    }
                });
            }
        }

     }, 3500);
  
}

function callBackMintMusic(addr, transactionhash, gid){

    var statusConfirm = false;
    var firstRequest = true;
    var firstAlert = true;
    var firstAlertStatus = true;

    var intervalID = setInterval(function () {
        if (statusConfirm != true){
            if (firstRequest == true){
                firstRequest = false;
                $.post(getBaseUrl() + "callbackmusic/", { address: addr, trx: transactionhash , gid: gid},
                    function(data){
                        window.clearInterval(intervalID);
                        statusConfirm = true;
                        if (firstAlertStatus == true){
                            firstAlertStatus = false;
                            myAlert('success' , 'Mint' , 'Your NFT Token was created');
                            $('#actionApprove').fadeIn(0)
                            $('#actionMint').fadeOut(0)
                            $('#actionApprove').html('Approve')
                            $('#actionMint').html('Mint')
                            getDataNFTMusicList();
                        }
                }).fail(function(response) {
                    window.clearInterval(intervalID);
                    statusConfirm = false;
                    if (firstAlertStatus == true){
                        firstAlertStatus = false;
                        myAlert('danger' , 'Mint' , response.responseJSON.message);
                        $('#actionMint').html('Mint')
                    }
                });
            } else {
                if (firstAlert == true){
                    firstAlert = false;
                    myAlert('info' , 'Mint' , 'Please wait, the BSC network is busy, and it will take time to confirm this transaction. Do not leave this page.');
                }
                $.post(getBaseUrl() + "callbackmusic/", { address: addr, trx: transactionhash , gid: gid},
                    function(data){
                        window.clearInterval(intervalID);
                        statusConfirm = true;
                        if (firstAlertStatus == true){
                            firstAlertStatus = false;
                            myAlert('success' , 'Mint' , 'Your NFT Token was created');
                            $('#actionApprove').fadeIn(0)
                            $('#actionMint').fadeOut(0)
                            $('#actionApprove').html('Approve')
                            $('#actionMint').html('Mint')
                            getDataNFTMusicList();
                        }
                }).fail(function(response) {
                    window.clearInterval(intervalID);
                    statusConfirm = false;
                    if (firstAlertStatus == true){
                        firstAlertStatus = false;
                        myAlert('danger' , 'Mint' , response.responseJSON.message);
                        $('#actionMint').html('Mint')
                    }
                });
            }
        }

     }, 3500);
  
}

function callBackBurn(addr, transactionhash, tokens, count){
    if (getAppUrl() == 'app'){
        $.post(getBaseUrl() + "callbackburn/", { address: addr, trx: transactionhash , tokens: tokens, count: count},
                function(data){
                    myAlert('success' , 'Transaction' , 'Your NFT Token was burned');
                    $('#burnToken').html('Burned');
                    setInterval(function()
                    {
                        location.reload();
                    }, 3000);//time in milliseconds
            }).fail(function(response) {
                myAlert('danger' , 'Burn' , response.responseJSON.message);
                $('#burnToken').html('Burn')
            });
    } else {
        $.post(getBaseUrl() + "callbackburnMusic/", { address: addr, trx: transactionhash , tokens: tokens, count: count},
                function(data){
                    myAlert('success' , 'Transaction' , 'Your NFT Token was burned');
                    $('#burnToken').html('Burned');
                    setInterval(function()
                    {
                        location.reload();
                    }, 3000);//time in milliseconds
            }).fail(function(response) {
                myAlert('danger' , 'Burn' , response.responseJSON.message);
                $('#burnToken').html('Burn')
            });
    }
}

function callBackTransfer(addr, transactionhash, tokens, rec, count){
    if (getAppUrl() == 'app'){
        $.post(getBaseUrl() + "callbacktransfer/", { address: addr, trx: transactionhash , tokens: tokens, receiver:rec, count: count},
            function(data){
                myAlert('success' , 'Transaction' , 'Your NFT Token was Transfered to ' + rec);
                $('#transferToken').html('Transfered');
                setInterval(function()
                {
                    location.reload();
                }, 3000);//time in milliseconds
        }).fail(function(response) {
            myAlert('danger' , 'Transaction' , response.responseJSON.message);
            $('#transferToken').html('Transfer');
        }); 
    } else {
        $.post(getBaseUrl() + "callbacktransferMusic/", { address: addr, trx: transactionhash , tokens: tokens, receiver:rec, count: count},
            function(data){
                myAlert('success' , 'Transaction' , 'Your NFT Token was Transfered to ' + rec);
                $('#transferToken').html('Transfered');
                setInterval(function()
                {
                    location.reload();
                }, 3000);//time in milliseconds
        }).fail(function(response) {
            myAlert('danger' , 'Transaction' , response.responseJSON.message);
            $('#transferToken').html('Transfer');
        }); 

    }
      
}

function validateForm(validateType , data){
    switch (validateType){
        case 'integer' :
            return Math.floor(data) == data && $.isNumeric(data)  
        break;
        case 'float' : 
            return $.isNumeric(data) 
        break;
    }
}

// Approve 
function approve(){
    var addr = getCookie('addr');
    var statusWallectConnect = getCookie('walletconnectSelected');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
            $('#actionApprove').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Approving')

            if (getAppUrl() == 'app'){

                $.post(getBaseUrl() + "addminter/", { address: addr},
                async function(returnedData){
                    if(statusWallectConnect == 'true'){
                        myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                        const web3 = new Web3(provider);
                        await web3.eth.sendTransaction(returnedData.trx).on('transactionHash', function(txHash){
                        callBackTRX(addr ,txHash);
                        });
                    } else {
                        if(typeof returnedData.message === "undefined"){
                            ethereum.request({
                                method: 'eth_sendTransaction',
                                params: [
                                    returnedData.trx,
                                ],
                            })
                            .then(function(txHash) {
                                myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                callBackTRX(addr ,txHash);
                                })
                            .catch(function(error) {
                                if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                    myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                    $('#actionApprove').html('Approve')
                                }else {
                                    myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                    $('#actionApprove').html('Approve')
                                }
                            } );
                        } else {
                            $('#actionApprove').fadeOut(0)
                            $('#actionMint').fadeIn(0)
                            $('#actionApprove').html('Approve')
                        }
                    }

                }).fail(function(response) {
                    if(response.responseJSON.message == "Your address has not accepted Terms of Service and Privacy Policy"){
                        $('#actionApprove').html('Approve')
                        $("#policyModal").modal('toggle');
                    }else{
                        myAlert('danger' , 'Minter' , response.responseJSON.message);
                        $('#actionApprove').html('Approve')
                    }
                });
            } else {

                $.post(getBaseUrl() + "addminterMusic/", { address: addr},
                async function(returnedData){
                    if(statusWallectConnect == 'true'){
                        myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                        const web3 = new Web3(provider);
                        await web3.eth.sendTransaction(returnedData.trx).on('transactionHash', function(txHash){
                        callBackTRX(addr ,txHash);
                        });
                    } else {
                        if(typeof returnedData.message === "undefined"){
                            ethereum.request({
                                method: 'eth_sendTransaction',
                                params: [
                                    returnedData.trx,
                                ],
                            })
                            .then(function(txHash) {
                                myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                callBackTRX(addr ,txHash);
                                })
                            .catch(function(error) {
                                if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                    myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                    $('#actionApprove').html('Approve')
                                }else {
                                    myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                    $('#actionApprove').html('Approve')
                                }
                            } );
                        } else {
                            $('#actionApprove').fadeOut(0)
                            $('#actionMint').fadeIn(0)
                            $('#actionApprove').html('Approve')
                        }
                    }

                }).fail(function(response) {
                    if(response.responseJSON.message == "Your address has not accepted Terms of Service and Privacy Policy"){
                        $('#actionApprove').html('Approve')
                        $("#policyModal").modal('toggle');
                    }else{
                        myAlert('danger' , 'Minter' , response.responseJSON.message);
                        $('#actionApprove').html('Approve')
                    }
                });

            }

    }
    

}

// Mint 
function mint(){
    var addr = getCookie('addr');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
        var titleInput = $('#titleinput').val()
        var originInput = $('#originInput').val()
        var descriptionInput = $('#descriptionInput').val()
        var typeToken = $('.anything').find('input[name=typeToken]:checked').val()
        var priceInput = $('#priceInput').val();
        var numberInput = $('#numberInput').val();
        var statusWallectConnect = getCookie('walletconnectSelected');
    
        if(isValidTitle && isValidOrigin && isValidCount && isValidPrice && titleInput != '' && originInput != '' && descriptionInput != '' && validateForm('float',priceInput) != false != '' && validateForm('integer',numberInput) != false != '' && imageUploaded != null){
                $('#actionMint').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Uploading')
                const formData = new FormData()
                formData.append('addr' , addr)
                formData.append('uploadFILE', imageUploaded, imageUploaded.name)
                formData.append('title' , titleInput)
                formData.append('origin' , originInput)
                formData.append('description' , descriptionInput)
                formData.append('typeToken' , typeToken)
                formData.append('priceToken' , priceInput)
                formData.append('numberToken' , numberInput)
                return fetch('/safemint/', {
                            method: 'POST',
                            body: formData
                        })
                        .then(res => {
                            if (res.status === 400) {
                                res.json().then(function(object) {
                                    if(object.message == "Your address has not accepted Terms of Service and Privacy Policy"){
                                        $('#actionApprove').fadeOut(0)
                                        $('#actionMint').fadeIn(0)
                                        $('#actionMint').html('Mint')
                                        $("#policyModal").modal('toggle');
                                    }else{
                                        myAlert('danger' , 'Mint' , object.message);
                                        $('#actionMint').html('Mint')
                                    }
                                })
                            } else if (res.status === 201) {
                                res.json().then(async function(object) {

                                    var groupid = object.gid

                                    if(statusWallectConnect == 'true'){

                                        myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                        $('#actionMint').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Minting')
                                        const web3 = new Web3(provider);
                                        await web3.eth.sendTransaction(object.approve).on('transactionHash', function(txHash){
                                            callBackMint(addr ,txHash, groupid);
                                        });

                                    } else {
                                        $('#actionMint').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Minting')
                                        ethereum.request({
                                            method: 'eth_sendTransaction',
                                            params: [
                                                object.approve,
                                            ],
                                        })
                                        .then(function(txHash) {
                                            myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                            callBackMint(addr ,txHash, groupid);
                                            })
                                        .catch(function(error) {
                                            if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                                myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                                $('#actionMint').html('Mint')
                                            }else {
                                                myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                                $('#actionMint').html('Mint')
                                            }
                                        } );
                                }
                                    
                                })
                                $('#actionApprove').fadeOut(0)
                                $('#actionMint').fadeIn(0)
                                $('#actionMint').html('Mint')
                            }
                        });

        } else{
            myAlert('danger' , 'Unsuccessful' , 'Invalid Inputs')
        }
    }
}


// Music Uploader 
function uploadMusicFile (event , useWebWorker) {
    var file = event.target.files[0]
    fileMusic = file            
    var htmlCode = '<button class="btn remove-file" onclick="changeMusicFile()"><i class="fas fa-exchange-alt me-1"></i> Change File</button><div class="uploaded-music"><i class="fas fa-file"></i><div class="w-100"><h6>'+ file.name +'</h6><div class="progress" id="progressMusicFile"><div class="progress-bar w-0" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div></div><small>'+ bytesToSize(file.size) +'</small></div></div>'
    $('#showMusicUploaded').html(htmlCode)
    
    $('#progressMusicFile').css('display' , 'flex')
    setTimeout(
    function() 
    {
        $('#progressMusicFile').find('.progress-bar').delay("slow").css({ 'width': '100%'})
    }, 1000);
}

function changeMusicFile(){
    var htmlCode = '<i class="fas fa-cloud-upload-alt"></i><span>Upload Music File</span>'          
    $('#showMusicUploaded').html(htmlCode)
}

function bytesToSize(bytes) {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return 'n/a'
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10)
    if (i === 0) return `${bytes} ${sizes[i]})`
    return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`
}

// Mint 
function mintMusic(){
    var addr = getCookie('addr');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
        var titleInput = $('#titleinput').val()
        var originInput = $('#originInput').val()
        var descriptionInput = $('#descriptionInput').val()
        var typeToken = $('.anything').find('input[name=typeToken]:checked').val()
        var priceInput = $('#priceInput').val();
        var numberInput = $('#numberInput').val();
        var statusWallectConnect = getCookie('walletconnectSelected');
    
        if(isValidTitle && isValidOrigin && isValidCount && isValidPrice &&  titleInput != '' && originInput != '' && descriptionInput != '' && validateForm('float',priceInput) != false != '' && validateForm('integer',numberInput) != false != '' && imageUploaded != null, fileMusic != null){
                $('#actionMint').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Uploading')
                const formData = new FormData()
                formData.append('addr' , addr)
                formData.append('uploadCOVER', imageUploaded, imageUploaded.name)
                formData.append('uploadFILE',fileMusic,fileMusic.name)
                formData.append('title' , titleInput)
                formData.append('origin' , originInput)
                formData.append('description' , descriptionInput)
                formData.append('typeToken' , typeToken)
                formData.append('priceToken' , priceInput)
                formData.append('numberToken' , numberInput)
                return fetch('/safemintmusic/', {
                            method: 'POST',
                            body: formData
                        })
                        .then(res => {
                            if (res.status === 400) {
                                res.json().then(function(object) {
                                    if(object.message == "Your address has not accepted Terms of Service and Privacy Policy"){
                                        $('#actionApprove').fadeOut(0)
                                        $('#actionMint').fadeIn(0)
                                        $('#actionMint').html('Mint')
                                        $("#policyModal").modal('toggle');
                                    }else{
                                        myAlert('danger' , 'Mint' , object.message);
                                        $('#actionMint').html('Mint')
                                    }
                                })
                            } else if (res.status === 201) {
                                res.json().then(async function(object) {

                                    var groupid = object.gid

                                    if(statusWallectConnect == 'true'){
                                        $('#actionMint').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Minting')
                                        myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                        const web3 = new Web3(provider);
                                        await web3.eth.sendTransaction(object.approve).on('transactionHash', function(txHash){
                                            callBackMintMusic(addr ,txHash, groupid);
                                        });

                                    } else {
                                        $('#actionMint').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Minting')
                                        ethereum.request({
                                            method: 'eth_sendTransaction',
                                            params: [
                                                object.approve,
                                            ],
                                        })
                                        .then(function(txHash) {
                                            myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                            callBackMintMusic(addr ,txHash, groupid);
                                            })
                                        .catch(function(error) {
                                            if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                                myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                                $('#actionMint').html('Mint')
                                            }else {
                                                myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                                $('#actionMint').html('Mint')
                                            }
                                        } );
                                }
                                    
                                })
                                $('#actionApprove').fadeOut(0)
                                $('#actionMint').fadeIn(0)
                                $('#actionMint').html('Mint')
                            }
                        });

        } else{
            myAlert('danger' , 'Unsuccessful' , 'Invalid Inputs')
        }
    }
}

function convertTimestamp(timestamp){
    var date = timestamp.split("T")
    var time = date[1].split('.')
    return moment(date[0] +  ' ' + time[0]).format('YYYY-MM-D')                    
}

// Get Data
function getDataNFTList(){

    var addr = getCookie('addr');
    if (addr != ""){
        var statusMinter = getCookie('minter');
        if (statusMinter == 'true'){
            $('#actionApprove').fadeOut(0)
            $('#actionMint').fadeIn(0)
        } else {
            $('#actionApprove').fadeIn(0)
            $('#actionMint').fadeOut(0)
        }

        $.post(getBaseUrl() + "mynft/", { address: addr },
        function(returnedData){
            $('#content-list').html('');
            resetData();
            data = returnedData.data

            if(data.length < 1){
                var card = '<div class="text-center py-5" id="not-found-icon"><img src="/static/images/notFound.svg" class="img-fluid"  alt=""></div>'
                $('#content-list').append(card)
            }else{
                $.each( data, function( key, value ) {
                    // var card = '<div class="col-lg-4 col-sm-6"><div class="card"><div class="card-image"><a href=/app/nft/'+value.token_id+'/'+ value.group_id + '><img src=https://ipfs.nftblackmarket.io/ipfs/'+value.imghash+' class="img-fluid" alt=""><div class="image-caption"><span class="bridge">'+ value.status +'</span><span class="bridge">'+ value.count +'</span></div><div class="preview"><img src="/static/images/Icons/all/preview.svg" class="img-fluid" alt=""></div></a></div><div class="card-body"><div class="title"><div class="w-100"><img src="/static/images/Icons/yellowLogo.svg" alt=""><h4>'+value.title+'</h4></div><a target="_blank" href=/app/nft/'+value.token_id+'/'+ value.group_id + '><img src="/static/images/Icons/all/resize.svg" alt=""></a></div><ul><li>ID : <a target="_blank" href=https://bscscan.com/token/0x014712cC2F006570E379F82fB870087af6Ab4B11?a='+value.token_id+'>'+value.token_id+'</a></li><li>Collection ID : <a target="_blank" href=https://bscscan.com/token/0x014712cC2F006570E379F82fB870087af6Ab4B11?a='+value.group_id+'>'+value.group_id+'</a></li><li>Hash : <a target="_blank" href=https://ipfs.nftblackmarket.io/ipfs/'+value.hash+'>'+value.hash+'</a></li><li>ViewTransaction : <a target="_blank" href=https://bscscan.com/tx/'+value.trx_hast+'>'+value.trx_hast+'</a></li><li><a target="_blank" href=https://bscscan.com/token/0x014712cC2F006570E379F82fB870087af6Ab4B11>Constructor Contract</a></li></ul><div class="time-like"><span>'+convertTimestamp(value.timestamp)+'</span><div><span><img src="/static/images/Icons/all/Origin.svg" alt=""> <h6>'+value.origin+'</h6></span><span><img src="/static/images/Icons/all/like.svg" alt=""> <h6>'+value.countLike+'</h6></span></div></div></div></div></div>'
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href="/app/nft/'+value.token_id+'/'+ value.group_id+'"><img src=https://ipfs.nftblackmarket.io/ipfs/'+value.imghash+' alt=""></a><span class="type">'+value.status+'</span><div class="shortcut shortcut-image" data-img=https://ipfs.nftblackmarket.io/ipfs/'+value.imghash+'><i class="fas fa-expand"></i></div></div><div class="w-100"><div class="card-body"><h5 class="title">'+value.title+'</h5><ul><li>ID : <span><a target="_blank" href=https://bscscan.com/token/0x014712cC2F006570E379F82fB870087af6Ab4B11?a='+value.token_id+'>'+value.token_id+'</a></span></li><li>Collection ID : <span><a target="_blank" href=https://bscscan.com/token/0x014712cC2F006570E379F82fB870087af6Ab4B11?a='+value.group_id+'>'+value.group_id+'</a></span></li></ul></div><div class="card-footer"><div class="time"><span class="badge"><i class="far fa-clock"></i><span>'+convertTimestamp(value.timestamp)+'</span></span></div><div class="country-like"><span class="badge"><i class="fas fa-globe-americas"></i><span>'+value.origin+'</span></span><span class="badge"><i class="far fa-heart"></i><span>'+value.countLike+'</span></span></div></div></div></div> </div>';
                    $('#content-list').append(card)                        
                });

                $(".shortcut-image").click(function(){
                    var imageUrl = $(this).attr("data-img")                
                    $("#full-image").attr("src", imageUrl );
                    $('#image-viewer').show();
                    });

                    $("#image-viewer .close").click(function(){
                    $('#image-viewer').hide();
                });
        }

        });
    }         
}

function getDataNFTMusicList(){

    var addr = getCookie('addr');
    if (addr != ""){
        var statusminterMusic = getCookie('minterMusic');
        if (statusminterMusic == 'true'){
            $('#actionApprove').fadeOut(0)
            $('#actionMint').fadeIn(0)
        } else {
            $('#actionApprove').fadeIn(0)
            $('#actionMint').fadeOut(0)
        }

        $.post(getBaseUrl() + "mymusicnft/", { address: addr },
        function(returnedData){
            $('#content-list').html('');
            resetData();
            data = returnedData.data

            if(data.length < 1){
                var card = '<div class="text-center py-5" id="not-found-icon"><img src="/static/images/notFound.svg" class="img-fluid"  alt=""></div>'
                $('#content-list').append(card)
            }else{
                $.each( data, function( key, value ) {
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href=/app-music/nft/'+value.token_id+'/'+ value.group_id + '><img src=https://ipfs.nftblackmarket.io/ipfs/'+value.imghash+' alt=""></a><div class="playing"><div class="page-loading"><div class="loader"><div class="loading d-flex"><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div></div></div></div></div><span class="type">'+"MUSIC"+'</span><div class="music-shortcut-button"><div class="shortcut shortcut-music music-'+value.group_id+'" id="play" onclick="plauMusic('+value.group_id+')" data-music="https://ipfs.nftblackmarket.io/ipfs/'+value.musichash+'"><i class="fas fa-play"></i></div></div></div><div class="w-100"><div class="card-body"><h5 class="title">'+value.title+'</h5><ul><li>ID : <span>'+value.token_id+'</span></li><li>Collection ID : <span>'+value.group_id+'</span></li></ul></div><div class="card-footer"><div class="time"><span class="badge"><i class="far fa-clock"></i><span>'+convertTimestamp(value.timestamp)+'</span></span></div><div class="country-like"><span class="badge"><i class="fas fa-globe-americas"></i><span>'+value.origin+'</span></span><span class="badge"><i class="far fa-heart"></i><span>'+value.countLike+'</span></span></div></div></div></div></div>'
                    $('#content-list').append(card)                        
                });
        }

        });
    }         
}
    
// Reset Input data 
function resetData(){
    var titleInput = $('#titleinput').val('')
    var originInput = $('#originInput').val('')
    var descriptionInput = $('#descriptionInput').val('')
    var numberInput = $('#numberInput').val('')
    var priceInput = $('#priceInput').val('')
    imageUploaded = null
    var progressDom = $('#web-worker-progress')
    progressDom.css('display' , 'none')
    progressDom.find('.progress-bar').css({ 'width': '0%'})
    clearImageUploader();
}

function initModalBurnTransfer(){
    var countTk = $('#countToken').text();
    $('.countNumberToken').text(countTk);
}


function burn(){
    $("#burnModal").modal('toggle');
    var addr = getCookie('addr');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
        var tokenForBurn = $('#burnInputModal').val();
        var existToken = $('#countToken').text();
        if(parseInt(tokenForBurn) > parseInt(existToken) || parseInt(tokenForBurn) == 0){
            myAlert('warning' , 'Burn' , 'The number of requested tokens is not allowed ');
        } else {

            if (validateForm('integer',tokenForBurn) != false ){
                var tokens = $('#tokensContainer').text();

                var statusWallectConnect = getCookie('walletconnectSelected');

                $('#burnToken').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Burning ')

                if (getAppUrl() == 'app'){

                    $.post(getBaseUrl() + "burn/", { addr: addr, tokens: tokens, count: tokenForBurn},
                    async function(returnedData){

                        if(statusWallectConnect == 'true'){

                            myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                            const web3 = new Web3(provider);
                            await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){

                                callBackBurn(addr ,txHash, tokens, returnedData.count);
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
                                    myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                    callBackBurn(addr ,txHash, tokens, returnedData.count);
                                    })
                                .catch(function(error) {
                                    if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                        myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                        $('#burnToken').html('Burn')
                                    }else {
                                        myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                        $('#burnToken').html('Burn')
                                    }
                                } );
                            } else {
                                $('#burnToken').html('Burn')
                            }
                        }
                    }).fail(function(response) {
                        myAlert('danger' , 'Burn' , response.responseJSON.message);
                        $('#burnToken').html('Burn')
                    });

                } else {

                    $.post(getBaseUrl() + "burnMusic/", { addr: addr, tokens: tokens, count: tokenForBurn},
                    async function(returnedData){

                        if(statusWallectConnect == 'true'){

                            myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                            const web3 = new Web3(provider);
                            await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){

                                callBackBurn(addr ,txHash, tokens, returnedData.count);
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
                                    myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                    callBackBurn(addr ,txHash, tokens, returnedData.count);
                                    })
                                .catch(function(error) {
                                    if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                        myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                        $('#burnToken').html('Burn')
                                    }else {
                                        myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                        $('#burnToken').html('Burn')
                                    }
                                } );
                            } else {
                                $('#burnToken').html('Burn')
                            }
                        }
                    }).fail(function(response) {
                        myAlert('danger' , 'Burn' , response.responseJSON.message);
                        $('#burnToken').html('Burn')
                    });

                }
            } else {
                myAlert('danger' , 'Burn' , 'The number of tokens is invalid');
            }

        }
    }
    
}


// Transfer
function transfer(){
    var addr = getCookie('addr');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
        var inputAddress = $('#transferInputModal').val()
        var tokenForTransfer = $('#inputCountTransfer').val();
        var existToken = $('#countToken').text();

        if (validateForm('integer',tokenForTransfer) != false ){
            if(parseInt(tokenForTransfer) > parseInt(existToken) || parseInt(tokenForTransfer) == 0){
                myAlert('warning' , 'Transfer' , 'The number of requested tokens is not allowed ');
            } else {
                if(inputAddress != ''){
                    $('#transferToken').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Transferring')
                    $('#receiverAddress').modal('toggle');
                    $('#transferInputModal').val('')
                    var tokens = $('#tokensContainer').text();

                    var statusWallectConnect = getCookie('walletconnectSelected');

                    if (getAppUrl() == 'app'){
                        $.post(getBaseUrl() + "transfer/", { addr: addr, tokens: tokens, receiver: inputAddress, count: tokenForTransfer},
                        async function(returnedData){
                            if(statusWallectConnect == 'true'){

                                myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                const web3 = new Web3(provider);
                                await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){
                                    callBackTransfer(addr ,txHash, tokens, inputAddress, returnedData.count);
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
                                        myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                        callBackTransfer(addr ,txHash, tokens, inputAddress, returnedData.count);
                                        })
                                    .catch(function(error) {
                                        if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                            myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                            $('#transferToken').html('Transfer');
                                        }else {
                                            myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                            $('#transferToken').html('Transfer');
                                        }
                                    } );
                                } else {
                                    $('#transferInputModal').val('')
                                    $('#transferToken').html('Transfer');
                                }
                            }
                                
                
                        }).fail(function(response) {
                            $('#transferInputModal').val('')
                            myAlert('danger' , 'Transfer' , response.responseJSON.message);
                            $('#transferToken').html('Transfer');
                        });
                    } else {

                        $.post(getBaseUrl() + "transferMusic/", { addr: addr, tokens: tokens, receiver: inputAddress, count: tokenForTransfer},
                        async function(returnedData){
                            if(statusWallectConnect == 'true'){

                                myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                const web3 = new Web3(provider);
                                await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){
                                    callBackTransfer(addr ,txHash, tokens, inputAddress, returnedData.count);
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
                                        myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                                        callBackTransfer(addr ,txHash, tokens, inputAddress, returnedData.count);
                                        })
                                    .catch(function(error) {
                                        if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                            myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                            $('#transferToken').html('Transfer');
                                        }else {
                                            myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                            $('#transferToken').html('Transfer');
                                        }
                                    } );
                                } else {
                                    $('#transferInputModal').val('')
                                    $('#transferToken').html('Transfer');
                                }
                            }
                                
                
                        }).fail(function(response) {
                            $('#transferInputModal').val('')
                            myAlert('danger' , 'Transfer' , response.responseJSON.message);
                            $('#transferToken').html('Transfer');
                        });

                    }
    
                }else{
                    $('#transferInputModal').val('')
                    myAlert('danger' , 'Transfer' , "Invalid Address");
                }
            }
        } else {
            myAlert('warning' , 'Transfer' , 'The number of tokens is invalid');
        }

        
    }
}


var imageProfile = null

// Compress Image 
function compressImage (event, useWebWorker) {

    var file = event.target.files[0]            

    if(file.type != "image/gif"){
        var progressDom

        if (useWebWorker) {                
            progressDom = $('#web-worker-progress')
        }

        imageCompression.getExifOrientation(file).then(function (o) { })

        var options = {
            maxSizeMB: 5,
            maxWidthOrHeight: 1024,
            useWebWorker: useWebWorker,
            onProgress: onProgress
        }
        imageCompression(file, options)
            .then(function (output) {
                const downloadLink = URL.createObjectURL(output)
                
                $('#cover-file-upload-create').css({"background-image": "url(" + downloadLink + ")", "background-size": "100%"});
                $('#cover-file-upload-create').find('div').fadeOut(0)
                
                imageUploaded = file

            })
        
        function onProgress (p) {
            progressDom.css('display' , 'flex')
            progressDom.find('.progress-bar').css({ 'width': p + '%'})
        }
    }else{
        imageUploaded = file            
        $('#web-worker-progress').css('display' , 'flex')
        $('#web-worker-progress').find('.progress-bar').delay("fast").css({ 'width': '100%'})
        const downloadLink = URL.createObjectURL(file)
        $('#cover-file-upload-create').css({"background-image": "url(" + downloadLink + ")", "background-size": "100%"});
        $('#cover-file-upload-create').find('div').fadeOut(0)
    }

}

// Compress Image 
function compressProfile (event, useWebWorker) {
    var file = event.target.files[0]            

    if(file.type != "image/gif"){
        imageCompression.getExifOrientation(file).then(function (o) { })

        var options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 500,
            useWebWorker: useWebWorker,
        }
        imageCompression(file, options)
            .then(function (output) {
                const downloadLink = URL.createObjectURL(output)
                
                $('#cover-file-upload-profile').css({"background-image": "url(" + downloadLink + ")", "background-size": "100%"});
                $('#cover-file-upload-profile').find('div').fadeOut(0)
                // return uploadToServer(output)
                imageProfile = output
            })
        
        function onProgress (p) {                                
        }
    }else{
        imageProfile = file                            
        const downloadLink = URL.createObjectURL(file)
        $('#cover-file-upload-profile').css({"background-image": "url(" + downloadLink + ")", "background-size": "100%"});
        $('#cover-file-upload-profile').find('div').fadeOut(0)
    }

}


function updateProfile(){
    $('#updateProfileButton').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading')
    var name = $('#nameProfile').val()
    var email = $('#emailProfile').val()
    var facebook = $('#facebookProfile').val()
    var twitter = $('#twitterProfile').val()
    var instagram = $('#instagramProfile').val()
    var telegram = $('#telegramProfile').val()
    var website = $('#websiteProfile').val()
    var bio = $('#bioProfile').val()

    var addr = getCookie('addr');

    const formData = new FormData()
    if(imageProfile != null){
        formData.append('img', true);
        formData.append('image', imageProfile, imageProfile.name);
    } else {
        formData.append('img', false);
        formData.append('image', null);
    }
    formData.append('address', addr)
    formData.append('name' , name)
    formData.append('email' , email)
    formData.append('facebook' , facebook)
    formData.append('instagram' , instagram)
    formData.append('twitter' , twitter)
    formData.append('telegram' , telegram)
    formData.append('website' , website)
    formData.append('bio' , bio)

    return fetch('/updateprofile/', {
        method: 'POST',
        body: formData
    })
    .then(res => {
        $('#updateProfileButton').html('Done');
        getProfileData(addr);
    })
    .catch(error => {
        $('#updateProfileButton').html('Unsuccessful')
    })
    
}

// Get Data
function getProfileData(account){
    $.post(getBaseUrl() + "getprofile/", { address: account },
        function(returnedData){
            if (returnedData.data.name == null || returnedData.data.name == ""){
                nameProfileConnect.innerHTML = "BlackMarket User";
            } else {
                nameProfileConnect.innerHTML = returnedData.data.name;
            }
            if (returnedData.data.email == null || returnedData.data.email == ""){
                mailProfileConnect.innerHTML = "No Email";
            } else {
                mailProfileConnect.innerHTML = returnedData.data.email;
            }
            if (returnedData.data.image == null || returnedData.data.image == ""){
                $('#modalImageProfile').attr("src","/static/images/Icons/all/profile.svg");
            } else {
                $('#modalImageProfile').attr("src","https://ipfs.nftblackmarket.io/ipfs/" + returnedData.data.image);
            }
            $('#nameProfile').val(returnedData.data.name);
            $('#emailProfile').val(returnedData.data.email);
            $('#facebookProfile').val(returnedData.data.facebook);
            $('#instagramProfile').val(returnedData.data.instagram);
            $('#telegramProfile').val(returnedData.data.telegram);
            $('#twitterProfile').val(returnedData.data.twitter);
            $('#websiteProfile').val(returnedData.data.website);
            $('#bioProfile').val(returnedData.data.bio);

            if (returnedData.data.verify == false ){
                $(".specialModalVerify").show()
            } else {
                $(".specialModalVerify").hide()
            }

        });     
}


function removeProfile(){
    $('#removeProfileButton').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Removing')
    var addr = getCookie('addr');
    $.post(getBaseUrl() + "removeprofileimage/", { address: addr },
    function(returnedData){
        $('#cover-file-upload-profile').css({"background": "#1D1D22"});
        $('#cover-file-upload-profile').find('div').fadeIn(0);
        $('#file-upload-profile').val(null);
        $('#removeProfileButton').html('Removed');
        getProfileData(addr);
    });
}

function shareOnMdia(social){           

    var url = document.location;
    var title = $('#share-social').attr('data-title')
    var summary = $('#share-social').attr('data-summary')
    var media = $('#share-social').attr('data-media')

    if(social == 'twitter'){
        window.open('https://twitter.com/intent/tweet?text=' + title + '%0A' + '%0A' + url + '%0A' + '%0A' + "&hashtags=NFTBlackMarket,NBM,NFT");
    }else if(social == 'telegram'){                
        window.open('tg://msg_url?text='+ title + "  " + summary + '&url=' + url);                
    }
    else if(social == 'whatsapp'){                
        window.open('https://wa.me/?text=' + url);                
    }
    else if(social == 'reddit'){                
        window.open('https://reddit.com/submit?url=' + url + '&title=' + title + '&text=' + summary);
    }else if(social == 'pinterest'){
        window.open('https://pinterest.com/pin/create/bookmarklet/?media=' + media + '&url' + url + '&description=' + title );
    }

}

// Copy To Clipboard
function copyToClipboard(){
    value = document.location;
    var $temp = $("<input>");
    $(".sidebar .profile-box #share-social ul").append($temp);
    $temp.val(value).select();
    document.execCommand("copy");
    $temp.remove();        
    myAlert('info' , 'Your Address has been copied' , '')
}

function shareToken(){
    var title = $("#title").text();
    var description = $("#description").text();
    var tokenImage = $("#tokenImage").attr('src');

    // Share Buttons
    $('#share-social').attr('data-title' , title);
    $('#share-social').attr('data-summary' , description);
    $('#share-social').attr('data-media' , tokenImage);
}


function changeStatus(){
    var status = $('.anything').find('input[name=typeToken]:checked').val();
    var tokens = $('#tokensContainer').text();
    var owner = getCookie('addr');
    var statusWallectConnect = getCookie('walletconnectSelected');

    $('#btnChangeStatus').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Changing ')

    if (getAppUrl() == 'app'){
        $.post(getBaseUrl() + "changestatus/", { address: owner, tokens: tokens , status: status},
            async function(data){
                if(statusWallectConnect == 'true'){
                    myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                    const web3 = new Web3(provider);
                    await web3.eth.sendTransaction(data.approve).on('transactionHash', function(txHash){
                        callBackChangeStatus(owner, txHash, data.tokens, data.status);
                    });
                    
                } else {
                    if(typeof data.message === "undefined"){
                        ethereum.request({
                            method: 'eth_sendTransaction',
                            params: [
                                data.approve,
                            ],
                        })
                        .then(function(txHash) {
                            myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                            callBackChangeStatus(owner, txHash, data.tokens, data.status);
                            })
                        .catch(function(error) {
                            if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                $('#btnChangeStatus').html('Change Status')
                            }else {
                                myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                $('#btnChangeStatus').html('Change Status')
                            }
                        } );
                    };
                }

        }).fail(function(response) {
            myAlert('danger' , 'Change Status' , response.responseJSON.message);
            $('#btnChangeStatus').html('Change Status')
        });
    } else {

        $.post(getBaseUrl() + "changestatusMusic/", { address: owner, tokens: tokens , status: status},
            async function(data){
                if(statusWallectConnect == 'true'){
                    myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                    const web3 = new Web3(provider);
                    await web3.eth.sendTransaction(data.approve).on('transactionHash', function(txHash){
                        callBackChangeStatus(owner, txHash, data.tokens, data.status);
                    });
                    
                } else {
                    if(typeof data.message === "undefined"){
                        ethereum.request({
                            method: 'eth_sendTransaction',
                            params: [
                                data.approve,
                            ],
                        })
                        .then(function(txHash) {
                            myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                            callBackChangeStatus(owner, txHash, data.tokens, data.status);
                            })
                        .catch(function(error) {
                            if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                $('#btnChangeStatus').html('Change Status')
                            }else {
                                myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                $('#btnChangeStatus').html('Change Status')
                            }
                        } );
                    };
                }

        }).fail(function(response) {
            myAlert('danger' , 'Change Status' , response.responseJSON.message);
            $('#btnChangeStatus').html('Change Status')
        });
    }
     
}


function callBackChangeStatus(owner, transactionhash, tokens, status){
    if (getAppUrl() == 'app'){
        $.post(getBaseUrl() + "callbackchangestatus/", { address: owner, trx: transactionhash , tokens: tokens, status: status},
                function(data){
                    myAlert('success' , 'Change Status' , 'Your token status changed successfully');
                    $('#btnChangeStatus').html('Change Status')
                    setInterval(function()
                    {
                        location.reload();
                    }, 3000);//time in milliseconds 
            }).fail(function(response) {
                myAlert('danger' , 'Change Status' , response.responseJSON.message);
                $('#btnChangeStatus').html('Change Status')
            });
    } else {
        $.post(getBaseUrl() + "callbackchangemusicstatus/", { address: owner, trx: transactionhash , tokens: tokens, status: status},
                function(data){
                    myAlert('success' , 'Change Status' , 'Your token status changed successfully');
                    $('#btnChangeStatus').html('Change Status')
                    setInterval(function()
                    {
                        location.reload();
                    }, 3000);//time in milliseconds 
            }).fail(function(response) {
                myAlert('danger' , 'Change Status' , response.responseJSON.message);
                $('#btnChangeStatus').html('Change Status')
            });

    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }


function confirmPolicy(){
    var addr = getCookie('addr');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
        var statusWallectConnect = getCookie('walletconnectSelected');

        $('#confirmPolicy').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Confirming ');

        $.post(getBaseUrl() + "confirmpolicy/", { address: addr },
        async function(returnedData){
            if(statusWallectConnect == 'true'){
                myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                    const web3 = new Web3(provider);
                    await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', async function(txHash){
                        await sleep(10000);
                        $('#confirmPolicy').html('Confirmed');
                    });
             } 
            else {
                if(typeof returnedData.message === "undefined"){
                    ethereum.request({
                        method: 'eth_sendTransaction',
                        params: [
                            returnedData.trx,
                        ],
                    })
                    .then(async function(txHash) {
                        await sleep(10000);
                        $('#confirmPolicy').html('Confirmed');
                        })
                    .catch(function(error) {
                        if (error.message == "Invalid parameters: must provide an Ethereum address."){
                            myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                            $('#confirmPolicy').html('Confirm')
                        }else {
                            myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                            $('#confirmPolicy').html('Confirm')
                        }
                    } );
                } else {
                    $('#confirmPolicy').html('Confirm')
                    myAlert('info' , 'Policy' , returnedData.message);
                }
            }

        }).fail(function(response) {
            $('#confirmPolicy').html('Confirm')
            myAlert('danger' , 'Policy' , response.responseJSON.message);
        });

    } 
}


function getCategoryData(){
    $.post(getBaseUrl() + "getAllCategories/", { },
        function(returnedData){
            var currentCategory = $('#categoryMarketPLace').text()                    
            
            data = returnedData.data
            $.each( data, function( key, value ) {
                var card = '<option value="'+ data[key].Slug+'" '+(data[key].Slug == currentCategory ? 'selected' : '')+' >'+ data[key].Title +'</option>'
                $('#categorySelectOption').append(card)
            }); 
        });

}

function getMusicCategoryData(){
    $.post(getBaseUrl() + "getAllMusicCategories/", { },
        function(returnedData){
            var currentCategory = $('#categoryMarketPLace').text()
            data = returnedData.data
            $.each( data, function( key, value ) {
                var card = '<option value="'+ data[key].Slug+'" '+(data[key].Slug == currentCategory ? 'selected' : '')+' >'+ data[key].Title +'</option>'
                $('#categorySelectOption').append(card)
            }); 
        });

}


function changeCategory(){
            
    var category = $('#categorySelectOption').find(':selected').val()

    var addr = getCookie('addr');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
        var tokens = $('#tokensContainer').text();

        $('#changeCategoryButton').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Changing ')

        if (getAppUrl() == 'app'){
            $.post(getBaseUrl() + "updateCategories/", {address:addr , category:category , tokens:tokens},
                function(returnedData){
                    $('#categoryMarketPLace').html(category)
                    $('#changeCategoryButton').html('Changed')
                }).fail(function(response) {
                    $('#changeCategoryButton').html('Submit')
                    myAlert('danger' , 'Update Category' , response.responseJSON.message);
                });
        } else {
            $.post(getBaseUrl() + "updateMusicCategories/", {address:addr , category:category , tokens:tokens},
                function(returnedData){
                    $('#categoryMarketPLace').html(category)
                    $('#changeCategoryButton').html('Changed')
                }).fail(function(response) {
                    $('#changeCategoryButton').html('Submit')
                    myAlert('danger' , 'Update Category' , response.responseJSON.message);
                });
        }

        
    }
}


 // Change Price
 function changePrice(){

    var inputPrice = $('#changePriceInput').val();

    var addr = getCookie('addr');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
        if (validateForm('float',inputPrice) == true){
            var tokens = $('#tokensContainer').text();

            var statusWallectConnect = getCookie('walletconnectSelected');

            $('#changePriceButton').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Changing ')

            if (getAppUrl() == 'app'){
                $.post(getBaseUrl() + "updatePrice/", {address:addr , price: inputPrice , tokens:tokens},
                async function(returnedData){
                    if(statusWallectConnect == 'true'){ 
                        myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                        const web3 = new Web3(provider);
                        await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){
                            $('#changePriceButton').html('Changed')
                            $('.priceMarketPlace').html(inputPrice)
                            setInterval(function()
                            {
                                location.reload();
                            }, 10000);//time in milliseconds
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
                                    $('#changePriceButton').html('Changed')
                                    $('.priceMarketPlace').html(inputPrice)
                                    setInterval(function()
                                    {
                                        location.reload();
                                    }, 10000);//time in milliseconds
                                })
                            .catch(function(error) {
                                if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                    myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                    $('#changePriceButton').html('Submit')
                                }else {
                                    myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                    $('#changePriceButton').html('Submit')
                                }
                            } );
                        } else {
                            $('#changePriceButton').html('Submit')
                        }
                }

                }).fail(function(response) {
                    $('#changeCategoryButton').html('Submit')
                    myAlert('danger' , 'Update Price' , response.responseJSON.message);
                });
            } else {
                $.post(getBaseUrl() + "updateMusicPrice/", {address:addr , price: inputPrice , tokens:tokens},
                async function(returnedData){
                    if(statusWallectConnect == 'true'){ 
                        myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                        const web3 = new Web3(provider);
                        await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){
                            $('#changePriceButton').html('Changed')
                            $('.priceMarketPlace').html(inputPrice)
                            setInterval(function()
                            {
                                location.reload();
                            }, 10000);//time in milliseconds
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
                                    $('#changePriceButton').html('Changed')
                                    $('.priceMarketPlace').html(inputPrice)
                                    setInterval(function()
                                    {
                                        location.reload();
                                    }, 10000);//time in milliseconds
                                })
                            .catch(function(error) {
                                if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                    myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                    $('#changePriceButton').html('Submit')
                                }else {
                                    myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                    $('#changePriceButton').html('Submit')
                                }
                            } );
                        } else {
                            $('#changePriceButton').html('Submit')
                        }
                }

                }).fail(function(response) {
                    $('#changeCategoryButton').html('Submit')
                    myAlert('danger' , 'Update Price' , response.responseJSON.message);
                });
            }

            
        }
        else {
            myAlert('danger' , 'Update Price' , "Invalid Price");
        }  
    }   
}


// Add to Market PLace
function addToMarketPlace(){
    
    var addr = getCookie('addr');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
        var tokens = $('#tokensContainer').text();

        var statusWallectConnect = getCookie('walletconnectSelected');

        $('#addToMarketPlaceButton').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Adding to Marketplace ')

        if (getAppUrl() == 'app'){
            $.post(getBaseUrl() + "updateListingToken/", {address:addr , status: 1 , tokens:tokens},
            async function(returnedData){

                if(statusWallectConnect == 'true'){ 
                    myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                    const web3 = new Web3(provider);
                    await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){
                        $('#addToMarketPlaceButton').html('Added to Marketplace');
                        setInterval(function()
                        {
                            location.reload();
                        }, 10000);
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
                                $('#addToMarketPlaceButton').html('Added to Marketplace');
                                setInterval(function()
                                {
                                    location.reload();
                                }, 10000);
                            })
                        .catch(function(error) {
                            if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                $('#addToMarketPlaceButton').html('Add to Marketplace')
                            }else {
                                myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                $('#addToMarketPlaceButton').html('Add to Marketplace')
                            }
                        } );
                    } else {
                        $('#addToMarketPlaceButton').html('Add to Marketplace')
                    }
                }

            }).fail(function(response) {
                $('#addToMarketPlaceButton').html('Add to Marketplace')
                myAlert('danger' , 'Marketplace Management' , response.responseJSON.message);
            });
        } else {
            $.post(getBaseUrl() + "updateListingMusicToken/", {address:addr , status: 1 , tokens:tokens},
            async function(returnedData){

                if(statusWallectConnect == 'true'){ 
                    myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                    const web3 = new Web3(provider);
                    await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){
                        $('#addToMarketPlaceButton').html('Added to Marketplace');
                        setInterval(function()
                        {
                            location.reload();
                        }, 10000);
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
                                $('#addToMarketPlaceButton').html('Added to Marketplace');
                                setInterval(function()
                                {
                                    location.reload();
                                }, 10000);
                            })
                        .catch(function(error) {
                            if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                $('#addToMarketPlaceButton').html('Add to Marketplace')
                            }else {
                                myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                $('#addToMarketPlaceButton').html('Add to Marketplace')
                            }
                        } );
                    } else {
                        $('#addToMarketPlaceButton').html('Add to Marketplace')
                    }
                }

            }).fail(function(response) {
                $('#addToMarketPlaceButton').html('Add to Marketplace')
                myAlert('danger' , 'Marketplace Management' , response.responseJSON.message);
            });
        }

        
    }
}


// Remove From Market Place 
function removeFromMarketPlace(){
    var addr = getCookie('addr');
    if (addr == ""){
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {
        var tokens = $('#tokensContainer').text();
        $('#removeFromMarketPlaceButton').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Removing to Marketplace ')

        var statusWallectConnect = getCookie('walletconnectSelected');

        if (getAppUrl() == 'app'){
            $.post(getBaseUrl() + "updateListingToken/", {address:addr , status: 0 , tokens:tokens},
            async function(returnedData){
                if(statusWallectConnect == 'true'){ 
                    myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                    const web3 = new Web3(provider);
                    await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){
                        $('#removeFromMarketPlaceButton').html('Removed from Marketplace');
                        setInterval(function()
                        {
                            location.reload();
                        }, 10000);
                    });
                }
                else {
                    if(typeof returnedData.message === "undefined"){
                        ethereum.request({
                            method: 'eth_sendTransaction',
                            params: [
                                returnedData.approve,
                            ],
                        })
                        .then(function(txHash) {
                                $('#removeFromMarketPlaceButton').html('Removed from Marketplace');
                                setInterval(function()
                                {
                                    location.reload();
                                }, 10000);
                            })
                        .catch(function(error) {
                            if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                $('#removeFromMarketPlaceButton').html('Remove from Marketplace')
                            }else {
                                myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                $('#removeFromMarketPlaceButton').html('Remove from Marketplace')
                            }
                        } );
                    } else {
                        $('#removeFromMarketPlaceButton').html('Remove from Marketplace')
                    }
                }

            }).fail(function(response) {
                $('#removeFromMarketPlaceButton').html('Remove from Marketplace')
                myAlert('danger' , 'Marketplace Management' , response.responseJSON.message);
            });
        } else {
            $.post(getBaseUrl() + "updateListingMusicToken/", {address:addr , status: 0 , tokens:tokens},
            async function(returnedData){
                if(statusWallectConnect == 'true'){ 
                    myAlert('info' , 'Transaction' , 'Transaction Confirming...');
                    const web3 = new Web3(provider);
                    await web3.eth.sendTransaction(returnedData.approve).on('transactionHash', function(txHash){
                        $('#removeFromMarketPlaceButton').html('Removed from Marketplace');
                        setInterval(function()
                        {
                            location.reload();
                        }, 10000);
                    });
                }
                else {
                    if(typeof returnedData.message === "undefined"){
                        ethereum.request({
                            method: 'eth_sendTransaction',
                            params: [
                                returnedData.approve,
                            ],
                        })
                        .then(function(txHash) {
                                $('#removeFromMarketPlaceButton').html('Removed from Marketplace');
                                setInterval(function()
                                {
                                    location.reload();
                                }, 10000);
                            })
                        .catch(function(error) {
                            if (error.message == "Invalid parameters: must provide an Ethereum address."){
                                myAlert('danger' , 'Ops!' , "Please connect your wallet.")
                                $('#removeFromMarketPlaceButton').html('Remove from Marketplace')
                            }else {
                                myAlert('danger' , 'Ops!' , error.message.replace("MetaMask Tx Signature: ",""))
                                $('#removeFromMarketPlaceButton').html('Remove from Marketplace')
                            }
                        } );
                    } else {
                        $('#removeFromMarketPlaceButton').html('Remove from Marketplace')
                    }
                }

            }).fail(function(response) {
                $('#removeFromMarketPlaceButton').html('Remove from Marketplace')
                myAlert('danger' , 'Marketplace Management' , response.responseJSON.message);
            });

        }

    }
}


// Walletconnect Functions
async function fetchAccountData() {

    const web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();
  
    const rowResolvers = accounts.map(async (address) => {
        $("#modalConnect").hide();
        $("#modalConnected").show();
        account = address
        showAccount.innerHTML = account;
        $("#walletInputVerification").val(account);
        $("#reporterinputSubmit").val(account);
        connectButton.innerHTML = account.substring(0, 4) + "..." + account.slice(-4);
        connectButton2.innerHTML = account.substring(0, 4) + "..." + account.slice(-4);
        $("#viewOnBscLink").attr("href", "https://bscscan.com/address/" + account);
        $("#showProfile").attr("href", "/profile/" + account);

        // Save account to Cookie
        setCookie('addr', account, 2);
        getRequestList();

        $.post(getBaseUrl() + "balance/", { address: account },
            function(returnedData){
                balanceBNB.innerHTML = "<span>Balance BNB : </span>" + returnedData.bnb;
                balanceNBM.innerHTML = "<span>Balance NBM : </span>" + returnedData.nbm;
                setCookie('minter',returnedData.minter, 2);
                setCookie('minterMusic',returnedData.minterMusic, 2);
                if (getAppUrl() == 'app'){
                    var statusMinter = getCookie('minter');
                    if (statusMinter == 'true'){
                        $('#actionApprove').fadeOut(0)
                        $('#actionMint').fadeIn(0)
                    } else {
                        $('#actionApprove').fadeIn(0)
                        $('#actionMint').fadeOut(0)
                    }
                }
                
                if (getAppUrl() == 'app-music'){
                    var statusminterMusic = getCookie('minterMusic');
                    if (statusminterMusic == 'true'){
                        $('#actionApprove').fadeOut(0)
                        $('#actionMint').fadeIn(0)
                    } else {
                        $('#actionApprove').fadeIn(0)
                        $('#actionMint').fadeOut(0)
                    }
                }
        });

        getProfileData(account);

        if (window.location.pathname == "/app/"){
            getDataNFTList();
        }

        if (window.location.pathname == "/app-music/"){
            getDataNFTMusicList();
        }

        if (window.location.pathname == "/myassets/"){
            getAssetsArt();   
            getAssetsMusic();
        }
        
        var owener = $("#oweneraddress").text();
        var addr = getCookie('addr');
        if (owener.toString().toUpperCase() == addr.toString().toUpperCase()){
            $("#status_option").show();
            $("#token_option").show();
            $("#market_place_management").show();
            
            if (getAppUrl() == 'app'){
                getCategoryData();
            } else {
                getMusicCategoryData();
            }
        } else {
            $("#status_option").hide();
            $("#token_option").hide();
            $("#market_place_management").hide();
        }

        setCookie('walletconnectSelected', true, 2);

    });
  
    await Promise.all(rowResolvers);

}

async function refreshAccountData() {
    await fetchAccountData(provider);
}


async function onConnect() {

    $("#connectWallet").modal('toggle');

    try {
        provider = await web3Modal.connect();
    } catch(e) {
        return;
    }
  
    provider.on("accountsChanged", (accounts) => {
        fetchAccountData();
    });
  
    provider.on("chainChanged", (chainId) => {
        fetchAccountData();
    });
  
    provider.on("networkChanged", (networkId) => {
        fetchAccountData();
    });
  
    await refreshAccountData();
}

async function onDisconnect() {

    if(provider.close) {
      await provider.close();
  
      await web3Modal.clearCachedProvider();
      provider = null;
    }
    setCookie('walletconnectSelected', false, 2);


    setCookie('addr', "", 1);
    setCookie('minter', false, 1);
    setCookie('minterMusic', false, 1);
    connectButton.innerHTML = "Connect";
    connectButton2.innerHTML = "Connect";
    $("#modalConnect").show();
    $("#modalConnected").hide();
    $("#status_option").hide();
    $("#token_option").hide();
    $("#market_place_management").hide();
}


$('.owl-carousel-network').owlCarousel({
    loop:true,
    autoplay:true,
    autoplayTimeout:3000,
    margin:10,
    dots:true,
    nav:false,
    responsive:{
        0:{
            items:1
        },
        550:{
            items:1
        }, 
        750:{
            items:3
        },                
        1000:{
            items:4
        },
        1250:{
            items:6
        }
    }
})

function findLikeinText(text){

    var mainText = text.replace("\n", " <br />");        
    var $words = mainText.split(' ');

    for (i in $words) {            
        if ($words[i].indexOf('https://') == 0) {                
            var finalText = $words[i].split(' ')
            $words[i] = '<a href="' + finalText + '">' + finalText + '</a>';
        }
        if($words[i].indexOf('http://') == 0){                    
            var finalText = $words[i].split(' ')
            $words[i] = '<a href="' + finalText + '">' + finalText + '</a>';
        }
    }                        
    
    return $words.join(' ')
    
}

function changeTexttoLinksTrade(){
    var description = $("#description").text()
    description = findLikeinText(description)
    $("#description").html(description)
}

$('button.copyButton').click(function(){
    $(this).siblings('input.linkToCopy').select();      
    document.execCommand("copy");
});


if (getAppUrl() == 'app-music' || getAppUrl() == 'market-music'){

    url = window.location.href
    var result = url.split('/')
    if(result[4] == "nft" || result[4] == "trade"){
    
        // Music Player
        var playerTrack = $("#player-track"),
        appCover = $('#app-cover'),
        bgArtwork = $('#bg-artwork'),
        bgArtworkUrl, albumName = $('#album-name'),
        trackName = $('#track-name'),
        albumArt = $('#album-art'),
        sArea = $('#s-area'),
        seekBar = $('#seek-bar'),
        trackTime = $('#track-time'),
        insTime = $('#ins-time'),
        sHover = $('#s-hover'),
        playPauseButton = $("#play-pause-button"),
        playInBox = $("#play-box"),
        muteButton = $('#mute-music-button'),
        repeatButton = $('#repeat-music-button'),
        minimuzeButton = $('#minimize-music-player-button'),
        maximizeButton = $('#maximize'),
        i = playPauseButton.find('i'),
        m = muteButton.find('i'),
        tProgress = $('#current-time'),
        tTime = $('#track-length'),
        seekT, seekLoc, seekBarPos, cM, ctMinutes, ctSeconds, curMinutes, curSeconds, durMinutes, durSeconds, playProgress, bTime, nTime = 0,
        buffInterval = null, tFlag = false,


        albums = albumArt.data('musicname')
        trackNames = albumArt.data('ownername')
        albumArtworks = ["_1"]
        trackUrl = albumArt.data('trackurls')
        imagesCovers = albumArt.data('imagescovers')  

        currIndex = -1;
        

        function playPause()
        {
            if(trackNames.length > 0){
                setTimeout(function()
                {
                    if(audio.paused)
                    {
                        playerTrack.addClass('active');
                        albumArt.addClass('active');
                        appCover.addClass('active');
                        checkBuffering();
                        $('#play-pause-button').html('<i class="fas fa-pause"></i>')                                    
                        audio.play();
                    }
                    else
                    {
                        playerTrack.removeClass('active');
                        albumArt.removeClass('active');
                        appCover.removeClass('active');
                        clearInterval(buffInterval);
                        albumArt.removeClass('buffering');
                        $('#play-pause-button').html('<i class="fas fa-play"></i>')                                    
                        audio.pause();
                    }
                },300);
            }
        }

        function muteMusic()
        {
            setTimeout(function()
            {
                if(audio.muted)
                {                                                                 
                    $('#mute-music-button').html('<i class="fas fa-volume-up"></i>')                                    
                    audio.muted = false;
                }
                else
                {                                        
                    $('#mute-music-button').html('<i class="fas fa-volume-off"></i>')                                                                    
                    audio.muted = true;
                }
            },300);
        }

        function repeatMusic(){                        
            audio.currentTime = 0;
        }

        function showHover(event)
        {
            seekBarPos = sArea.offset(); 
            seekT = event.clientX - seekBarPos.left;
            seekLoc = audio.duration * (seekT / sArea.outerWidth());
            
            sHover.width(seekT);
            
            cM = seekLoc / 60;
            
            ctMinutes = Math.floor(cM);
            ctSeconds = Math.floor(seekLoc - ctMinutes * 60);
            
            if( (ctMinutes < 0) || (ctSeconds < 0) )
                return;
            
            if( (ctMinutes < 0) || (ctSeconds < 0) )
                return;
            
            if(ctMinutes < 10)
                ctMinutes = '0'+ctMinutes;
            if(ctSeconds < 10)
                ctSeconds = '0'+ctSeconds;
            
            if( isNaN(ctMinutes) || isNaN(ctSeconds) )
                insTime.text('--:--');
            else
                insTime.text(ctMinutes+':'+ctSeconds);
                
            insTime.css({'left':seekT,'margin-left':'-21px'}).fadeIn(0);
            
        }

        function hideHover()
        {
            sHover.width(0);
            insTime.text('00:00').css({'left':'0px','margin-left':'0px'}).fadeOut(0);		
        }

        function playFromClickedPos()
        {
            audio.currentTime = seekLoc;
            seekBar.width(seekT);
            hideHover();
        }

        function updateCurrTime()
        {
            nTime = new Date();
            nTime = nTime.getTime();

            if( !tFlag )
            {
                tFlag = true;
                trackTime.addClass('active');
            }

            curMinutes = Math.floor(audio.currentTime / 60);
            curSeconds = Math.floor(audio.currentTime - curMinutes * 60);
            
            durMinutes = Math.floor(audio.duration / 60);
            durSeconds = Math.floor(audio.duration - durMinutes * 60);
            
            playProgress = (audio.currentTime / audio.duration) * 100;
            
            if(curMinutes < 10)
                curMinutes = '0'+curMinutes;
            if(curSeconds < 10)
                curSeconds = '0'+curSeconds;
            
            if(durMinutes < 10)
                durMinutes = '0'+durMinutes;
            if(durSeconds < 10)
                durSeconds = '0'+durSeconds;
            
            if( isNaN(curMinutes) || isNaN(curSeconds) )
                tProgress.text('00:00');
            else
                tProgress.text(curMinutes+':'+curSeconds);
            
            if( isNaN(durMinutes) || isNaN(durSeconds) )
                tTime.text('00:00');
            else
                tTime.text(durMinutes+':'+durSeconds);
            
            if( isNaN(curMinutes) || isNaN(curSeconds) || isNaN(durMinutes) || isNaN(durSeconds) )
                trackTime.removeClass('active');
            else
                trackTime.addClass('active');

            
            seekBar.width(playProgress+'%');
            
            if( playProgress == 100 )
            {
                i.attr('class','fa fa-play');
                seekBar.width(0);
                tProgress.text('00:00');
                albumArt.removeClass('buffering').removeClass('active');
                clearInterval(buffInterval);
            }
        }

        function checkBuffering()
        {
            clearInterval(buffInterval);
            buffInterval = setInterval(function()
            { 
                if( (nTime == 0) || (bTime - nTime) > 1000  )
                    albumArt.addClass('buffering');
                else
                    albumArt.removeClass('buffering');

                bTime = new Date();
                bTime = bTime.getTime();

            },100);
        }

        function selectTrack(flag)
        {
            if( flag == 0 || flag == 1 )
                ++currIndex;
            else
                --currIndex;

            if( (currIndex > -1) && (currIndex < albumArtworks.length) )
            {
                if( flag == 0 )
                    i.attr('class','fa fa-play');
                else
                {
                    albumArt.removeClass('buffering');
                    i.attr('class','fa fa-pause');
                }

                seekBar.width(0);
                trackTime.removeClass('active');
                tProgress.text('00:00');
                tTime.text('00:00');

                currAlbum = albums[currIndex];        
                currTrackName = trackNames[currIndex];
                currArtwork = albumArtworks[currIndex];
                currImagesCover = imagesCovers[currIndex];

                audio.src = trackUrl[currIndex];
                
                nTime = 0;
                bTime = new Date();
                bTime = bTime.getTime();

                if(flag != 0)
                {
                    audio.play();
                    playerTrack.addClass('active');
                    albumArt.addClass('active');
                
                    clearInterval(buffInterval);
                    checkBuffering();
                }

                albumName.text(currAlbum);
                trackName.text(currTrackName);

                var test = albumArt.find('img.active');
                test.attr('src' , currImagesCover)

            }
            else
            {
                if( flag == 0 || flag == 1 )
                    --currIndex;
                else
                    ++currIndex;
            }
        }

        function playMusicInList(trakNames , trakAlbums , albumId , trakUrls , index , imageCover){
            albums = trakAlbums
            trackNames = trakNames
            albumArtworks = albumId
            trackUrl = trakUrls
            currIndex = index - 2
            imagesCovers = imageCover
            selectTrack(0)
            playPause()
                                                            
        }

        function showAndHidePlayer(){
            if(maximizeButton.hasClass('active')){
                maximizeButton.removeClass('active')
                maximizeButton.fadeIn(300)
                $('#app-cover').fadeOut()
            }else{
                maximizeButton.addClass('active')
                maximizeButton.fadeOut(300)
                $('#app-cover').fadeIn()
            }
        }

        function initPlayer()
        {	
            
            audio = new Audio();

            selectTrack(0);
            
            audio.loop = false;
            
            playPauseButton.on('click',playPause);
            muteButton.on('click' , muteMusic);
            repeatButton.on('click' , repeatMusic);

            minimuzeButton.on('click' , showAndHidePlayer)
            maximizeButton.on('click' , showAndHidePlayer)

            sArea.mousemove(function(event){ showHover(event); });
            
            sArea.mouseout(hideHover);
            
            sArea.on('click',playFromClickedPos);
            
            $(audio).on('timeupdate',updateCurrTime);

        }

        $('body').keyup(function(e){    
            if (!$("input").is(":focus") && !$("textarea").is(":focus")) {        
                if(e.keyCode == 32){
                    // 32 ==> pressed space
                    playPause()
                }
                if(e.keyCode == 39){
                    // 32 ==> pressed space
                    selectTrack(1)
                }
                if(e.keyCode == 37){
                    // 32 ==> pressed space
                    selectTrack(-1)
                }
            }
        });

        window.addEventListener('keydown', function(e) {
            if(e.keyCode == 32 && e.target == document.body) {
                e.preventDefault();
            }
        });    
                            
        initPlayer();
    }
}  


function getAppUrl(){
	url = window.location.href
    var result = url.split('/')
    if(result[3] == "app-music"){
        return "app-music"
    }else if (result[3] == "market-music"){
        return "market-music"
    }else{
        return "app"
    }
}

function closeUrlWarning(){
    $('#url-warning-code').fadeOut()
    var now = new Date();
    var time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);
    document.cookie = 'urlcarefully=' + true + '; expires=' + now.toUTCString() + '; path=/';            
}

function autoCheckUrlCarefully(){
    var status = getCookie('urlcarefully');            
        if(!status){                                
            $('#url-warning-code').css('height' , 'auto')
            $(window).scrollTop(0);              
        }
}

function changeStyleTheme(darkmode){
    if(darkmode == true){
        $('head').delay("slow").append(darkMode)
        $('#lighetheme').remove()
        setCookie('theme' , 'dark' , 5) 

    }else{
        $('head').append(lightMode)
        $('#darktheme').remove()
        setCookie('theme' , 'light' , 5)   
    }
}


function getTopUsers(){


    $.post(getBaseUrl() + "topUsersNFTBlackMarket/", {  },
    function(returnedData){ 
        data = returnedData.topTraders
        // TOP TRADERS                    
         $.each( data, function( key, value ) {
            var card = '<a href="/profile/'+data[key].address+'"><div class="user-item"><div class="profile"><img src="'+data[key].image+'" alt=""></div><div class="info"><h5>'+data[key].fullname+'</h5><h6>Trade : <span>'+data[key].rank+'</span></h6><div class="badges">'+(data[key].isVerify == true ? '<span class="badge">Verified</span>' : '')+'</div></div><div class="medal '+ data[key].id+'"><i class="fas fa-medal"></i></div></div></a>';
            $('#top-user-trader').append(card)   
        });

        // TOP NFM                    
        data = returnedData.topNFM
        $.each( data, function( key, value ) {
            var card = '<a href="/profile/'+data[key].address+'"><div class="user-item"><div class="profile"><img src="'+data[key].image+'" alt=""></div><div class="info"><h5>'+data[key].fullname+'</h5><h6>Token : <span>'+data[key].rank+'</span></h6><div class="badges">'+(data[key].isVerify == true ? '<span class="badge">Verified</span>' : '')+'</div></div><div class="medal '+ data[key].id+'"><i class="fas fa-medal"></i></div></div></a>';
            $('#top-user-nfm').append(card)            
        });

        // TOP NFT
        data = returnedData.topNFT
        $.each( data, function( key, value ) {
            var card = '<a href="/profile/'+data[key].address+'"><div class="user-item"><div class="profile"><img src="'+data[key].image+'" alt=""></div><div class="info"><h5>'+data[key].fullname+'</h5><h6>Token : <span>'+data[key].rank+'</span></h6><div class="badges">'+(data[key].isVerify == true ? '<span class="badge">Verified</span>' : '')+'</div></div><div class="medal '+ data[key].id+'"><i class="fas fa-medal"></i></div></div></a>';
            $('#top-user-nft ').append(card)            

        });

    });   
                
}

function homeSliderData(){

    var addr = getCookie('addr');
    $.post(getBaseUrl() + "homeSliderData/", { address: addr },
    function(returnedData){   

        $('.slider-loading').fadeOut(10)

        data = returnedData.popArtItems
        $.each( data, function( key, value ) {
            var card = '<div class="item"><div class="card-item"><div class="card-img"><a href="/market/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><span class="type">'+ "ART" +'</span><div class="shortcut shortcut-image" data-img="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'"><i class="fas fa-expand"></i></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p> '+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +' BNB</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + ' buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+ data[key].countLike +'</span></div></div></div></div></div>'
            $('#popular-art').append(card)
        });
        
        data = returnedData.newArtItems
        $.each( data, function( key, value ) {
            var card = '<div class="item"><div class="card-item"><div class="card-img"><a href="/market/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><span class="type">'+ "ART" +'</span><div class="shortcut shortcut-image" data-img="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'"><i class="fas fa-expand"></i></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p> '+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +' BNB</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + ' buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+ data[key].countLike +'</span></div></div></div></div></div>'
            $('#new-art').append(card)
        });

        data = returnedData.popMusicItems
        $.each( data, function( key, value ) {
            var card = ' <div class="item"><div class="card-item"><div class="card-img"><a href="/market-music/trade/'+ data[key].groupID+'"><img src="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].image +'" alt=""></a><div class="playing"><div class="page-loading"><div class="loader"><div class="loading d-flex"><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div></div></div></div></div><span class="type">'+ "MUSIC" +'</span><div class="music-shortcut-button"><div class="shortcut shortcut-music music-'+ data[key].groupID +'" id="play" onclick="plauMusic('+ data[key].groupID +')" data-music="https://ipfs.nftblackmarket.io/ipfs/'+ data[key].musichash +'"><i class="fas fa-play"></i></div></div></div><div class="card-body"><h5 class="title">'+ data[key].title +'</h5><p>'+ data[key].category +'</p></div><div class="card-footer"><div class="price"><img src="/static/images/Icons/all/binance.svg" alt=""><span>'+ data[key].price +' BNB</span></div><div class="likes"><div class="d-flex align-items-center"><button class="button like '+(data[key].liked == true ? 'is-active' : '') + 'buttonLike-'+data[key].groupID+'" id="buttonLike-'+data[key].groupID+'" onclick="likePost('+data[key].groupID+')"><i class="fas fa-heart"></i></button><span id="getText-'+data[key].groupID+'" class="ms-1 countLike-'+data[key].groupID+'">'+data[key].countLike+'</span></div></div></div></div></div>';
            $('#popular-music').append(card)
        });
        
        data = returnedData.newMusicItems
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

function clearImageUploader(){
    $('#web-worker-progress').css('display' , 'none')
    $('#cover-file-upload-create').css({"background-image": "unset"});
    $('#cover-file-upload-create').find('div').fadeIn(0)
}

// Uplodaer 1
function uploader_picture_national_passport (event , useWebWorker) {
    var file = event.target.files[0]
    picture_national_driving_passport = file
    
    var htmlCode = '<button class="btn remove-file" onclick="changeUploader_picture_national_passport()"><i class="fas fa-exchange-alt me-1"></i>Change File</button><div class="uploaded-music"><i class="fas fa-file"></i><div class="w-100"><h6>'+ file.name +'</h6><div class="progress" id="progress_picture_national_passport"><div class="progress-bar w-0" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div></div><small>'+ bytesToSize(file.size) +'</small></div></div>'

    $('#showUploader_picture_national_passport').html(htmlCode)
    
    $('#progress_picture_national_passport').css('display' , 'flex')

    setTimeout(
        function() 
        {
            $('#progress_picture_national_passport').find('.progress-bar').delay("slow").css({ 'width': '100%'})
        }, 1000);
}

function changeUploader_picture_national_passport(){            
    var htmlCode = '<i class="fas fa-cloud-upload-alt"></i><span>Upload Photo</span>'            
    $('#showUploader_picture_national_passport').html(htmlCode)
}

// Uplodaer 2
function uploader_picture_face(event , useWebWorker) {
    var file = event.target.files[0]
    pictureYourFace = file
    
    var htmlCode = '<button class="btn remove-file" onclick="changeUploader_picture_face()"><i class="fas fa-exchange-alt me-1"></i>Change File</button><div class="uploaded-music"><i class="fas fa-file"></i><div class="w-100"><h6>'+ file.name +'</h6><div class="progress" id="progressUplodaer_picture_face"><div class="progress-bar w-0" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div></div><small>'+ bytesToSize(file.size) +'</small></div></div>'

    $('#showUploader_picture_face').html(htmlCode)
    
    $('#progressUplodaer_picture_face').css('display' , 'flex')

    setTimeout(
        function() 
        {
            $('#progressUplodaer_picture_face').find('.progress-bar').delay("slow").css({ 'width': '100%'})
        }, 1000);
}

function changeUploader_picture_face(){
    var htmlCode = '<i class="fas fa-cloud-upload-alt"></i><span>Upload Photo</span>'            

    $('#showUploader_picture_face').html(htmlCode)
}

// Uplodaer 2
function uploader_face_with_paper(event , useWebWorker) {
    var file = event.target.files[0]
    picture_face_with_paper = file
    
    var htmlCode = '<button class="btn remove-file" onclick="changeUploader_face_with_paper()"><i class="fas fa-exchange-alt me-1"></i>Change File</button><div class="uploaded-music"><i class="fas fa-file"></i><div class="w-100"><h6>'+ file.name +'</h6><div class="progress" id="progressUplodaer_face_with_paper"><div class="progress-bar w-0" role="progressbar" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div></div><small>'+ bytesToSize(file.size) +'</small></div></div>'

    $('#showUploader_face_with_paper').html(htmlCode)
    
    $('#progressUplodaer_face_with_paper').css('display' , 'flex')

    setTimeout(
        function() 
        {
            $('#progressUplodaer_face_with_paper').find('.progress-bar').delay("slow").css({ 'width': '100%'})
        }, 1000);
}

function changeUploader_face_with_paper(){
    var htmlCode = '<i class="fas fa-cloud-upload-alt"></i><span>Upload Photo</span>'            

    $('#showUploader_face_with_paper').html(htmlCode)
}

function submitFormVerification(){
    var fullname = $('#nameInputVerification').val()
    var email = $('#emailInputVerification').val()
    var wallet = $('#walletInputVerification').val()
    var social = $('#socialInputVerification').val()

    const formData = new FormData()            

    formData.append('picture_national_driving_passport', picture_national_driving_passport, picture_national_driving_passport.name)
    formData.append('pictureYourFace', pictureYourFace, pictureYourFace.name)
    formData.append('picture_face_with_paper', picture_face_with_paper, picture_face_with_paper.name)

    formData.append('email' , email)
    formData.append('fullname' , fullname)
    formData.append('wallet' , wallet)
    formData.append('social' , social)

    $('#verify-progress').parent('.progress').css({display : 'block'})

    $('#submitVerification').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Uploading');
    axios.request({
        method: "post", 
        url: "/verification/", 
        data: formData, 
        onUploadProgress: (p) => {           
            var percent = Math.round(p.loaded / p.total * 100)    
                                    
            $('#verify-progress').css({ width : percent + '%' });
            $('#verify-progress').text(percent + '%');
            $('#submitVerification').html('<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Proccessing');
        }
    }).then (data => {
        $("#modalVerificationForm").modal('toggle');
        myAlert('success' , 'Your information has been received ' , 'We received your request and will send you the results.');
        getRequestList();
    }).catch(function (error) {
        $("#modalVerificationForm").modal('toggle');
        myAlert('warning' , 'Warning' , error.response.data.message);
    });          
}


function submitFormReport(){

    var addr = getCookie('addr');
    if (addr == ""){
        $("#modalFormReport").modal('toggle');
        myAlert('warning' , 'Wallet' , 'Please connect your wallet');
    } else {

        var reportTitle = $('#titleinputSubmit').val();
        var reportToken = $('#tokeninputSubmit').val();
        var reportDescription = $('#descriptionInputSubmit').val();
        var statusType = reportToken.includes("/market/");
        if (statusType){
            statusType = "ART";
        } else {
            statusType = "MUSIC";
        }

        const formData = new FormData();
        formData.append('reporter', addr);
        formData.append('reportTitle' , reportTitle);
        formData.append('reportToken' , reportToken);
        formData.append('reportDescription' , reportDescription);
        formData.append('typeToken' , statusType);

        console.log(statusType)

        return fetch('/report/', {
            method: 'POST',
            body: formData
        })
        .then(res => {
            $('#titleinputSubmit').val("");
            $('#descriptionInputSubmit').val("");
            $("#modalFormReport").modal('toggle');
            myAlert('success' , 'Your report has been received ' , 'Thanks for your report.');
            getRequestList();
        });
    } 
}

function getRequestList(){

    const formData = new FormData()
    var addr = getCookie('addr');
    formData.append('addr', addr);
    axios.request({
        method: "post", 
        url: "/requestsList/",
        data: formData, 
        
    }).then(response => { 
        var dacmaL = response.data.dacmaList;
        var verifyL = response.data.verificationList;

        $.each( dacmaL, function( key, response ) {
            var statusHtml = '<span class="badge" style="background: #DEECFF;color: #486AFA;">Pending</span>'
            if(response.status == 's'){
                statusHtml = '<span class="badge" style="background: #D7F8DB;color: #2FC043;">Success</span>'
            }else if(response.status == 'r'){
                statusHtml = '<span class="badge" style="background: #FEE3E3;color: #FD003A;">Rejected</span>'
            }
            var tr = '<tr><td>'+ response.code +'</td><td><a href="'+ response.tokenAddress +'">'+response.tokenAddress+'</a></td><td>'+statusHtml+'</td><td>'+response.created+'</td></tr>';
            $('#dacma-request .accordion-body tbody').append(tr)            
        });

        $.each( verifyL, function( key, response ) {
            var statusHtml = '<span class="badge" style="background: #DEECFF;color: #486AFA;">Pending</span>'
            if(response.status == 's'){
                statusHtml = '<span class="badge" style="background: #D7F8DB;color: #2FC043;">Success</span>'
            }else if(response.status == 'r'){
                statusHtml = '<span class="badge" style="background: #FEE3E3;color: #FD003A;">Rejected</span>'
            }
            var tr = '<tr><td>'+ response.code +'</td><td>'+ response.address +'</td><td>'+statusHtml+'</td><td>'+response.created+'</td></tr>';
            $('#verify-request .accordion-body tbody').append(tr)            
        });

        

    })
    .catch(error => {
    });   

}


function getAssetsArt(){
    var addr = getCookie('addr');
    if (addr != ""){
        $.post(getBaseUrl() + "mynft/", { address: addr },
        function(returnedData){
            $('#list-art-token #content-list').html('');
            data = returnedData.data

            if(data.length < 1){
                var card = '<div class="text-center py-5" id="not-found-icon"><img src="/static/images/notFound.svg" class="img-fluid"  alt=""></div>'
                $('#list-art-token #content-list').append(card)
            }else{
                $.each( data, function( key, value ) {
                    // var card = '<div class="col-lg-4 col-sm-6"><div class="card"><div class="card-image"><a href=/app/nft/'+value.token_id+'/'+ value.group_id + '><img src=https://ipfs.nftblackmarket.io/ipfs/'+value.imghash+' class="img-fluid" alt=""><div class="image-caption"><span class="bridge">'+ value.status +'</span><span class="bridge">'+ value.count +'</span></div><div class="preview"><img src="/static/images/Icons/all/preview.svg" class="img-fluid" alt=""></div></a></div><div class="card-body"><div class="title"><div class="w-100"><img src="/static/images/Icons/yellowLogo.svg" alt=""><h4>'+value.title+'</h4></div><a target="_blank" href=/app/nft/'+value.token_id+'/'+ value.group_id + '><img src="/static/images/Icons/all/resize.svg" alt=""></a></div><ul><li>ID : <a target="_blank" href=https://bscscan.com/token/0x014712cC2F006570E379F82fB870087af6Ab4B11?a='+value.token_id+'>'+value.token_id+'</a></li><li>Collection ID : <a target="_blank" href=https://bscscan.com/token/0x014712cC2F006570E379F82fB870087af6Ab4B11?a='+value.group_id+'>'+value.group_id+'</a></li><li>Hash : <a target="_blank" href=https://ipfs.nftblackmarket.io/ipfs/'+value.hash+'>'+value.hash+'</a></li><li>ViewTransaction : <a target="_blank" href=https://bscscan.com/tx/'+value.trx_hast+'>'+value.trx_hast+'</a></li><li><a target="_blank" href=https://bscscan.com/token/0x014712cC2F006570E379F82fB870087af6Ab4B11>Constructor Contract</a></li></ul><div class="time-like"><span>'+convertTimestamp(value.timestamp)+'</span><div><span><img src="/static/images/Icons/all/Origin.svg" alt=""> <h6>'+value.origin+'</h6></span><span><img src="/static/images/Icons/all/like.svg" alt=""> <h6>'+value.countLike+'</h6></span></div></div></div></div></div>'
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href="/app/nft/'+value.token_id+'/'+ value.group_id+'"><img src=https://ipfs.nftblackmarket.io/ipfs/'+value.imghash+' alt=""></a><span class="type">'+value.status+'</span><div class="shortcut shortcut-image" data-img=https://ipfs.nftblackmarket.io/ipfs/'+value.imghash+'><i class="fas fa-expand"></i></div></div><div class="w-100"><div class="card-body"><h5 class="title">'+value.title+'</h5><ul><li>ID : <span><a target="_blank" href=https://bscscan.com/token/0x014712cC2F006570E379F82fB870087af6Ab4B11?a='+value.token_id+'>'+value.token_id+'</a></span></li><li>Collection ID : <span><a target="_blank" href=https://bscscan.com/token/0x014712cC2F006570E379F82fB870087af6Ab4B11?a='+value.group_id+'>'+value.group_id+'</a></span></li></ul></div><div class="card-footer"><div class="time"><span class="badge"><i class="far fa-clock"></i><span>'+convertTimestamp(value.timestamp)+'</span></span></div><div class="country-like"><span class="badge"><i class="fas fa-globe-americas"></i><span>'+value.origin+'</span></span><span class="badge"><i class="far fa-heart"></i><span>'+value.countLike+'</span></span></div></div></div></div> </div>';
                    $('#list-art-token #content-list').append(card)                        
                });

                $(".shortcut-image").click(function(){
                    var imageUrl = $(this).attr("data-img")                
                    $("#full-image").attr("src", imageUrl );
                    $('#image-viewer').show();
                    });

                    $("#image-viewer .close").click(function(){
                    $('#image-viewer').hide();
                });
            }
        });
    }             
}  


function getAssetsMusic(){
    var addr = getCookie('addr');
    if (addr != ""){
        $.post(getBaseUrl() + "mymusicnft/", { address: addr },
        function(returnedData){
            $('#list-music-token #content-list').html('');
            data = returnedData.data

            if(data.length < 1){
                var card = '<div class="text-center py-5" id="not-found-icon"><img src="/static/images/notFound.svg" class="img-fluid"  alt=""></div>'
                $('#list-music-token #content-list').append(card)
            }else{
                $.each( data, function( key, value ) {
                    var card = '<div class="col-lg-3"><div class="card-item"><div class="card-img"><a href=/app-music/nft/'+value.token_id+'/'+ value.group_id + '><img src=https://ipfs.nftblackmarket.io/ipfs/'+value.imghash+' alt=""></a><div class="playing"><div class="page-loading"><div class="loader"><div class="loading d-flex"><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div><div><section></section></div></div></div></div></div><span class="type">'+"MUSIC"+'</span><div class="music-shortcut-button"><div class="shortcut shortcut-music music-'+value.group_id+'" id="play" onclick="plauMusic('+value.group_id+')" data-music="https://ipfs.nftblackmarket.io/ipfs/'+value.musichash+'"><i class="fas fa-play"></i></div></div></div><div class="w-100"><div class="card-body"><h5 class="title">'+value.title+'</h5><ul><li>ID : <span>'+value.token_id+'</span></li><li>Collection ID : <span>'+value.group_id+'</span></li></ul></div><div class="card-footer"><div class="time"><span class="badge"><i class="far fa-clock"></i><span>'+convertTimestamp(value.timestamp)+'</span></span></div><div class="country-like"><span class="badge"><i class="fas fa-globe-americas"></i><span>'+value.origin+'</span></span><span class="badge"><i class="far fa-heart"></i><span>'+value.countLike+'</span></span></div></div></div></div></div>'
                    $('#list-music-token #content-list').append(card)                        
                });
            }
        });
    }             
} 