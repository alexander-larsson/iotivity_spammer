var light = null,
    device = require("iotivity-node")();

console.log("Client started");

device.configure({
    role: "client"
}).then(function() {

    // Add a listener that will receive the results of the discovery
    device.addEventListener("resourcefound", function(event) {
        // We've discovered the resource we were seeking.
        if (event.resource.id.path === "/a/light") {

            console.log("Light resource found");

            //Requst the full resource object (with properties)
            device.retrieveResource(event.resource.id).then(function(resource) {
                // Save the found resource
                light = resource;
                console.log("Light resource saved");
                console.log(JSON.stringify(light, null, 4));


                //##############################################################
                //
                // Interesting bit
                //
                var spam_this_many_times = 1000;
                var times_spamed = 0;

                var interval = setInterval(function() {
                    updateOnProperty( light.properties.power ? false : true );
                    times_spamed++;
                    console.log("Spammed " + times_spamed + " times");
                    if(times_spamed >= spam_this_many_times) {
                      process.exit();
                    }
                }, 1000);
                //
                //##############################################################

            })

            function updateOnProperty(newValue) { // newValue is of type boolean
                light.properties.power = newValue;
                var newPowerString = newValue ? "on" : "off";

                device.updateResource(light).
                then(function() {
                    console.log("Turned light " + newPowerString);
                }).
                catch(function() {
                    console.log("Error turning light " + newPowerString);
                })

            }

        }
    });
    device.findResources();
});
