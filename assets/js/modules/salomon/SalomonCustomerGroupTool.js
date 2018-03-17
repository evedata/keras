/**
 * @file SalomonCustomerGroupTool.js
 * @type Module
 * @desc
 */


// define module
define(['jquery', 'module', 'salomon/SalomonCookie', 'salomon/SalomonMagento'] ,function($, module, cookie, magento) {
    var self = {};

    /****************************************************************************
     Private
     ****************************************************************************/

    // Debug tool to switch customer group
    function init() {
        var that = this;

        magento.getCustomerGroup().done(function (customer){
            var val = cookie.getCookie("customergroup");
            var overwrite = cookie.getCookie("customer-tool");
            var customerMap = module.config();

            if (overwrite != '') {
                $('#dev-customer-group-picker .overwrite').removeClass('hidden');
            }

            if (val != '') {
                that.customerGroupValue = val;

                if (val == 'ECOM') {
                    that.customerGroup = 'B2C';
                }

                $.each(customerMap, function(key, value) {
                    if (val == value) {
                        that.customerGroup = key;
                    }
                });
            } else {
                that.customerGroup = 'B2C';
                that.customerGroupValue = 'ECOM';
            }

            $('#dev-customer-group-picker .js-static-customer-group-name')
                .html(that.customerGroup);

            $('#dev-customer-group-picker .js-static-customer-group-value')
                .html(that.customerGroupValue);

            $('#group-picker-tool option[value=' + that.customerGroupValue + ']').attr('selected', 'selected');
        });

        $("#group-picker-tool").bind("change", function() {
            var val = $(this).val();

            if (val == '#normal') {
                cookie.setCookie('customer-tool', '', 'Thu, 01 Jan 1970 00:00:01 GMT', '/' + magento.getMagentoCodes().subsidiary);
                cookie.setCookie('customergroup', '', 'Thu, 01 Jan 1970 00:00:01 GMT', '/' + magento.getMagentoCodes().subsidiary);
                window.location.reload();
            } else {
                cookie.setCookie('customer-tool', 'true', null, '/' + magento.getMagentoCodes().subsidiary);
                cookie.setCookie('customergroup', val, null, '/' + magento.getMagentoCodes().subsidiary);
                window.location.reload();
            }
        });

        return self;
    }

    // Start customer group debug tool if twig loaded
    if ($('#dev-customer-group-picker').length) {
        return init();
    }

    return self;
});