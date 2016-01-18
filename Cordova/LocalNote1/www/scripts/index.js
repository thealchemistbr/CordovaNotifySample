// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.

(function () {
    "use strict";

    var pushNotification;

    var androidOptions = {
        "senderID": "609309366624",
        "ecb": "onGCM"
    };

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // notificações push
        pushNotification = window.plugins.pushNotification;

        pushNotification.register(function (result) {
            //$("#token").html(result);
        }, function (err) {
            $("#token").html("Error registering..." + err);
        }, androidOptions);

        if (AdMob) {
             AdMob.createBanner({
                 adId: 'ca-app-pub-3940256099942544/6300978111',
                 position: AdMob.AD_POSITION.TOP_CENTER,
                 autoShow: true
            });
        }
        

        //document.getElementById("btn").addEventListener('click', add_reminder());

        $("#btn").click(lister());
        $("#btn2").click(delayed);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.

        cordova.plugins.notification.local.hasPermission(function (granted) {
            if (granted == true) {
                $("#granted").html("GRANTED");
            } else {
                $("#granted").html("NOT GRANTED");
            }
        });

        cordova.plugins.notification.local.on("trigger", function (notification) {
            console.log("triggered: " + notification.id);
        });

        cordova.plugins.notification.local.on("schedule", function (id, state, json) {
            $("#granted").append("<br />" + id);
        });

        function schedule(id, title, message, schedule_time) {
            cordova.plugins.notification.local.schedule({
                id: id,
                title: title,
                text: message,
                at: schedule_time
            });
            var array = [id, title, message, schedule_time];
            //info.data[info.data.length] = array;
            //localStorage.setItem("rp_data", JSON.stringify(info));
            navigator.notification.alert("Reminder added successfully")
        }

        function onPause() {
            // TODO: This application has been suspended. Save application state here.
        };

        function onResume() {
            // TODO: This application has been reactivated. Restore application state here.
        };

        /* var schedule = function () {
            cordova.plugins.notification.local.schedule({
                id: "1",
                text: 'Test Message 1',
                icon: 'http://3.bp.blogspot.com/-Qdsy-GpempY/UU_BN9LTqSI/AAAAAAAAAMA/LkwLW2yNBJ4/s1600/supersu.png',
                smallIcon: 'res://cordova',
                sound: null,
                data: { test: "id" }
            });
        }; */

        function delayed() {

            var now = new Date().getTime(),
                _15_sec_from_now = new Date(now + 15 * 1000);

            schedule(999, "Teste", "Teste por function", _15_sec_from_now);

        };

        function lister () {
            cordova.plugins.notification.local.getAll(function (notifications) {
                if (notifications.length > 0) {
                    for (i = 0; i < notifications.length; i++) {
                        console.log(notifications.id);
                        console.log(notifications.text);
                    }
                } else {
                    console.log("none found");
                }
            });
        };
    }
})();

function onGCM(e, n) {
    switch (e.event) {
        case "registered":
            $("#token").html(e.regid);
            break;
        case "message":
            $("#message").append("<br />" + e.payload.message);
            break;
        default:
            break;
    }
}