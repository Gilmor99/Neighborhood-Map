
/*
Building a neighborhood data model by inquring Foursquare with initila value of zip code 98005
*/
var venue = function(data){
    this.name = ko.observable(data.name);
    this.address = ko.observable(data.location.formattedAddress[0] + ' ' + data.location.formattedAddress[1] + ' ' + data.location.formattedAddress[2]);
    this.category = ko.observable(data.categories[0].shortname);
    this.lat = ko.observable(data.location.lat);
    this.lng = ko.observable(data.location.lng);
};

var ViewModel = function() {

    var self = this;

    this.venuesList = ko.observableArray([]);
    this.mapLocation = ko.observable("98005");    // Initial value
    this.query = ko.observable(''); // Initial selection
    this.queryResults = ko.observableArray([]);

    updateList = function() {
        // Setting the query paramters to FourSquare to retrive the venues list
        var foursquareClientID = 'KJXASR1JSSF2WM4CESIZ2IFICH2ELPXK1WXE1T4FBQ1A5H5X';
        var foursquareClientSecret = '0G1MUWJDN3P5GNYWLAVC12SNTBE1TZTPANYPHWMLMT3LRSB4';
        var foursquareSearchURI = 'https://api.foursquare.com/v2/venues/search';
        var forsquareSearchParms = {
            'client_id' : foursquareClientID,
            'client_secret' : foursquareClientSecret,
            'near' : self.mapLocation,
            'intent' : 'browse',
             // 'query': self.foodCategory,
            'categoryId': '4d4b7105d754a06374d81259', //looking for the Food Category
            'v' : '20170101'
        };
        $.ajax ({
            // Ajex call to get the JSON list of relevant venues
            type: "GET",
            url: foursquareSearchURI,
            dataType: 'json',
            async: true,
            data: forsquareSearchParms,
            success: function(data){
                // console.log(data);
                self.venuesList.removeAll();
                data.response.venues.forEach(function (venueItem){
                    self.venuesList.push(new venue(venueItem));

                });
                $('#myalert').hide();
              },
              error: function(e) {
                  $('#myalert').show();
              },
            });

        };

    this.searchResults = ko.computed(function () {
        if (this.query()) {
            var search = this.query().toLowerCase();
            this.queryResults = ko.utils.arrayFilter(this.venuesList(), function (venueItem) {
                return venueItem.name().toLowerCase().indexOf(search) >= 0;
            });
        } else {
            this.queryResults = self.venuesList();
        }
        showListings(ko.toJS(this.queryResults));
        // console.log(ko.toJS(this.queryResults));
        return this.queryResults;
    }, this, {deferEvaluation: true});

    this.currentVenue = ko.observable( self.queryResults[0]);
    this.setVenue = function(clickedVenue) {
        // adding listener to each venue. ipon click firing the associated map marke
        self.currentVenue(clickedVenue);
        populateInfoWindow(markers[self.queryResults.indexOf(clickedVenue)]);
    };

};

ko.applyBindings(new ViewModel());
