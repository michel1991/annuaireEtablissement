var coordonnees = [];
var zoneMarqueurs = new google.maps.LatLngBounds();
var tableauxMarqueurs = [];
map=null;
$(function() {

  $("#myTable1").css({
    'border-top': '0px solid #ddd'
  }); //pour enlever la ligne en haut du tableau utiliser ceci cette propriété
  /*
      CONSTRUCTION DU TABLEAU AFIN DE RESERVOIR LES DONNEES DE LA RECHERCHE
  */
  var $tableB = $('#tableEtablissements').bootstrapTable({
    pagination: true,
    search: true,
    locale: 'fr-FR',
    halign: "center",
    pageSize: 8,
    sidePagination: 'client',
    pageNumber: 1

  });

  var uai = "";
  var nomEtablissement = "",
    conditionRegion = '',
    conditionAcademie = '',
    conditionTutelle = '',
    conditionSigle = '',
    conditionUniversite = '';
  var conditionStatut = '',
    conditionType = '',
    conditionUAI = '',
    conditionNomEtab = '',
    urlT = '';

  var optionRegions = [],
    optionAcademie = [],
    optionTutelle = [],
    optionSigle = [],
    optionUniversite = [],
    optionStatut = [];
  var optionType = [],
    optionUAI = [],
    dataEtabCarte = [];
  $("#region").select2({
    placeholder: "Saisir une région",
    language: "fr"

  });

  /*
    COMPOSANT POUR LES DONNEES DES ETABLISSEMENTS
  */
  var $ms = $('#nomE').magicSuggest({
    placeholder: "Etablissement",
    maxSelection: 10,
    noSuggestionText: 'aucun établissement',
    sortOrder: 'name'
  });

  /*
     EVENEMENT SUR LE TAB CARTE ET RECUPERATION DE TOUS LES ETABLISSEMENTS COCHES
  */
  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    var target = $(e.target).attr("href"); // activated tab
    if (target == '#panel-carte') {
      var dataSelected = $tableB.bootstrapTable('getAllSelections');
        supprimerTousLesMarquers();
        coordonnees=[];

        for(var i =0; i<dataSelected.length; i++)
        {
            coordonnees.push({
                lat:dataSelected[i].latitude,
                lng:dataSelected[i].longitude
                /*cp:dataSelected[i].cp,
                name2:dataSelected[i].name,
                adresseEtab:dataSelected[i].adresseEtab*/
            });
        }
      // console.log(dataSelected);
        appliqueAjouterMarker();
    }
  });
  /*
     MAGIC SUGGEST POUR LE UAI ETABLISSEMENT
  */
  var $uaiMs = $('#uai').magicSuggest({
    placeholder: "UAI",
    maxSelection: 10,
    noSuggestionText: 'aucun uai',
    sortOrder: 'name'
  });


  /*
    trigger sur le nom des etablissements
  */
  $($ms).on('triggerclick', function(c) {
    manager(true);
    var suggest = this;

    if ($("#myJocker").val() != 'import module namespace functx = "http://www.functx.com";  functx:distinct-nodes(db:open("etablissement_superieur")//etablissement)') //
    {
      $.ajax({
        url: "/controller/expandEtablissement",
        dataType: 'json',
        data: {
          jocker: $("#myJocker").val()
        },
        success: function(data) {
          // console.log(data);
          if (data.length > 0) {
            suggest.setData(data);
            var dataMin = modifyData(data);
            $uaiMs.setData(dataMin);
          } else {
            suggest.setData([]);
            $uaiMs.setData([]);
          }
        }
      });
    }

  });


  $("#statut").select2({
    placeholder: "Saisir un statut",
    language: "fr"

  });

  $("#univ").select2({
    placeholder: "Choisir une université",
    language: "fr"

  });

  $("#tutelle").select2({
    placeholder: "Choisir une tutelle",
    language: "fr"

  });

  $("#type").select2({
    placeholder: "Choisir un type",
    language: "fr"

  });

  $("#academie").select2({
    placeholder: "Choisir une académie",
    language: "fr"

  });

  $("#sigle").select2({
    placeholder: "Choisir un sigle",
    language: "fr"

  });

  $.getJSON("/controller/region", function(data) {
    var items = [];
    $('#region option').remove();
    $.each(data, function(key, val) {
      $('#region').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#region').select2().trigger('change');
  });

  $.getJSON("/controller/academie", function(data) {
    var items = [];
    $('#academie option').remove();
    $.each(data, function(key, val) {
      $('#academie').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#academie').select2().trigger('change');
  });

  $.getJSON("/controller/tutelle", function(data) {
    var items = [];
    $('#tutelle option').remove();
    $.each(data, function(key, val) {
      $('#tutelle').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#tutelle').select2().trigger('change');
  });

  $.getJSON("/controller/sigle", function(data) {
    var items = [];
    $('#sigle option').remove();
    $.each(data, function(key, val) {
      $('#sigle').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#sigle').select2().trigger('change');
  });

  $.getJSON("/controller/universite", function(data) {
    var items = [];
    $('#univ option').remove();
    $.each(data, function(key, val) {
      $('#univ').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#univ').select2().trigger('change');
  });

  $.getJSON("/controller/statut", function(data) {
    var items = [];
    $('#statut option').remove();
    $.each(data, function(key, val) {
      $('#statut').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#statut').select2().trigger('change');
  });

  $.getJSON("/controller/type", function(data) {
    var items = [];
    //$('#type option').remove();
    $.each(data, function(key, val) {
      $('#type').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#type').select2().trigger('change');
  });

  /*JUST FOR EVENT BECAUSE I WOULID LIKE TO FORM MY REQUEST IN BASEX WITH OPTION SELECT BY USER*/
  $("#region").on("change", function() {});

  /*
       CLICK SUR LE BOUTON RECHERCHE EVENT
   */
  $('#look').click(function() {
    manager(false);
    //console.log("recherche");
    $('#loadingI').show();
    $.ajax({
      url: "/controller/expandEtablissement",
      dataType: 'json',
      data: {
        jocker: $("#myJocker").val()
      },
      success: function(data) {
        //console.log("reponse look"+ data);
        managerEtablissement(data);
        $('#loadingI').hide();
      }
    });
  });

  /*
     fonction permettant de faire les recherches
   */
  function manager(whichJob) {
    optionRegions = $("#region").val();
    optionAcademie = $("#academie").val();
    optionTutelle = $("#tutelle").val();
    optionSigle = $("#sigle").val();

    optionUniversite = $("#univ").val();
    optionStatut = $("#statut").val();
    optionType = $("#type").val();
    var tabSelectionUai = $uaiMs.getSelection();

    var tabCondition = [];
    urlT = "";


    conditionUAI = "";
    conditionNomEtab = "";
    if (tabSelectionUai.length > 0) // uai.length
    {
      conditionUAI = 'UAI=(';
      for (var i = 0; i < tabSelectionUai.length; i++) {
        if (i + 1 != tabSelectionUai.length) {
          conditionUAI += '"' + (tabSelectionUai[i].name).toUpperCase() + '",';
        } else {
          conditionUAI += '"' + (tabSelectionUai[i].name).toUpperCase() + '"';
        }
      }
      conditionUAI += ')';
      tabCondition.push(conditionUAI);
    }


    //console.log(typeof $("#uai").val() + " valeur");
    conditionRegion = "";
    if (optionRegions !== null) {
      conditionRegion = "region=(";
      for (var i = 0; i < optionRegions.length; i++) {
        if (i + 1 != optionRegions.length) {
          conditionRegion += '"' + optionRegions[i] + '",'
        } else {
          conditionRegion += '"' + optionRegions[i] + '"'
        }
      }
      conditionRegion += ')';
      // console.log(conditionRegion);
      tabCondition.push(conditionRegion);
    }

    conditionAcademie = "";
    if (optionAcademie !== null) {
      conditionAcademie = "academie=(";
      for (var i = 0; i < optionAcademie.length; i++) {
        if (i + 1 != optionAcademie.length) {
          conditionAcademie += '"' + optionAcademie[i] + '",'
        } else {
          conditionAcademie += '"' + optionAcademie[i] + '"'
        }
      }
      conditionAcademie += ')';
      //console.log(conditionAcademie);
      tabCondition.push(conditionAcademie);
    }


    conditionTutelle = "";
    if (optionTutelle !== null) {
      conditionTutelle = "tutelle=(";
      for (var i = 0; i < optionTutelle.length; i++) {
        if (i + 1 != optionTutelle.length) {
          conditionTutelle += '"' + optionTutelle[i] + '",'
        } else {
          conditionTutelle += '"' + optionTutelle[i] + '"'
        }
      }
      conditionTutelle += ')';
      tabCondition.push(conditionTutelle);
      // console.log(conditionTutelle);
    }

    conditionSigle = "";
    if (optionSigle !== null) {
      conditionSigle = "sigle=(";
      for (var i = 0; i < optionSigle.length; i++) {
        if (i + 1 != optionSigle.length) {
          conditionSigle += '"' + optionSigle[i] + '",'
        } else {
          conditionSigle += '"' + optionSigle[i] + '"'
        }
      }
      conditionSigle += ')';
      //console.log(conditionSigle);
      tabCondition.push(conditionSigle);
    }


    conditionUniversite = "";
    if (optionUniversite !== null) {
      conditionUniversite = "universite=(";
      for (var i = 0; i < optionUniversite.length; i++) {
        if (i + 1 != optionUniversite.length) {
          conditionUniversite += '"' + optionUniversite[i] + '",'
        } else {
          conditionUniversite += '"' + optionUniversite[i] + '"'
        }
      }
      conditionUniversite += ')';
      //console.log(conditionUniversite);
      tabCondition.push(conditionUniversite);
    }

    conditionStatut = "";
    if (optionStatut !== null) {
      conditionStatut = "statut=(";
      for (var i = 0; i < optionStatut.length; i++) {
        if (i + 1 != optionStatut.length) {
          conditionStatut += '"' + optionStatut[i] + '",'
        } else {
          conditionStatut += '"' + optionStatut[i] + '"'
        }
      }
      conditionStatut += ')';
      //console.log(conditionStatut);
      tabCondition.push(conditionStatut);
    }


    conditionType = "";
    if (optionType !== null) {
      conditionType = "type=(";
      for (var i = 0; i < optionType.length; i++) {
        if (i + 1 != optionType.length) {
          conditionType += '"' + optionType[i] + '",'
        } else {
          conditionType += '"' + optionType[i] + '"'
        }
      }
      conditionType += ')';
      tabCondition.push(conditionType);
      //console.log(conditionType);
    }

    if (whichJob) {
      if (tabCondition.length > 0) {
        urlT += 'import module namespace functx = "http://www.functx.com";  functx:distinct-nodes(db:open("etablissement_superieur")//etablissement[';
        for (var i = 0; i < tabCondition.length; i++) {
          if (i + 1 != tabCondition.length) {
            urlT += tabCondition[i] + " and ";
          } else {
            urlT += tabCondition[i];
          }
        }
        urlT += "])"
      } else {
        urlT += 'import module namespace functx = "http://www.functx.com";  functx:distinct-nodes(db:open("etablissement_superieur")//etablissement)';
      }
    } else if (!whichJob) {
      var tabSelectionEtablissements = $ms.getSelection();
      if (tabSelectionEtablissements.length > 0) {
        conditionNomEtab = 'nom=(';
        for (var i = 0; i < tabSelectionEtablissements.length; i++) {
          if (i + 1 != tabSelectionEtablissements.length) {
            conditionNomEtab += '"' + tabSelectionEtablissements[i].name + '",';
          } else {
            conditionNomEtab += '"' + tabSelectionEtablissements[i].name + '"';
          }
        }
        conditionNomEtab += ')';
        tabCondition.push(conditionNomEtab);
      }

      if (tabCondition.length > 0) {
        urlT += 'import module namespace functx = "http://www.functx.com";  functx:distinct-nodes(db:open("etablissement_superieur")//etablissement[';
        for (var i = 0; i < tabCondition.length; i++) {
          if (i + 1 != tabCondition.length) {
            urlT += tabCondition[i] + " and ";
          } else {
            urlT += tabCondition[i];
          }
        }
        urlT += "])"
      } else {
        urlT += 'import module namespace functx = "http://www.functx.com";  functx:distinct-nodes(db:open("etablissement_superieur")//etablissement)';
      }

    }


    $("#myJocker").val(urlT);
    // console.log('url ' + $("#myJocker").val());
  }

  function managerEtablissement(dataEtab) {
    $tableB.bootstrapTable('removeAll');
    dataEtabCarte = [];
    dataEtabCarte = dataEtab;
    for (var i = 0; i < dataEtab.length; i++) {
      $tableB.bootstrapTable('insertRow', {
        index: i + 1,
        row: {
          state: false,
          uai: dataEtab[i].id,
          name: dataEtab[i].name,
          type: dataEtab[i].typeEtab,
          sigle: dataEtab[i].sigle,
          tutelle: dataEtab[i].tutelle,
          adresse: dataEtab[i].adresseEtab,
          longitude: parseFloat(dataEtab[i].longitude),
          latitude: parseFloat(dataEtab[i].latitude),
            cp: dataEtab[i].cp
        }
      });

    }
    $tableB.bootstrapTable('refresh');
  }


  // Gestion des statistiques

});


$(function() {

  $("#myTable1").css({
    'border-top': '0px solid #ddd'
  }); //pour enlever la ligne en haut du tableau utiliser ceci cette propriété
  /*
      CONSTRUCTION DU TABLEAU AFIN DE RESERVOIR LES DONNEES DE LA RECHERCHE
  */
  var $tableB = $('#tableEtablissements').bootstrapTable({
    pagination: true,
    search: true,
    locale: 'fr-FR',
    halign: "center",
    pageSize: 8,
    sidePagination: 'client',
    pageNumber: 1

  });

  var uai = "";
  var nomEtablissement = "",
    conditionRegion = '',
    conditionAcademie = '',
    conditionTutelle = '',
    conditionSigle = '',
    conditionUniversite = '';
  var conditionStatut = '',
    conditionType = '',
    conditionUAI = '',
    conditionNomEtab = '',
    urlT = '';

  var optionRegions = [],
    optionAcademie = [],
    optionTutelle = [],
    optionSigle = [],
    optionUniversite = [],
    optionStatut = [];
  var optionType = [],
    optionUAI = [],
    dataEtabCarte = [];
  $("#region").select2({
    placeholder: "Saisir une région",
    language: "fr"

  });

  /*
    COMPOSANT POUR LES DONNEES DES ETABLISSEMENTS
  */
  var $ms = $('#nomE').magicSuggest({
    placeholder: "Etablissement",
    maxSelection: 10,
    noSuggestionText: 'aucun établissement',
    sortOrder: 'name'
  });

  /*
     EVENEMENT SUR LE TAB CARTE ET RECUPERATION DE TOUS LES ETABLISSEMENTS COCHES
  */
  $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
    var target = $(e.target).attr("href"); // activated tab
    if (target == '#panel-carte') {
      var dataSelected = $tableB.bootstrapTable('getAllSelections');
      coordonnees = [];

      //console.log(dataSelected);
    }
  });
  /*
     MAGIC SUGGEST POUR LE UAI ETABLISSEMENT
  */
  var $uaiMs = $('#uai').magicSuggest({
    placeholder: "UAI",
    maxSelection: 10,
    noSuggestionText: 'aucun uai',
    sortOrder: 'name'
  });


  /*
    trigger sur le nom des etablissements
  */
  $($ms).on('triggerclick', function(c) {
    manager(true);
    var suggest = this;

    if ($("#myJocker").val() != 'import module namespace functx = "http://www.functx.com";  functx:distinct-nodes(db:open("etablissement_superieur")//etablissement)') //
    {
      $.ajax({
        url: "/controller/expandEtablissement",
        dataType: 'json',
        data: {

          jocker: $("#myJocker").val()
        },
        success: function(data) {
          //console.log(data);
          if (data.length > 0) {
            suggest.setData(data);
            var dataMin = modifyData(data);
            $uaiMs.setData(dataMin);
          } else {
            suggest.setData([]);
            $uaiMs.setData([]);
          }
        }
      });
    }

  });


  $("#statut").select2({
    placeholder: "Saisir un statut",
    language: "fr"

  });

  $("#univ").select2({
    placeholder: "Choisir une université",
    language: "fr"

  });

  $("#tutelle").select2({
    placeholder: "Choisir une tutelle",
    language: "fr"

  });

  $("#type").select2({
    placeholder: "Choisir un type",
    language: "fr"

  });

  $("#academie").select2({
    placeholder: "Choisir une académie",
    language: "fr"

  });

  $("#sigle").select2({
    placeholder: "Choisir un sigle",
    language: "fr"

  });

  $.getJSON("/controller/region", function(data) {
    var items = [];
    $('#region option').remove();
    $.each(data, function(key, val) {
      $('#region').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#region').select2().trigger('change');
  });

  $.getJSON("/controller/academie", function(data) {
    var items = [];
    $('#academie option').remove();
    $.each(data, function(key, val) {
      $('#academie').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#academie').select2().trigger('change');
  });

  $.getJSON("/controller/tutelle", function(data) {
    var items = [];
    $('#tutelle option').remove();
    $.each(data, function(key, val) {
      $('#tutelle').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#tutelle').select2().trigger('change');
  });

  $.getJSON("/controller/sigle", function(data) {
    var items = [];
    $('#sigle option').remove();
    $.each(data, function(key, val) {
      $('#sigle').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#sigle').select2().trigger('change');
  });

  $.getJSON("/controller/universite", function(data) {
    var items = [];
    $('#univ option').remove();
    $.each(data, function(key, val) {
      $('#univ').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#univ').select2().trigger('change');
  });

  $.getJSON("/controller/statut", function(data) {
    var items = [];
    $('#statut option').remove();
    $.each(data, function(key, val) {
      $('#statut').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#statut').select2().trigger('change');
  });

  $.getJSON("/controller/type", function(data) {
    var items = [];
    //$('#type option').remove();
    $.each(data, function(key, val) {
      $('#type').append('<option value="' + val.name + '">' + val.name + '</option>');
    });
    $('#type').select2().trigger('change');
  });

  /*JUST FOR EVENT BECAUSE I WOULID LIKE TO FORM MY REQUEST IN BASEX WITH OPTION SELECT BY USER*/
  $("#region").on("change", function() {});

  /*
       CLICK SUR LE BOUTON RECHERCHE EVENT
   */
  $('#look').click(function() {
    manager(false);
    //console.log("recherche");
    $('#loadingI').show();
    $.ajax({
      url: "/controller/expandEtablissement",
      dataType: 'json',
      data: {

        jocker: $("#myJocker").val()
      },
      success: function(data) {
        //console.log("reponse look"+ data);
        managerEtablissement(data);
        $('#loadingI').hide();
      }
    });
  });

  /*
     fonction permettant de faire les recherches
   */
  function manager(whichJob) {
    optionRegions = $("#region").val();
    optionAcademie = $("#academie").val();
    optionTutelle = $("#tutelle").val();
    optionSigle = $("#sigle").val();

    optionUniversite = $("#univ").val();
    optionStatut = $("#statut").val();
    optionType = $("#type").val();
    var tabSelectionUai = $uaiMs.getSelection(); //generer un exception flat ne supprimer pas ce commentaire

    var tabCondition = [];
    urlT = "";


    conditionUAI = "";
    conditionNomEtab = "";
    if (tabSelectionUai.length > 0) // uai.length
    {
      conditionUAI = 'UAI=(';
      for (var i = 0; i < tabSelectionUai.length; i++) {
        if (i + 1 != tabSelectionUai.length) {
          conditionUAI += '"' + (tabSelectionUai[i].name).toUpperCase() + '",';
        } else {
          conditionUAI += '"' + (tabSelectionUai[i].name).toUpperCase() + '"';
        }
      }
      conditionUAI += ')';
      tabCondition.push(conditionUAI);
    }


    //console.log(typeof $("#uai").val() + " valeur");
    conditionRegion = "";
    if (optionRegions !== null) {
      conditionRegion = "region=(";
      for (var i = 0; i < optionRegions.length; i++) {
        if (i + 1 != optionRegions.length) {
          conditionRegion += '"' + optionRegions[i] + '",'
        } else {
          conditionRegion += '"' + optionRegions[i] + '"'
        }
      }
      conditionRegion += ')';
      // console.log(conditionRegion);
      tabCondition.push(conditionRegion);
    }

    conditionAcademie = "";
    if (optionAcademie !== null) {
      conditionAcademie = "academie=(";
      for (var i = 0; i < optionAcademie.length; i++) {
        if (i + 1 != optionAcademie.length) {
          conditionAcademie += '"' + optionAcademie[i] + '",'
        } else {
          conditionAcademie += '"' + optionAcademie[i] + '"'
        }
      }
      conditionAcademie += ')';
      //console.log(conditionAcademie);
      tabCondition.push(conditionAcademie);
    }


    conditionTutelle = "";
    if (optionTutelle !== null) {
      conditionTutelle = "tutelle=(";
      for (var i = 0; i < optionTutelle.length; i++) {
        if (i + 1 != optionTutelle.length) {
          conditionTutelle += '"' + optionTutelle[i] + '",'
        } else {
          conditionTutelle += '"' + optionTutelle[i] + '"'
        }
      }
      conditionTutelle += ')';
      tabCondition.push(conditionTutelle);
      // console.log(conditionTutelle);
    }

    conditionSigle = "";
    if (optionSigle !== null) {
      conditionSigle = "sigle=(";
      for (var i = 0; i < optionSigle.length; i++) {
        if (i + 1 != optionSigle.length) {
          conditionSigle += '"' + optionSigle[i] + '",'
        } else {
          conditionSigle += '"' + optionSigle[i] + '"'
        }
      }
      conditionSigle += ')';
      //console.log(conditionSigle);
      tabCondition.push(conditionSigle);
    }


    conditionUniversite = "";
    if (optionUniversite !== null) {
      conditionUniversite = "universite=(";
      for (var i = 0; i < optionUniversite.length; i++) {
        if (i + 1 != optionUniversite.length) {
          conditionUniversite += '"' + optionUniversite[i] + '",'
        } else {
          conditionUniversite += '"' + optionUniversite[i] + '"'
        }
      }
      conditionUniversite += ')';
      //console.log(conditionUniversite);
      tabCondition.push(conditionUniversite);
    }

    conditionStatut = "";
    if (optionStatut !== null) {
      conditionStatut = "statut=(";
      for (var i = 0; i < optionStatut.length; i++) {
        if (i + 1 != optionStatut.length) {
          conditionStatut += '"' + optionStatut[i] + '",'
        } else {
          conditionStatut += '"' + optionStatut[i] + '"'
        }
      }
      conditionStatut += ')';
      //console.log(conditionStatut);
      tabCondition.push(conditionStatut);
    }


    conditionType = "";
    if (optionType !== null) {
      conditionType = "type=(";
      for (var i = 0; i < optionType.length; i++) {
        if (i + 1 != optionType.length) {
          conditionType += '"' + optionType[i] + '",'
        } else {
          conditionType += '"' + optionType[i] + '"'
        }
      }
      conditionType += ')';
      tabCondition.push(conditionType);
      //console.log(conditionType);
    }

    if (whichJob) {
      if (tabCondition.length > 0) {
        urlT += 'import module namespace functx = "http://www.functx.com";  functx:distinct-nodes(db:open("etablissement_superieur")//etablissement[';
        for (var i = 0; i < tabCondition.length; i++) {
          if (i + 1 != tabCondition.length) {
            urlT += tabCondition[i] + " and ";
          } else {
            urlT += tabCondition[i];
          }
        }
        urlT += "])"
      } else {
        urlT += 'import module namespace functx = "http://www.functx.com";  functx:distinct-nodes(db:open("etablissement_superieur")//etablissement)';
      }
    } else if (!whichJob) {
      var tabSelectionEtablissements = $ms.getSelection();
      if (tabSelectionEtablissements.length > 0) {
        conditionNomEtab = 'nom=(';
        for (var i = 0; i < tabSelectionEtablissements.length; i++) {
          if (i + 1 != tabSelectionEtablissements.length) {
            conditionNomEtab += '"' + tabSelectionEtablissements[i].name + '",';
          } else {
            conditionNomEtab += '"' + tabSelectionEtablissements[i].name + '"';
          }
        }
        conditionNomEtab += ')';
        tabCondition.push(conditionNomEtab);
      }

      if (tabCondition.length > 0) {
        urlT += 'import module namespace functx = "http://www.functx.com";  functx:distinct-nodes(db:open("etablissement_superieur")//etablissement[';
        for (var i = 0; i < tabCondition.length; i++) {
          if (i + 1 != tabCondition.length) {
            urlT += tabCondition[i] + " and ";
          } else {
            urlT += tabCondition[i];
          }
        }
        urlT += "])"
      } else {
        urlT += 'import module namespace functx = "http://www.functx.com";  functx:distinct-nodes(db:open("etablissement_superieur")//etablissement)';
      }

    }


    $("#myJocker").val(urlT);
    // console.log('url ' + $("#myJocker").val());
  }

  function managerEtablissement(dataEtab) {
    $tableB.bootstrapTable('removeAll');
    dataEtabCarte = [];
    dataEtabCarte = dataEtab;
    for (var i = 0; i < dataEtab.length; i++) {
      $tableB.bootstrapTable('insertRow', {
        index: i + 1,
        row: {
          state: false,
          uai: dataEtab[i].id,
          name: dataEtab[i].name,
          type: dataEtab[i].typeEtab,
          sigle: dataEtab[i].sigle,
          tutelle: dataEtab[i].tutelle,
          adresse: dataEtab[i].adresseEtab,
          longitude: parseFloat(dataEtab[i].longitude),
          latitude: parseFloat(dataEtab[i].latitude),
            cp: dataEtab[i].cp
        }
      });

    }
    $tableB.bootstrapTable('refresh');
  }


});


function initialize() {
  var mapContainer = document.getElementById('map');
  var mapOptions = {
    center: new google.maps.LatLng(44.5403, -78.5463),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  }
  map = new google.maps.Map(mapContainer, mapOptions);
  
}
google.maps.event.addDomListener(window, 'load', initialize);

/*
    EXEMPLE TIRER DU WEB COPYRIGHT
 */
function ajouteMarqueur( latlng , maCarte) {
    var latitude = latlng.lat;
    var longitude = latlng.lng;
    var optionsMarqueur = {
        map: maCarte,
        position: new google.maps.LatLng( latitude, longitude )
    };
    var marqueur = new google.maps.Marker( optionsMarqueur );

    //ajouer un évenement pour centrer la carte
    /*var infowindow = new google.maps.InfoWindow({
        content:getInfoMarker(latlng.name2, latlng.cp, latlng.adresseEtab)
    });*/

    google.maps.event.addListener( marqueur, "click", function( evenement ){
        maCarte.panTo( evenement.latLng );
        //infowindow.open(map, marqueur);
    });
    zoneMarqueurs.extend(marqueur.getPosition());
    tableauxMarqueurs.push(marqueur);

}

function appliqueAjouterMarker()
{
    for(var i =0; i<coordonnees.length; i++)
    {
        ajouteMarqueur(coordonnees[i], map);

    }
    map.fitBounds(zoneMarqueurs);
}

// Sets the map on all markers in the array.
// google map example copyRight j'ai rien imagniner
function supprimerTousLesMarquers() {
    for (var i = 0; i <tableauxMarqueurs.length; i++)
    {
        tableauxMarqueurs[i].setMap(null);
    }
    tableauxMarqueurs=[];
}

function getInfoMarker(nom, cp, adresse)
{
    return '<div class="lead">' +
        "<p> " +
            "<strong>"+nom+"</strong>" +
         "</p>" +
          "<p>"+cp+"</p>"+
         "<p>"+adresse+"</p>"+
       "</div>"
}


