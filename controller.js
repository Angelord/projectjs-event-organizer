
var LOCKED_MSG = "System locked. Unable to perform aciton";

//Тук е всичката логика за валидиране на промени и осъществавянето им

function Controller() {

    var locked = false;
    var unlockedFunctions = {};

    this.createEvent = function() {
        var name = document.forms["createEvent"]["name"].value;
        var adultOnly = document.forms["createEvent"]["adultOnly"].checked;
        var price = document.forms["createEvent"]["price"].value;

        if(strings.isBlank(name)) { return; }
        if(strings.isBlank(price) || isNaN(price)) { price = 0; }

        var event = new Event(name, new Date(), adultOnly, price);

        data.addEvent(event);

        redraw();
    };

    this.modifyEvent = function() {
        var id = document.forms["modifyEvent"]["id"].value;
        var name = document.forms["modifyEvent"]["name"].value;
        var adultOnly = document.forms["modifyEvent"]["adultOnly"].checked;
        var price = document.forms["modifyEvent"]["price"].value;

        if(!(id in data.getEvents())) { return; }

        var event = data.getEvent(id);

        if(!strings.isBlank(name)) { event.name = name; }
        event.adultOnly = adultOnly;
        if(!isNaN(price)) { event.setPrice(price); }

        redraw();
    }; 

    this.removeEvent = function() {
        var id = document.forms["removeEvent"]["id"].value;

        if(id in data.getEvents()) {

            var event = data.getEvents()[id];
            
            data.deleteEvent(id);
            
            alert("Removed event with name " + event.name);
            
            redraw();
        }
    };

    this.createClient = function() {
        var fname = document.forms["createClient"]["firstName"].value;
        var lname = document.forms["createClient"]["lastName"].value;
        var gender = document.forms["createClient"]["gender"].value;
        var age = document.forms["createClient"]["age"].value;
        var wallet = document.forms["createClient"]["wallet"].value;

        if(strings.isBlank(fname) || strings.isBlank(lname) || strings.isBlank(gender)) { return; }
        if(isNaN(age)) { return; }
        if(isNaN(wallet)) { return; }

        data.addClient(new Client(fname, lname, gender, age, wallet));

        redraw();
    };

    this.deleteClient = function(clientId) {
        if(!(clientId in data.getClients())) { return; }

        data.deleteClient(clientId);

        redraw();
    };

    this.addClientToEvent = function() {
        var clientId = document.forms["addClientToEvent"]["clientId"].value;
        var eventId = document.forms["addClientToEvent"]["eventId"].value;

        if(!(clientId in data.getClients())) { return; }
        if(!(eventId in data.getEvents())) { return; }

        var client = data.getClient(clientId);
        var event = data.getEvent(eventId);

        if(event.archived) {
            alert("Event is archived");
            return;
        }

        if(event.adultOnly && client.age < 18) {
            alert("The client is too young to attend."); 
            return; 
        }

        if(event.containsClient(client)) {
            alert("Client already attending event");
            return;
        }
        
        data.addClientToEvent(clientId, eventId);

        redraw();
    };

    this.removeClientFromEvent = function(clientId, eventId) {

        data.removeClientFromEvent(clientId, eventId);

        redraw();
    };

    this.archiveEvent = function(eventId) {
        if(!(eventId in data.getEvents())) { return; }

        var event = data.getEvent(eventId);
        event.archived = true;

        redraw();
    };

    this.rateEvent = function() {
        var clientId = document.forms["addClientToEvent"]["clientId"].value;

        var eventId = document.forms["rateEvent"]["eventId"].value;
        var clientId = document.forms["rateEvent"]["clientId"].value;
        var rating = document.forms["rateEvent"]["rating"].value;

        if(!(eventId in data.getEvents())) { return; }
        if(!(clientId in data.getClients())) { return; }
        if(isNaN(rating)) { return; }

        rating = parseInt(rating);
        if(rating < 0 || rating > 6) {
            alert("Invalid rating! Ratings must be in the range [0;6]");
            return;
        }

        var event = data.getEvent(eventId);
        var client = data.getClient(clientId);
        if(!event.archived) {
            alert("Event not archived!");
            return; 
        }

        if(!(event.containsClient(client))) {
            alert("Client did not attend the event!");
            return;
        }

        event.rate(clientId, rating);
        redraw();
    };


    //Тук е функционалността свързана с блокиране на промени и отблокиране

    this.lock = function() { 
        if(!locked) {
            for(var key in this) {
                if(key == "lock" || key == "unlock") { continue; }

                unlockedFunctions[key] = this[key];
                this[key] = function() {
                    alert(LOCKED_MSG);
                };
            }

            locked = true;
        }
    };

    this.unlock = function() {
        if(locked) {
            for(var key in this) {
                if(key == "lock" || key == "unlock") { continue; }

                this[key] = unlockedFunctions[key];
            }
            unlockedFunctions = {};
            locked = false;
        }
    };
}

var controller = new Controller();

