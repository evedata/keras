/* ----------------- */
/* ::: FID.JS ::: */
/* ----------------- */

//penser au footer-externe et au template.js

//determination bloc 
function setFidProductDetails(ProductPrice) {

        //page product
        if (jQuery('div#prod-desc div.fid-status').is('*')){

            if (accountId.length == 0){
                jQuery('#fidNotMember').show();
            }
            else{
            
                ajaxFidInfos = jQuery.ajax({
                    dataType: 'json',
                    url: '/scripts/nocache/fidAmountAvailable.aspx',
                    data: { 'accountid': accountId, 'subsidiary': sCodeFiliale},
                    success: function (response) {
                        if (response) {
                            
                            //alert(JSON.stringify(response, null, 4));
                            
                            //recuperation des vouchers dispo
                            var dMtt = 0;
                            var iCoupons = 0;
                            var statusFid = '';
                            var dPrixProduit = ProductPrice;
                            
                            //recuperation des bons
                            if (response.number) {
                                iCoupons = response.number;
                            }
                            if (response.amount) {
                                dMtt = response.amount;
                            }
                            if (response.status) {
                                statusFid = response.status;
                            }

                            //bientot vip
                            if (statusFid === 'VIP1'){
                                jQuery('#fidEliteSoon').show();
                            }
                            else{
                                //si pas de bon d'achat => message 15 euros a gagner
                                if (iCoupons == 0){
                                    jQuery('#fidNoVouchers').show();
                                }
                                else{
                                    //utilisation des bons d'achats
                                    var reg = new RegExp('(<mtt>)', 'g');
                                    var mttTxt = jQuery('#fidVouchers .fid-text').html();
                                    //si plus de bon d'achat que le montant du produit
                                    if (dMtt >= dPrixProduit){
                                        var dMttBon = parseFloat(dMtt) / parseFloat(iCoupons);//calcul du montant d'un bon
                                        while (dMtt >= dPrixProduit){//tant que le mtt du bon > prix du produit, on decremente
                                            dMtt = dMtt - dMttBon;
                                            iCoupons = iCoupons - 1
                                        }
                                        //affichage message avertissement trop de bons
                                        jQuery('#fidVouchers .fid-text-toomuch').show();
                                    }
                                    //changement picto
                                    var sImgVoucherSrc = '/natif_img/productpage/' + iCoupons + '-bons_' + sCodeFiliale + '.png';
                                    //si plus de 150 euros de BA on change le picto
                                    if (iCoupons > 10){
                                        sImgVoucherSrc = '/natif_img/productpage/10+-bons_' + sCodeFiliale + '.png';
                                    }
                                    jQuery('#fidVouchers .fid-picto img').attr('src', sImgVoucherSrc);
                                    jQuery('#fidVouchers').show();
                                    //changement montant
                                    jQuery('#fidVouchers .fid-text').html(mttTxt.replace(reg, dMtt));
                                }
                            }
                        }
                    }
                });
            }
            
        }
        
    //}
}


/*
 * Cette fonction permet de checker si la filiale a le droit d'afficher les elements avenseo/fidv2/lientheprogram
 */

//launchActConnected et launchHideB2xConnected sont mainetnant dans ecom.js


/*
 * Function for changing the program url in header and hide thing on the-program page
 */
function actConnected(callback) {
    if (isConnected === true) {
        jQuery(function(){
            if (jQuery('header.withProg li.progFid a').is('*')) {
                //on ne change l'url que pour les gens de niveau 3 et superieur
              if (parseInt(amerLoyalty) >= 3){
                  jQuery('header.withProg li.progFid a').attr('href', sDomainSqli + '/' + sCodeFilialeSqli + '/customer/account/loyaltyhome/');
              }
            }

            //specific page the program
            if (jQuery('div#jsTheProgramTopHeader').is('*')){
                jQuery('#jsTheProgramTopHeader').addClass('connected');
                jQuery('#jsBtConnectTheProgram').hide();//hide button in top mea
                jQuery('#jsBtEnSavoirPlusTheProgram').hide();//hide button in top mea
                jQuery('#jsTheProgramMeaJoin').hide();//hide join in bottom mea
            }

            //cache contact expert/chat
            if (jQuery('li#bFooterExpert').is('*')){
                jQuery('li#bFooterExpert').hide();
                jQuery('li#secondChild').addClass('newFirstItem');
                jQuery('li#thirdChild').addClass('newSecondItem');
                jQuery('li#fourstChild').addClass('newThirdItem');
            }
            if (jQuery('li#bFooterFid').is('*')){
                jQuery('li#bFooterFid').show();
            }
        });
    }
    else{
       //pas connect new fid, affiche the program
        jQuery(function(){
            if (jQuery('li#bFooterExpert').is('*')){
                jQuery('li#bFooterExpert').hide();
                jQuery('li#secondChild').addClass('newFirstItem');
                jQuery('li#thirdChild').addClass('newSecondItem');
                jQuery('li#fourstChild').addClass('newThirdItem');
                jQuery('li#bFooterFid').show();
            }
        });
    }
    if(callback){jQuery(function (){window[callback]();});}
}



/*
 * Function for hiding the program in header
 */
function hideB2xConnected() {
  if (isConnected === true) {
    if (jQuery('header.withProg li.progFid').is('*')) {
            jQuery('header li.progFid').hide();
            jQuery('header').removeClass('withProg');
            if (jQuery('li#bFooterExpert').is('*')){
                jQuery('li#bFooterFid').hide();
                jQuery('li#bFooterExpert').show();
            }
        }
  }
  //hide footer
  else{
    if (jQuery('li#bFooterFid').is('*')){
        jQuery('li#bFooterFid').hide();
    }
  }
}



/*
 * Cette fonction va afficher pour les filiales FID non passe a la v2 l'item contact/chat
 */
function actFidCurrent() {
    if (jQuery('li#bFooterExpert').is('*')){
        //on cache la fid au cas ou
        if (jQuery('li#bFooterFid').is('*')){
            jQuery('li#bFooterFid').hide();
        }
        jQuery('li#bFooterExpert').show();
    }
}
