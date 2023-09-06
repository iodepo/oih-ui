import os
import json
import re

import shapely
import shapely.wkt
import shapely.geometry

from urllib.request import urlopen

###
#  Geometry to regions
#
# This takes any feature that's represented in WKT format and checks
# for intersecting regions from the geojson. Additional regions can be
# added to the geojson as required, there's no requirement that the
# regions be non-overlapping.


with open(os.path.join(os.path.dirname(__file__),'regions-clipped.geojson'), 'r') as f:
    geo_regions = json.load(f)['features']
    for r in geo_regions:
        r['shape'] = shapely.geometry.shape(r['geometry'])

def regionsForFeature(feature):
    the_geom= shapely.wkt.loads(feature)
    return [r['properties']['name'] for r in geo_regions if r['shape'].intersects(the_geom)]


###
#  Text address / name / CountryOfLastProcessing to Regions
#
# This is a super simple geocoder -- if there's text (in "address", 
# "name", or "CountryOfLastProcessing" properties) that contains
# a country that's spelled like the "geoAreaName" value from 
# the UNSD "GeoArea" API endpoint, we take the
# region from there. 

# For more on the UNSD API, see https://unstats.un.org/SDGAPI/swagger/
# and see the JSON results tree for the GeoArea endpoint at 
# https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/Tree
# We now connect through the live API, and get the list of all countries 
# and regions in JSON, which we then parse.  Formerly, we had to 
# manually download a CSV from 
# https://unstats.un.org/unsd/methodology/m49/overview

# Algorithim:
# * lower everything.
# * removing anything in parens e.g., we want Iran to match, not require
#   Iran(Islamic Republic of),
# * Remove stop words.
# * Split on whitespace
# * remove ending period e.g. we want "Ghana" from "Accra, Ghana."

# Then, for properties mentioned above, we check to see if any of the 
# countries are in the address, and map away from there.  Note, 
# Cote d'Ivoire and Timor Leste are going to potentially have accent issues.
#
# Note -- this is a linear search, but there are only 200 countries so it's not that bad.

def normalize(s):
    s = s.lower()
    s = re.sub(r"\(.*\)","",s)
    s = re.sub(r"\[.*\]","",s)
    s = re.sub(r"and|the|of","", s)
    s = s.rstrip('.')
    return set(s.split(None))

#leverage the UNSD API "GeoArea" JSON endpoint, instead of locally-stored CSV
#  see https://unstats.un.org/SDGAPI/swagger/
unsdGeoareaEndpoint = "https://unstats.un.org/SDGAPI/v1/sdg/GeoArea/Tree"
response = urlopen(unsdGeoareaEndpoint)
unsdDataJSON = json.loads(response.read())
#use the "World (total) by continental regions" branch
continentalRegions = unsdDataJSON[1]
continentalRegionsChildren = continentalRegions['children']

#parse the JSON from the API call
countries_dict_with_regions = {}
country_map_list = []

for list_regions in continentalRegionsChildren:
    if list_regions['children'] == None:
        regionName = list_regions['geoAreaName']
        #print('Region name (no children): ' + regionName)
    else:
        regionName = list_regions['geoAreaName']    
        #print('Region name: ' + regionName)
        #loop through sub-regions
        for list_subregions in list_regions['children']:
            subRegionName = list_subregions['geoAreaName']
            #print('Sub-region name: ' + subRegionName)            
            #loop through intermediate region items
            for list_intermediate_regions in list_subregions['children']:
                if list_intermediate_regions['type'] == 'Region':
                    intermediateRegionName = list_intermediate_regions['geoAreaName']
                    #print('Intermediate region name: ' + intermediateRegionName)
                    #loop through intermediate region children
                    for list_intermediate_region_children in list_intermediate_regions['children']:
                        countryName = list_intermediate_region_children['geoAreaName'].lower()
                        #print('Country name: ' + countryName)
                        countries_dict_with_regions[countryName] = [regionName, subRegionName] 
                        country_map_list.append((normalize(countryName), countryName))
                else:
                    countryName = list_intermediate_regions['geoAreaName'].lower()
                    #print('Country name: ' + countryName)                   
                    countries_dict_with_regions[countryName] = [regionName, subRegionName]                 
                    country_map_list.append((normalize(countryName), countryName))
                    
#print(countries_dict_with_regions)
#print(country_map_list)

def regionForAddress(address):
    normalized = normalize(address)
    for parts, country in country_map_list:
        if parts <= normalized:
            return countries_dict_with_regions[country]            
            
def regionForName(name):
    normalized = normalize(name)
    for parts, country in country_map_list:
        if parts <= normalized:
            return countries_dict_with_regions[country]
            
def regionForCountryOfLastProcessing(countryOfLastProcessing):
    normalized = normalize(countryOfLastProcessing)
    for parts, country in country_map_list:
        if parts <= normalized:
            return countries_dict_with_regions[country]            

if __name__ == '__main__':

    print('regionsForFeature tests...')
    for feature in (
            'POLYGON ((-95.5 19.5,-95.5 31.5,-73.5 31.5,-73.5 19.5,-95.5 19.5))',
            'POLYGON ((144.401499 13.11742,144.401499 15.622688,145.8872 15.622688,145.8872 13.11742,144.401499 13.11742))',
            'POINT (0 0)',
            'POINT (-9 53)'
            ):
        print('    ',regionsForFeature(feature))
        
    print('regionForAddress tests...')
    for address in (
            'IOC Science and Communication Centre on Harmful Algae, University of Copenhagen - University of Copenhagen, Department of Biology - DK-1353 K\u00f8benhavn K - Denmark',
            'P. O. BOX LG 99 Legon-Accra, Ghana.',
            ):
        print('    ',regionForAddress(address))
        
    print('regionForName tests...')    
    for name in (
            "Marine Science Country Profiles : Kenya",
            "The fisheries of Barbados and some of their problems",
            "Fiji : Where's the data?"
            ):
        print('    ',regionForName(name))
        
    print('regionForCountryOfLastProcessing tests...')    
    for countryOfLastProcessing in (
            'Angola',
            'Panama',
            'Fiji'
            ):
        print('    ',regionForCountryOfLastProcessing(countryOfLastProcessing))         
