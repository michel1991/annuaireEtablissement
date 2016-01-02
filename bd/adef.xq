xquery version "3.0" encoding "utf-8";
module namespace adef = 'http://adef/miage2';
import module namespace functx = 'http://www.functx.com';

declare function adef:liste_region(){

    for $region in distinct-values(db:open('etablissement_superieur')//etablissement/region)
    order by $region
    return <li>{$region}</li>

};

declare function adef:liste_academie(){

    for $academie in distinct-values(db:open('etablissement_superieur')//etablissement/academie)
    order by $academie
    return <li>{$academie}</li>

};

declare function adef:liste_tutelle(){

    for $tutelle in distinct-values(db:open('etablissement_superieur')//etablissement/tutelle)
    order by $tutelle
    return <li>{$tutelle}</li>

};

declare function adef:liste_sigle(){
    for $sigle in distinct-values(db:open('etablissement_superieur')//etablissement/sigle)
    order by $sigle
    return <li>{$sigle}</li>

};

declare function adef:liste_universite(){
    for $universite in distinct-values(db:open('etablissement_superieur')//etablissement/universite)
    order by $universite
    return <li>{$universite}</li>

};

declare function adef:liste_statut()
{
    for $statut in distinct-values(db:open('etablissement_superieur')//etablissement/statut)
    order by $statut
    return <li>{$statut}</li>

};

declare function adef:liste_typesEtab()
{
    for $type in distinct-values(db:open('etablissement_superieur')//etablissement/type)
    order by $type
    return <li>{$type}</li>

};

declare function adef:beforeResearch($uai, $region)
{
    for $etab in db:open('etablissement_superieur')//etablissement
    where functx:is-value-in-sequence($etab/uai,(uai)) or
            functx:is-value-in-sequence($etab/region,(region))
    return $etab
};

declare function adef:recherche($nom, $region,
        $departement, $universite, $tutelle){
    <resultat>{
        for $etab in  db:open('etablissement_superieur') //etablissement
        let $value:= lower-case(concat($nom, $region, $departement, $universite,  $tutelle))
        return
            if(contains((string(lower-case($etab))), $value))
            then $etab
            else $value
    }</resultat>
};

declare function adef:nb_Etabl_Region()
{
    <result>{
      for $etabl in db:open('etablissement_superieur')//etablissement
      let $region := $etabl//region
      group by $region
      order by count($etabl) descending
      return <item>{$region}/{count($etabl)}</item>
    }</result>
};

declare
%rest:path("nbEtablRegion")
%output:method("xhtml")
%rest:GET function adef:execute_nb_Etabl_Region() {
    adef:nb_Etabl_Region()
};

declare
%rest:path("region")
%output:method("xhtml")
%rest:GET function adef:execute_liste_region() {
    adef:liste_region()
};

declare
%rest:path("academie")
%output:method("xhtml")
%rest:GET function adef:execute_liste_academie() {
    adef:liste_academie()
};

declare
%rest:path("tutelle")
%output:method("xhtml")
%rest:GET function adef:execute_liste_tutelle() {
    adef:liste_tutelle()
};

declare
%rest:path("sigle")
%output:method("xhtml")
%rest:GET function adef:execute_liste_sigle() {
    adef:liste_sigle()
};

declare
%rest:path("universite")
%output:method("xhtml")
%rest:GET function adef:execute_universite() {
    adef:liste_universite()
};

declare
%rest:path("statut")
%output:method("xhtml")
%rest:GET function adef:execute_statut() {
    adef:liste_statut()
};

declare
%rest:path("type")
%output:method("xhtml")
%rest:GET function adef:execute_typesEtab() {
    adef:liste_typesEtab()
};

declare
%rest:path("expandable")
%output:method("xhtml")
%rest:query-param("requete", "{$requete}")
%rest:GET function adef:execute_expandable($requete as xs:string) {
    xquery:eval($requete)
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
