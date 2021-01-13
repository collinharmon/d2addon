import { itemFilters } from "./itemfilters";

/* helper functions for stash viewer */
export const buildItemQuery = ( username, radioButtonStates, advancedFiltersStates ) => {
    let selectHtml = `select html, itemName, requiredLevel from items where ` +
                        `(StashID in (SELECT stashID from stashes where userID = ` +
                            `(SELECT id from users where username = '${username}'))) and `;
    
    let itemClassSetQuery = radioButtonStates.map( (state,  index) => {
        if(state){
            let classQueryPortion = getItemClassQuery(itemFilters[index].filterName);
            let itemKindQueryPortion = advancedFiltersStates[index].map( (advState, subIndex) => {
                if(advState) {
                    return `itemKind = '` + itemFilters[index].subFilters[subIndex].subFilterName + `'`
                }
            } );
            var filteredItemKindQueryPortion = itemKindQueryPortion.filter( (element) => {
                return element !== undefined;
            } );
            return `(` + classQueryPortion + ` and (` +  filteredItemKindQueryPortion.join(' or ') + `))`;
        }
    } );
    /* below line will filter out the blanks which result from unchecked radio buttons */
    var filteredItemClassSetQuery = itemClassSetQuery.filter( (element) => {
        return element !== undefined;
    } );
    filteredItemClassSetQuery = `(` +  filteredItemClassSetQuery.join(' or ') + `)`;

    return selectHtml + filteredItemClassSetQuery;
};

export const getItemClassQuery = (category) => {
    switch(category) {
        case 'Helm':
            return `(itemCategory = 'armor' and bodyLocation1 = 'head')`;
        case 'Gloves':
            return `(itemCategory = 'armor' and bodyLocation1 = 'glov')`
        case 'Belt':
            return `(itemCategory = 'armor' and bodyLocation1 = 'belt')`
        case 'Boots':
            return `(itemCategory = 'armor' and bodyLocation1 = 'feet')`
        case 'Shield':
            return `(itemCategory = 'armor' and bodyLocation1 = 'rarm')`
        case 'Weapon':
            return `(itemCategory = 'weapon' and bodyLocation1 = 'rarm')`
        case 'Body':
            return `(itemCategory = 'armor' and bodyLocation1 = 'tors')`
        case 'Amulet':
            return `(itemCategory = 'amulet')`
        case 'Ring':
            return `(itemCategory = 'ring')`
        case 'Misc':
            return `(itemCategory = 'misc')`
        case 'Gem':
            return `(itemCategory = 'gem')`
        case 'Charm':
            return `(itemCategory = 'smallcharm' or itemCategory = 'largecharm' or itemCategory = 'grandcharm')`
        case 'Rune':
            return `(itemCategory = 'rune')`
    }
};