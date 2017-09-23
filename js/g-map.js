// Google Maps Functions

      var map;


      // Create a new blank array for all the  markers.
      var markers = [];

      function initMap() {
        // Constructor creates a new map - only center and zoom are required.
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 47.618973, lng: -122.180964},
          zoom: 13,
          mapTypeControl: false
        });
    }

      // This function populates the infowindow when the marker is clicked. We'll only allow
      // one infowindow which will open at the marker that is clicked, and populate based
      // on that markers position.
      function populateInfoWindow(marker) {
         var infowindow = new google.maps.InfoWindow();
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker !== marker) {
          infowindow.marker = marker;
          infowindow.setContent('<div>' + marker.title + '</div>');
          infowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
          });
      }
    }

      // This function will loop through the markers array and display them all.
      function showListings(queryResults) {

          var largeInfowindow = new google.maps.InfoWindow();
          //console.log(searchResults)

          //Delete previous markers from the map
          hideListings();

          // The following group uses the Observable venueList to create an array of markers when the list of venues is updated.
          for (var i = 0; i < queryResults.length; i++) {
            // Get the position from the location array.
            var position  = {
                lat : queryResults[i].lat,
                lng : queryResults[i].lng
            };
            var title = queryResults[i].name;

            // Create a marker per location, and put into markers array.
             var marker = new google.maps.Marker({
              position: position,
              title: title,
              animation: google.maps.Animation.DROP,
              id: i
            });
            // Push the marker to our array of markers.
            //console.log(marker)
            markers.push(marker);
            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
              populateInfoWindow(this);
            });
        }

        var bounds = new google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(map);
          bounds.extend(markers[i].position);
      }
        map.fitBounds(bounds);
      }

      // This function will loop through the listings and hide them all.
      function hideListings() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers.length = 0;
      }
