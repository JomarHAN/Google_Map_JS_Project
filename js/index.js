var map;
var markers = [];
var infoWindow;
function initMap() {
    var losAngeles = {
        lat: 34.063380,
        lng: -118.358080
    }
    var styledMapType = new google.maps.StyledMapType(
      [
        {elementType: 'geometry', stylers: [{color: '#ebe3cd'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#523735'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#f5f1e6'}]},
        {
          featureType: 'administrative',
          elementType: 'geometry.stroke',
          stylers: [{color: '#c9b2a6'}]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'geometry.stroke',
          stylers: [{color: '#dcd2be'}]
        },
        {
          featureType: 'administrative.land_parcel',
          elementType: 'labels.text.fill',
          stylers: [{color: '#ae9e90'}]
        },
        {
          featureType: 'landscape.natural',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#93817c'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry.fill',
          stylers: [{color: '#a5b076'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#447530'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#f5f1e6'}]
        },
        {
          featureType: 'road.arterial',
          elementType: 'geometry',
          stylers: [{color: '#fdfcf8'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#f8c967'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#e9bc62'}]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry',
          stylers: [{color: '#e98d58'}]
        },
        {
          featureType: 'road.highway.controlled_access',
          elementType: 'geometry.stroke',
          stylers: [{color: '#db8555'}]
        },
        {
          featureType: 'road.local',
          elementType: 'labels.text.fill',
          stylers: [{color: '#806b63'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.fill',
          stylers: [{color: '#8f7d77'}]
        },
        {
          featureType: 'transit.line',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#ebe3cd'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'geometry',
          stylers: [{color: '#dfd2ae'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry.fill',
          stylers: [{color: '#b9d3c2'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#92998d'}]
        }
      ],
      {name: 'Styled Map'});

  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  map = new google.maps.Map(document.getElementById('map'), {
    center: losAngeles,
    zoom: 8,
    mapTypeControlOptions: {
      mapTypeIds: ['roadmap', 'satellite', 'hybrid', 'terrain',
              'styled_map']
    }
  });

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('styled_map', styledMapType);
  map.setMapTypeId('styled_map');


    infoWindow = new google.maps.InfoWindow();
    searchStores();
    
}

function searchStores(){
  var foundStores = [];
  var zipCode = document.getElementById('zip-code').value;
  if (zipCode) {
    stores.forEach(function(store){
      var postal = store.address.postalCode.substring(0,5);
      if (postal==zipCode) {
        foundStores.push(store)
      }
    });
  } else{
    foundStores = stores
  }
  clearLocation()
  displayStore(foundStores);
  showStoresMarkers(foundStores)
  setOnClickListener();

}


function clearLocation(){
  infoWindow.close();
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    markers.length = 0;
}

function setOnClickListener(){
  var storeElement = document.querySelectorAll('.list-des ul li')
  storeElement.forEach(function(elem,index){
    elem.addEventListener('click',function(){
      google.maps.event.trigger(markers[index],'click')
    })
  })
}

function displayStore(stores){
    var storesHtml = "";
    stores.forEach(function(store,index){
        const address = store.addressLines;
        storesHtml += `
        <li>
        <div class="row-1">
          <div class="address">
            <div class="suite">${address[0]}</div>
            <div class="zone">${address[1]}</div>
            <div class="phone">${store.phoneNumber}</div>
          </div>
          <div class="mark-num">${index+1}</div>
        </div>              
      </li>
        `
    });
    document.querySelector('.list-des ul').innerHTML = storesHtml
}

function showStoresMarkers(stores){
    var bounds = new google.maps.LatLngBounds();
    stores.forEach(function(store,index){
        var latlng = new google.maps.LatLng(
            store.coordinates.latitude,
            store.coordinates.longitude
        );
        var name = store.name;
        var address = store.addressLines[0];
        var stateAddress = store.addressLines[1];
        var time = store.openStatusText;
        var phoneNumber = store.phoneNumber;
        bounds.extend(latlng);
        createMarker(latlng,name,address,time,phoneNumber,stateAddress,index)
    })
    map.fitBounds(bounds);
}

function createMarker(latlng,name,address,time,phoneNumber,stateAddress,index) {
    var html =  `<div class="window-info">
    <h4 class="name">${name}</h4>
    <div class="open-time">${time}</div>
    <hr>
    <div class="address-link">
      <div class="logo">
       <i class="fas fa-directions"></i>
      </div> 
     <a class="inside" href="https://www.google.com/maps/dir/?api=1&origin=3936+Abernathy+Farm+Way+Northwest,+Acworth,+Georgia&destination=${address},${stateAddress}">${address}</a>
    </div>
    <div class="contact">
      <div class="logo">
       <i class="fa fa-phone fa-flip-horizontal"></i>
      </div>
     <div class="inside">${phoneNumber}</div>
    </div>
  </div>`;

    var coffeeMarker = {
      url:'http://maps.google.com/mapfiles/kml/pal2/icon62.png',
      size: new google.maps.Size(40, 40),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(40, 40)
    }

    var marker = new google.maps.Marker({
      map: map,
      position: latlng,
      icon: coffeeMarker,
      label:`${index+1}`
    });
    google.maps.event.addListener(marker, 'click', function() {
      infoWindow.setContent(html);
      infoWindow.open(map, marker);
      
    });
    markers.push(marker);
  }

