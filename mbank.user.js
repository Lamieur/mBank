// ==UserScript==
// @id             666
// @name           mBank to amatorzy
// @version        1.7
// @namespace      Lam
// @author         Lam
// @description    mBank to amatorzy
// @include        https://online.mbank.pl/*
// @include        http://www.mbank.pl/logoutpage*
// @grant          unsafeWindow
// @grant          GM_addStyle
// @run-at         document-end
// @downloadURL    https://raw.githubusercontent.com/Lamieur/mBank/master/mbank.user.js
// @updateURL      https://raw.githubusercontent.com/Lamieur/mBank/master/mbank.user.js
// ==/UserScript==

var $ = unsafeWindow.jQuery;

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        for (var i = 0; i < targetNodes.length; i++) {
            var jThis        = $(targetNodes[i]);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        }
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

function mbanktogowno(jNode) {
//	jNode.val( 'TEST' );
    jNode[0].focus ();
}

waitForKeyElements (
    "#authorizationCode, #SmsCode, input.btn, #logoutId",
    mbanktogowno
);


// Nowa strona logowania, chyba próbowali ukryć kursor pod napisem "Identyfikator", przez co ukryli wprowadzany tekst :D
GM_addStyle( ".form-input #userID { color:black; }" );
GM_addStyle( ".form-input #pass { color:black; }" );
GM_addStyle( "html.lifting, #content, body.lifting { background-color: #dddddd !important; }" );

