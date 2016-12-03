window.onload = function() {

 

  //initializing  
  var openMultiMap = $('<input id="openMulti" type="button" value="Open Multimap-Polygon Widget">').click(function(){
    openWidget();
  });
  $('#multimap').append(openMultiMap);
  
  //dark popup background
  var popupDarkBg = document.createElement('div'); 
  popupDarkBg.className = 'multimap-popup';

  //button close
  var closeBtn = document.createElement('div'); 
  closeBtn.id = 'closeMultiMap';


  //add new map button
  var addMapBtn = document.createElement('input');
  addMapBtn.id = 'addMap';
  addMapBtn.setAttribute('type', 'button');
  addMapBtn.value = '+ Add Map';

  //creating widget container
  var multiPolyContainer = document.createElement('div');
  multiPolyContainer.id = 'multimap-polygon-container';
  multiPolyContainer.appendChild(closeBtn)
  multiPolyContainer.appendChild(addMapBtn);

  //popupDarkBg.appendChild(closeBtn);
  popupDarkBg.appendChild(multiPolyContainer);

  //open widget
  function openWidget() {
  document.getElementById('multimap').appendChild(popupDarkBg);
    if(!(document.querySelectorAll('.map-container').length)){
      addNew();
    };
  };

  //close widget
  function closeWidget() {
    document.getElementById('multimap').removeChild(popupDarkBg);
  };

  /*adding new map
  _________________________________________*/
  function addNew() {

    //creating elements
    var mapContainer = document.createElement('div');
    var floatingPanel = document.createElement('div');
    var mapCanvas = document.createElement('div');

    //creating buttons
    var removeSelected = document.createElement('input');
    var removeAll = document.createElement('input');
    var startCreating = document.createElement('input');
    var polyCoordsExport = document.createElement('input');

    //creating export area
    var coords = document.createElement('p');

    //creating import area
    var importContainer = document.createElement('div');
    var importArea = document.createElement('textarea');
    var polyCoordsImport = document.createElement('input');

    //adding id
    mapContainer.id = 'map' + (document.querySelectorAll('.map-container').length + 1);

    //adding classes
    mapContainer.className = 'map-container';
    floatingPanel.className = 'floating-panel';
    mapCanvas.className = 'map';

    removeSelected.className = 'removeSelected';
    removeSelected.setAttribute('type', 'button');
    removeSelected.value = 'Remove Selected';

    removeAll.className = 'removeAll';
    removeAll.setAttribute('type', 'button');
    removeAll.value = 'Remove All';

    startCreating.className = 'startCreating';
    startCreating.setAttribute('type', 'button');
    startCreating.value = 'Start Creating Polygons';

    polyCoordsExport.className = 'polyCoordsExport';
    polyCoordsExport.setAttribute('type', 'button');
    polyCoordsExport.value = 'Export';

    coords.className = 'coords';

    importContainer.className = 'import';

    importArea.className = 'importArea';
    importArea.setAttribute('placeholder', 'import here');

    polyCoordsImport.className = 'polyCoordsImport';
    polyCoordsImport.setAttribute('type', 'button');
    polyCoordsImport.value = 'Import';

    //constructing
    mapContainer.appendChild(floatingPanel);
    mapContainer.appendChild(mapCanvas);
    floatingPanel.appendChild(removeSelected);
    floatingPanel.appendChild(removeAll);
    floatingPanel.appendChild(startCreating);
    floatingPanel.appendChild(polyCoordsExport);
    floatingPanel.appendChild(importContainer);
    floatingPanel.appendChild(coords);
    importContainer.appendChild(importArea);
    importContainer.appendChild(polyCoordsImport);

    document.getElementById('multimap-polygon-container').appendChild(mapContainer);

    //creating map
    initMap(mapContainer.id);

  };

  //starting work with widget
  $('#openMultiMap').onclick = function(){
    openWidget();

  };

  //closing widget popup
  closeBtn.onclick = function(){
    closeWidget();
  };

  //adding new map
  addMapBtn.onclick = function(){
    addNew();
  };

  /*map initializing
  _________________________________________*/  
  function initMap(cMap) {

    //if finding user position was allowed in chrome locally:

    /*var mapCenter = {};
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function(position) {
        mapCenter.lat = position.coords.latitude;
        mapCenter.lng = position.coords.longitude;
      });
    } else {
      mapCenter = {lat: 53.884296, lng: 27.532348};
    };*/
    
    //initial center of map, it's your office in Minsk, but it should be a the place where user is.
    var mapCenter = {lat: 53.884296, lng: 27.532348};

    var map = new google.maps.Map(document.querySelectorAll('#'+ cMap + ' > .map')[0], {
      zoom: 12,
      center: mapCenter
    });

    //defining an array for future polygon points
    var currentPolyCoords = [];

    //defining an array of all polygons
    var totalPolygons = [];

    //Function for collecting coordinates of cliks and pushing them into array.
    function setCoordinates(arr){
        currentPolyCoords = totalPolygons[totalPolygons.length - 1].getPath();
        currentPolyCoords.push(arr.latLng);   
    };

    //getting click coordinates
    map.addListener('click', function(e){
      var coordinatesLtLng = e;
      setCoordinates(coordinatesLtLng);
    });

    var startCreating = document.querySelectorAll('#'+ cMap + ' .startCreating')[0];//закидываем кноку в переменную, чтобы можно было использовать в функции

    //Polygon Options
    var polygonOptions = {
          fillColor: '#ff6000',
          fillOpacity: 0.8,
          strokeWeight: 5,
          clickable: true,
          editable: true,
          draggable:false,
          selectedByMe: false,
          removedByMe: true,
          pathsToExport: [],
          zIndex: 1
    };

    //Listener for button to draw polygon
    google.maps.event.addDomListener(startCreating, 'click', function() {

      //new polygon in the array of all polygons
      totalPolygons[totalPolygons.length] = new google.maps.Polygon(polygonOptions); 

      //setting it on map
      totalPolygons[totalPolygons.length - 1].setMap(map);
      totalPolygons[totalPolygons.length - 1].removedByMe = false;

      //adding listener for polygon
      totalPolygons[totalPolygons.length - 1].addListener('click', function(){

      
      var thisPoly = this;

      //if not selected - it becomes green
      if(thisPoly.selectedByMe){
        thisPoly.setOptions({fillColor: '#ff6000', draggable:false, selectedByMe: false});
      }else{
        for (var i = 0; i < totalPolygons.length; i++) {
          if(totalPolygons[i].selectedByMe){
            totalPolygons[i].setOptions({fillColor: '#ff6000', draggable:false, selectedByMe: false});
          };
        }
        thisPoly.setOptions({fillColor: '#00ff00', draggable:true, selectedByMe: true});
      };

      });
        
    });
    
    //function for removing selected polygon (by adding special property, it still in the array)
    var removeSelected = document.querySelectorAll('#'+ cMap + ' .removeSelected')[0];
    google.maps.event.addDomListener(removeSelected, 'click', function() {
      for (var i = 0; i < totalPolygons.length; i++) {
        if(totalPolygons[i].selectedByMe){
          totalPolygons[i].removedByMe = true;
          totalPolygons[i].setMap(null);
        }
      }
    });

    //function for removing all polygons, and emptying the array
    var removeAll = document.querySelectorAll('#'+ cMap + ' .removeAll')[0];
    google.maps.event.addDomListener(removeAll, 'click', function() {
      for (var i = 0; i < totalPolygons.length; i++) {
          totalPolygons[i].setMap(null);
      }
      totalPolygons = [];
    });

    //function for export
    var polyCoordsExport = document.querySelectorAll('#'+ cMap + ' .polyCoordsExport')[0];
    google.maps.event.addDomListener(polyCoordsExport, 'click', function() {
      var textarea = document.querySelectorAll('#'+ cMap + ' .coords')[0];
      textarea.innerHTML = '{ ';

      for (var i = 0; i < totalPolygons.length; i++) {
        if(!totalPolygons[i].removedByMe){

          var trident = totalPolygons[i].getPath().getArray();
          var testtrident = JSON.stringify(trident);
          var result = '';
          for(var z = 0; z < trident.length; z++ ){
            var dotCoords = trident[z].toJSON();
            var testLatLng = JSON.stringify(dotCoords);
            if(z < trident.length - 1){
              result += (testLatLng + ',<br>');
            }else{
              result += (testLatLng + '<br>');
            };
          };


          
          if(i < totalPolygons.length - 1){
              textarea.innerHTML += '<b>"polygon' + i + '":</b> [ ' + '<br>' + result + '],<br> ';
            }else{
              textarea.innerHTML += '<b>"polygon' + i + '":</b> [ ' + '<br>' + result + ']<br> ';
            };
        };
      };

      textarea.innerHTML += ' }'

    });
    
    //function for import
    var polyCoordsImport = document.querySelectorAll('#'+ cMap + ' .polyCoordsImport')[0];
    var importArea = document.querySelectorAll('#'+ cMap + ' .importArea')[0];
    google.maps.event.addDomListener(polyCoordsImport, 'click', function() {

      if(totalPolygons.length){
        if (confirm("there are polygons on the map, delete them?")) {
          for (var i = 0; i < totalPolygons.length; i++) {
                totalPolygons[i].setMap(null);
            }
            totalPolygons = [];
        } else {
          
        };            
      };

      var normalPaths = JSON.parse(importArea.value);

      for(var k in normalPaths) {
          totalPolygons[totalPolygons.length] = new google.maps.Polygon(polygonOptions);
          totalPolygons[totalPolygons.length - 1].setOptions({paths: normalPaths[k]});
          totalPolygons[totalPolygons.length - 1].setMap(map);
          totalPolygons[totalPolygons.length - 1].removedByMe = false;
          totalPolygons[totalPolygons.length - 1].addListener('click', function(){
            var thisPoly = this;
            if(thisPoly.selectedByMe){
              thisPoly.setOptions({fillColor: '#ff6000', draggable:false, selectedByMe: false});
            }else{
              for (var i = 0; i < totalPolygons.length; i++) {
                if(totalPolygons[i].selectedByMe){
                  totalPolygons[i].setOptions({fillColor: '#ff6000', draggable:false, selectedByMe: false});
                };
              }
              thisPoly.setOptions({fillColor: '#00ff00', draggable:true, selectedByMe: true});
            };
          });

      };
      
    });//end import
   

  };//end init map

 };//end