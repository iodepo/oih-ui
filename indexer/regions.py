import os
import json
import csv
import re

import shapely
import shapely.wkt
import shapely.geometry


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
#  Text address / name / CountryOfLastProcessing
# This is a super simple geocoder -- if there's text (in "address", 
# "name", or "CountryOfLastProcessing" properties) that contains
# a country that's spelled like we have in the CSV file, we take the
# region from there. Note that the region doesn't exactly map to what
# we're using elsewhere, so we should probably hand edit a country ->
# region listing instead of using the UN one straight out.

# Updates in March 2023:
#   - added regional harvesting of the "name", "countryOfLastProcessing" 
#     properties
#   - added the UN class "Sub-region Name" to the output
#   - this means that in the Solr index, a resource with a "name" of 
#        "New records of deep water blah off Argentina" 
#     will be stored as 
#        "txt_region": ["Americas", "Latin America and the Caribbean"]

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

with open(os.path.join(os.path.dirname(__file__),'UNSD.Methodology.csv'), 'r') as f:
    dialect = csv.register_dialect('semi', delimiter=';', quoting=csv.QUOTE_NONE)
    reader = csv.DictReader(f, dialect='semi')
    #text_regions = {line['Country or Area'].lower():line['Region Name'] for line in reader}
    text_regions = {line['Country or Area'].lower():[line['Region Name'],line['Sub-region Name']] for line in reader}
    def normalize(s):
        s = s.lower()
        s = re.sub(r"\(.*\)","",s)
        s = re.sub(r"and|the|of","", s)
        s = s.rstrip('.')
        return set(s.split(None))
    country_map_list = [(normalize(country),country) for country in text_regions.keys()]

def regionForAddress(address):
    normalized = normalize(address)
    for parts, country in country_map_list:
        if parts <= normalized:
            return text_regions[country]
            
def regionForName(name):
    normalized = normalize(name)
    for parts, country in country_map_list:
        if parts <= normalized:
            return text_regions[country]
            
def regionForCountryOfLastProcessing(countryOfLastProcessing):
    normalized = normalize(countryOfLastProcessing)
    for parts, country in country_map_list:
        if parts <= normalized:
            return text_regions[country]            

if __name__ == '__main__':

    #print(text_regions)

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
            'Department of Marine and Fisheries Sciences, University of Ghana, P. O. BOX LG 99 Legon-Accra, Ghana.',
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
