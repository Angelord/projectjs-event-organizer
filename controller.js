
var LOCKED_MSG = "System locked. Unable to perform aciton";

var events = {};

var defaultController = {

    validateCreation : function(name, adultOnly) {
        return (!strings.isBlank(name));
    },

    validateModify : function(id, name, adultOnly) {
        return ((id in events) && this.validateCreation(name, adultOnly));
    },

    validateRemoval : function(id) {
        return (id in events);
    },

    validateAddClient : function(id, fName, lName, gender, age) {
        if(!(id in events)) { return false; }
        if(strings.isBlank(fName) || strings.isBlank(lName) || strings.isBlank(gender)) { return false; }
        if(isNaN(age)) { return false; }
        if(events[id].adultOnly && age < 18) {
            alert("The client is too young to attend."); 
            return false; 
        }

        return true;
    },

    createEvent : function(name, adultOnly) {
        var event = new Event(name, new Date(), adultOnly);
        events[event.id] = event;
        return event;
    },

    modifyEvent : function(id, name, adultOnly) {
        events[id].name = name;
        events[id].adultOnly = adultOnly;
        return events[id];
    }, 

    removeEvent : function(id) {
        var event = events[id];
        delete events[id];
        return event;
    },

    addClient : function(eventId, client) {
        events[eventId].addClient(client);
    },

    removeClient : function(eventId, clientIndex) {
        delete events[eventId].clients.splice(clientIndex, 1);
        redrawEvents();
    },

    lock : function() { controller = lockedController; },
    unlock : function() { }
}

var lockedController = {

    validateCreation : function(name, adultOnly) { 
        alert(LOCKED_MSG);
        return false; 
    },

    validateModify : function(id, name, adultOnly) {
        alert(LOCKED_MSG);
        return false; 
    },

    validateRemoval : function(id) { 
        alert(LOCKED_MSG);
        return false; 
    },

    validateAddClient : function(id, fName, lName, gender, age) { 
        alert(LOCKED_MSG);
        return false
    },

    createEvent : function() {},
    modifyEvent : function() {},
    removeEvent : function() {},
    addClient : function() {},
    removeClient : function() {},

    lock : function() { },
    unlock : function() { controller = defaultController; }
}

var controller = defaultController;


function Event(name, date, adultOnly) {

    this.id = idGenerator.next();
    this.name = name;
    this.adultOnly = adultOnly;  
    this.clients = [];

    this.addClient = function (client) {
        this.clients.push(client);
    };

    this.numClients = function() {
        return this.clients.length;
    }

    this.getDate = function() { 
        return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
    } 
}

function Client(firstName, lastName, gender, age) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.age = age;
    this.getFullName = function() { return this.firstName + " " + this.lastName; };
}

