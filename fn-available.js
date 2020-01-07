$(function() {
    var $domainstring = '';
    var $max_results_shown = 20;
    var $check_pending = [];

    $(".domainCheck #submitBtn").click(function () {
        // return if no value is given.
        var $domainname = $(this).parent().find("[name='domainname']").val().trim();

        // delete unwanted data
        $("#free_domains").find("tr").remove();
        $(".paid_rows").remove();

        // set all input boxes to this value
        $("[name='domainname']").val($domainname);

        var $domain='xyz.ko';
        var $tld='tk';
        var $dtest = new RegExp("^[a-zA-Z0-9-]+\.[a-zA-Z0-9]+$");
        var $result = "";

        // update the global domainstring
        $domainstring = $domain;

        // do an availability test - AJAX
        $.ajax({
            url:    "http://127.0.0.1/fn-available.php",
            type:   'post',
            data:   { domain: $domain, tld: $tld },
            beforeSend: function(xhr) {
                xhr.withCredentials = true;
            },
            xhrFields: {
                withCredentials: true
            },
            error: function() {
            },
            success: function($data, $status) {
       
                // remove iframe
                $(".tmpResults").hide();
                $("iframe").remove();

                // do something
                $tmpl = $.templates("#freedomain_tmpl");
                $html = $tmpl.render($data.free_domains);
                $("#free_domains").html($html);

                // hide text for free domains if special domains are in place
                var $free_count = $("#free_domains").find(".forFree:visible").length;
                var $special_count = $("#free_domains").find(".specialDomain:visible").length;

                // only special
                if ( $free_count == 0 && $special_count > 0) {
                    $("#check_free_domains").hide();
                    $("#check_free_special_domains").hide();
                    $("#check_special_domains").show();

                // only free
                } else if ( $free_count > 0 && $special_count == 0) {
                    $("#check_free_domains").show();
                    $("#check_free_special_domains").hide();
                    $("#check_special_domains").hide();

                // both free and special
                } else if ($free_count > 0 && $special_count > 0) {
                    $("#check_free_domains").hide();
                    $("#check_free_special_domains").show();
                    $("#check_special_domains").hide();

                // none
                } else {
                    $("#check_free_domains").hide();
                    $("#check_free_special_domains").hide();
                    $("#check_special_domains").hide();
                }

                $tmpl = $.templates("#paiddomain_tmpl");
                $html = $tmpl.render($data.paid_domains);
                $($html).insertAfter("#paid_domains");

                // display first 20
                $(".paid_rows").each(function($i, $v) {
                    if ($i < 20) {
                        $(this).show();
                    }
                });

                $(".domainCheck.firstCheck").addClass('idle');
                $(".allResults").addClass('active');

                // display some content
                $(".domainResult.zeroSection").hide();
                $(".domainResult.firstSection").show();
                $(".domainResult.secondSection.otherFreeDomains").show();
                $(".domainResult.thirdSection.otherCostPriceDomains").show();
                $(".bottomCart.paginate").show();
                $(".domainPriceChart").hide();

                // dont show top_domain if not wanted
                if ($data.top_domain["dont_show"] == 1) {
                    $("#top_domain").hide();
                    $(".succes").hide();
                    $(".alert").hide();
                    $(".no_tld_result").show();
                    $(".nrSelectedDomains").text($data["current_in_cart"] + 1);
                    updateCartCount(-1);

                // display the correct tag
                } else if ($data.top_domain['status'] == "AVAILABLE") {
                    // display nr in cart (-1 because we will add one)
                    $(".nrSelectedDomains").text($data["current_in_cart"] - 1);
                    updateCartCount(1);
                    $(".alert").hide();
                    $(".no_tld_result").hide();
                    $(".succes").show();

                        $("#top_domain").find(".forFree").show();
                        $("#top_domain").find(".specialDomain").hide();
                        $("#top_domain").find(".upgradeDomain").hide();
                        $("#top_domain").find(".costPrice").hide();
                        $("#top_domain_get_it_text").text($("#top_domain_get_it_free_text").val()).hide();
                        $("#top_domain").find(".addedToCart").show();
     

                    // max in cart? its not selected
                    if ($data["maximum_reached"]) {
                        $("#top_domain").find(".addedToCart").hide();
                        $("#top_domain").find(".removeSmall").hide();
                        $("#top_domain").find(".topNotAvailable").hide();
                        $("#top_domain").find(".addTopToCart").show();
                    }

                    $("#top_domain").show();

                } else {
                     $(".nrSelectedDomains").text($data["current_in_cart"] - 1);
                    updateCartCount(1);
                    $(".alert").hide();
                    $(".no_tld_result").hide();
                    $(".succes").show();

                        $("#top_domain").find(".forFree").show();
                        $("#top_domain").find(".specialDomain").hide();
                        $("#top_domain").find(".upgradeDomain").hide();
                        $("#top_domain").find(".costPrice").hide();
                        $("#top_domain_get_it_text").text($("#top_domain_get_it_free_text").val()).hide();
                        $("#top_domain").find(".addedToCart").show();
     

                    // max in cart? its not selected
                    if ($data["maximum_reached"]) {
                        $("#top_domain").find(".addedToCart").hide();
                        $("#top_domain").find(".removeSmall").hide();
                        $("#top_domain").find(".topNotAvailable").hide();
                        $("#top_domain").find(".addTopToCart").show();
                    }

                    $("#top_domain").show();
                }

                $(".dname").text($data.top_domain['domain'] + $data.top_domain['tld']);
                $("#dname").text($data.top_domain['domain']);
                $("#dcurrency").text($data.top_domain['currency']);
                $("#dtld").text($data.top_domain['tld']);
                $("#dprice_int").html($data.top_domain['price_int'] + '.<span id="dprice_cent" class="cents"></span>');
                $("#dprice_cent").text($data.top_domain['price_cent']);

                // update slider maximum 20 for tld, 1 for dot
                var $tmp_max = 20 + $domainstring.length + 1;
                $("#max_chars").text($tmp_max);

                // add handler to select buttons
                $(".addSelect,.addTopToCart").click(function() {

                    // max in cart? stop adding more
                    var $current = $(".nrSelectedDomains").first().text();
                    if (parseInt($current) > 9) {
                        return;
                    }

                    $(this).hide();
                    //$(this).next() = $(this).next();
                    $(this).next().show();

                    var $domain = $(this).parent().parent().find(".domainName").text();
                    var $tld = $(this).parent().parent().find(".domainExtension").text();

                    if (!$domain) {
                        $domain = $(this).parent().parent().parent().find(".domainName").text();
                        $tld = $(this).parent().parent().parent().find(".domainExtension").text();
                    }
                    var $ldn = $(this).next();

                    $check_pending[$domain+$tld] = 1;

                    $.ajax({
                        url:    "https://my.freenom.com/includes/domains/fn-additional.php",
                        type:   'post',
                        data:   { domain: $domain, tld: $tld },
                        crossDomain: true,
                        beforeSend: function(xhr) {
                            xhr.withCredentials = true;
                        },
                        xhrFields: {
                            withCredentials: true
                        },
                        success: function($data, $status) {
                            delete $check_pending[$domain+$tld];
                            $check_pending = $check_pending - 1;
                            $ldn.hide();
                            if ($data.available) {
                                $ldn.next().show().next().show();
                                updateCartCount(1);
                            } else {
                                $ldn.next().next().next().show();
                            }
                        },
                    });
                });

                $(".removeSelected").click(function() {
                    $del_button = $(this);
                    var $domain = $(this).parent().parent().find(".domainName").text();
                    var $tld = $(this).parent().parent().find(".domainExtension").text();

                    $.ajax({
                        url:    "https://my.freenom.com/includes/domains/fn-remove.php",
                        type:   'post',
                        data:   { domain: $domain, tld: $tld },
                        crossDomain: true,
                        beforeSend: function(xhr) { xhr.withCredentials = true; },
                        xhrFields: { withCredentials: true },
                        success: function($data, $status) {
                            $($del_button).hide().next().hide().prev().prev().prev().show();
                            updateCartCount(-1);
                        },
                    });
                });

                // remove selected main domain
                $(".removeSmall").click(function() {
                    $del_button = $(this);
                    var $domain = $(this).parent().parent().parent().find(".domainName").text();
                    var $tld = $(this).parent().parent().parent().find(".domainExtension").text();

                    $.ajax({
                        url:    "https://my.freenom.com/includes/domains/fn-remove.php",
                        type:   'post',
                        data:   { domain: $domain, tld: $tld },
                        crossDomain: true,
                        beforeSend: function(xhr) { xhr.withCredentials = true; },
                        xhrFields: { withCredentials: true },
                        success: function($data, $status) {
                            $($del_button).hide().prev().hide().prev().prev().show();
                            updateCartCount(-1);
                        },
                    });
                });
            }
        });

        // show it for other TLD's - daar moeten we ook pricing voor hebben.
    });

    updateCartCount(0);
});

function updateCartCount($delta) {
    var $current = $(".nrSelectedDomains").first().text();
    var $next = parseInt($current) + parseInt($delta);

    if ($next < 1) {
        $(".nrSelectedDomains").text("0");
        $(".selectedDomains").hide();
        $(".selectedDomains").parent().find(".addToCart").hide();
        $(".fixedToCart.transparentBackground").find("div").hide();
        $(".fixedToCart.transparentBackground").hide();

    } else {
        $(".nrSelectedDomains").text($next);

        if ($next > 1) {
            $(".multipleSelectedDomains").show();
            $(".singleSelectedDomain").hide();
        } else {
            $(".multipleSelectedDomains").hide();
            $(".singleSelectedDomain").show();
        }

        $(".selectedDomains").show();
        $(".selectedDomains").parent().find(".addToCart").show();
        $(".fixedToCart.transparentBackground").find("div").show();
        $(".fixedToCart.transparentBackground").show();
    }

    if ($next > 9) {
        $(".maxCartReached").show();
        $maximum_in_cart = 1;
    } else {
        $(".maxCartReached").hide();
        $maximum_in_cart = 0;
    }
};