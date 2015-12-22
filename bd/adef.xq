xquery version "3.0" encoding "utf-8";
module namespace adef = 'http://adef/miage2';

declare function adef:liste_region(){
 
    for $region in distinct-values(db:open('etablissement_superieur')//etablissement/region)
    order by $region 
    return <li>{$region}</li>

};

declare function adef:recherche($nom, $region, 
   $departement, $universite, $tutelle){
  <resultat>{
     for $etab in  db:open('etablissement_superieur')//etablissement
      let $value:= lower-case(concat($nom, $region, $departement, $universite,  $tutelle))
      return 
      if(contains((string(lower-case($etab))), $value))
        then $etab
        else $value
  }</resultat>
};

declare 
%rest:path("region") 
 %output:method("xhtml")
%rest:GET function adef:execute_liste_region() {
  adef:liste_region()
};

declare 
%rest:path("recherche") 
%rest:query-param("nom", "{$nom}")
%rest:query-param("region", "{$region}")
%rest:query-param("departement", "{$departement}")
%rest:query-param("universite", "{$universite}")
%rest:query-param("tutelle", "{$tutelle}")
%rest:GET function adef:execute_recherche($nom, $region, 
   $departement, $universite, $tutelle) {
  adef:recherche($nom, $region, $departement, $universite, $tutelle)
};

declare 
%rest:path("rechercheT") 
%rest:query-param("nom", "{$nom}")
%rest:GET function adef:execute_rechercheT($nom as xs:string) {
  <ressource>
    {
      xquery:eval($nom)
    }
  </ressource>
  
};
