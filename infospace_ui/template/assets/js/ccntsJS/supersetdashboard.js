// A $( document ).ready() block.
$(document).ready(function () {
    console.log("GGGGGGGGGGGGGGGGGGGGGG")
    fetchAccessToken(function (responce) {
        //4b310960-0566-494b-96ee-33d6d96c47a2 TRADING item
        fetchGuestToken("2ea27e7b-e147-4d59-81b4-c65dcc28ab97", responce.access_token, function (respincedata) {
            supersetEmbeddedSdk.embedDashboard({
                id: "2ea27e7b-e147-4d59-81b4-c65dcc28ab97", // given by the Superset embedding UI
                supersetDomain: "http://202.21.38.245:8088",
                mountPoint: document.getElementById("dashboard"), // any html element that can contain an iframe
                fetchGuestToken: () => respincedata.token,
                dashboardUiConfig: { // dashboard UI config: hideTitle, hideTab, hideChartControls, filters.visible, filters.expanded (optional)
                    hideTitle: true,
                    filters: {
                        expanded: true,
                    }
                },
            }).then(function (r) {
                var firstIframe = $("#dashboard").children('iframe')[0];
                $(firstIframe).attr('width', '100%');
                $(firstIframe).attr('height', '1000px');
            });
        })
    })
});
function fetchAccessToken(callback) {
    var apiUrl = "http://202.21.38.245:8088/api/v1/security/login";

    // Create the data object to be sent in the request body
    var requestData = {
        "username": "admin",
        "password": "admin",
        "provider": "db",
        "refresh": true
    };
    // Set custom headers    
    var customHeaders = {
        "Access-Control-Allow-Origin": "*.*", "Content-Type": "application/json", "allow_headers": "*"
    };

    // Make the AJAX POST request
    $.ajax({
        url: apiUrl,
        type: 'POST',
        headers: customHeaders,
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function (data) {
            // Handle the success response
            callback(data)
            console.log('Success:', data);
        },
        error: function (error) {
            // Handle the error response
            console.error('Error:', error);
        }
    });


}
function fetchGuestToken(dashboardid, accessToken, callback) {
    var apiUrl = "http://202.21.38.245:8088/api/v1/security/guest_token/";

    // Create the data object to be sent in the request body
    var requestData = {
        "resources": [
            {
                "type": "dashboard",
                "id": dashboardid,
            }
        ],
        /**
         * rls: Row Level Security, this differs for client to client ,like what to show each client
         */
        "rls": [],
        "user": {
            "username": "admin",
            "first_name": "admin",
            "last_name": "admin",
        }
    };
    // Set custom headers

    var customHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
    };

    // Make the AJAX POST request
    $.ajax({
        url: apiUrl,
        type: 'POST',
        headers: customHeaders,
        contentType: 'application/json',
        data: JSON.stringify(requestData),
        success: function (data) {
            // Handle the success response
            console.log('Success:', data);
            callback(data)

        },
        error: function (error) {
            // Handle the error response
            console.error('Error:', error);
        }
    });

}
