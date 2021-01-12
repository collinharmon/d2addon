import React, { useState } from 'react';
import { itemFilters, defaultState, advancedStates } from "./itemfilters";
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";
import AuthApi from "../authapi";

var parse = require('html-react-parser'); /* recall the issue installing this */


/*const StashViewer = () => {

    /*const handleChange = (e) => {
        console.log("Inside handleChange()");
        let newState = radioButtonStates;
        newState[e.target.id] = !newState[e.target.id];
        setRadioButtonStates(newState);
        console.log("after update state: " + radioButtonStates);

        e.target.checked = true;
        const target = e.target;
        const value = target.value;
        const theID = target.id;
        const name = target.name;

        console.log(target);
        console.log(value);
    };*/

   /* return (
        <div>
            <h1>Stash View</h1>
            <div>
                <List
                    filters={itemFilters}
                />
            </div>
        </div>
    );
}*/

//we will want a useState conditional to conditionally render extra html if a radio button is enabled
//this might need tp be component if i cant modify list w/ use state

const StashViewer= () => {
  const [radioButtonStates, setRadioButtonStates] = useState(defaultState);
  const [advancedFiltersStates, setAdvancedFiltersStates] = useState(advancedStates);
  const [htmlDisplay, setHtmlDisplay] = useState('');
  //const [itemQuerySet, setItemQuerySet] = useState([{test: "one", next:"two"}, {test: "one1", next:"two1"}]);
  const [itemNameSet, setNameSet] = useState([]);

  const Auth = React.useContext(AuthApi);
  const cache = React.useRef(
      new CellMeasurerCache({ 
          fixedWidth: true,
          defaultHeight: 100,
      })
  );  //google this

  const handleSubmit = (e) => {
      e.preventDefault();
      let selectHtml = `select html, itemName, requiredLevel from items where ` +
                            `(StashID in (SELECT stashID from stashes where userID = ` +
                                `(SELECT id from users where username = '${Auth.username}'))) and `;
      let itemCategorySetQuery = radioButtonStates.map( (state,  index) => {
            if(state){
                let categoryQueryPortion = getItemCategoryQuery(itemFilters[index].filterName);
                let kindQueryPortion = advancedFiltersStates[index].map( (advState, subIndex) => {
                    if(advState) {
                        return `itemKind = '` + itemFilters[index].subFilters[subIndex].subFilterName + `'`
                    }
                } );
                var filteredKindQueryPortion = kindQueryPortion.filter( (element) => {
                    return element !== undefined;
                } );
                let joinedQuery = `(` + categoryQueryPortion + ` and (` +  filteredKindQueryPortion.join(' or ') + `))`;
                return joinedQuery;
                //console.log(categoryQueryPortion);
                //console.log(test1);
            }
        } );
      //let finalQuery = categorySetQuery.join
      var finalQuery = itemCategorySetQuery.filter( (element) => {
          return element !== undefined;
      } );
      finalQuery = `(` +  finalQuery.join(' or ') + `)`;

      console.log(selectHtml + finalQuery);
      let allTogetherNow = selectHtml + finalQuery;
      console.log("to grab: " + allTogetherNow)

      fetch(`http://localhost:5000/Getitems?sqlQuery=${allTogetherNow}`, {method: 'POST'})
      .then(response => response.json())
      .then(data => 
      {
        if(data.length > 0){
          console.log("data length: " + data.length);
          console.log("data: " + data);
          let itemNameHtmlList = data.map( (item) => {
            return {
                itemName: item.itemName,
                itemHtml: item.html.substring(6, (item.html.length-8)).replace(/\\/g, ""),
                itemReqLvl:  item.requiredLevel
            };
          });
          itemNameHtmlList.sort( ( itemA, itemB ) => ( itemA.itemReqLvl > itemB.itemReqLvl ) ? 1 : (( itemB.itemReqLvl > itemA.itemReqLvl ) ? -1 : 0)); 
          /* below line is if i want to append
           * setNameSet( previousData => [...previousData, ...itemNameHtmlList]);
          */
          setNameSet( [...itemNameHtmlList]);
          /* !!!! don't forget that setState won't finish before this prints */
          console.log("The first NOT REAL selection: " + itemNameSet);

           
          /* below line removes html tags (can't have html object within html object) */
          var huh =  itemNameHtmlList[0].itemHtml;
          console.log("oops: " + huh);
          setHtmlDisplay( huh );
        }
      })
      .catch(err => console.error(err))


  };

  const getItemCategoryQuery = (category) => {
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <ul>
        {itemFilters.map((filter) => (
            <li key={filter.id}>
                <input
                    type="checkbox"
                    id={filter.id}
                    onClick={ (e) => {
                        /* onClick will enable/display advanced filters for the filter checked */
                        let newStates = radioButtonStates;
                        newStates[e.target.id] = !newStates[e.target.id];
                        setRadioButtonStates([...newStates]);
                        if(newStates[e.target.id] === false){
                            console.log("in here okasokyok");
                            var newAdvState = advancedFiltersStates;
                            //newAdvState[e.target.id] = advancedStates[e.target.id]; the hook setter updates this extern json object, which i dont want it to do
                            //newAdvState[e.target.id].map( (state) => state = false ); 
                            for(let i = 0; i < newAdvState[e.target.id].length; i++) newAdvState[e.target.id][i] = false;
                            setAdvancedFiltersStates([...newAdvState]);
                        }
                        console.log("wtf: " + radioButtonStates);
                    }}
                />
                <label for={filter.filterName}>{filter.filterName}</label>
                {filter.subFilters.map( (subFilter) => (
                        radioButtonStates[filter.id]?
                        <div>
                            <input
                                type="checkbox"
                                id={subFilter.id}
                                onClick={ (e) => {
                                    let newStates = advancedFiltersStates;
                                    newStates[filter.id][e.target.id] = !newStates[filter.id][e.target.id];
                                    setAdvancedFiltersStates([...newStates]);
                                    console.log("adv: " + advancedFiltersStates);
                                }}
                            /> 
                            <label for={subFilter.subFilterName}>{subFilter.subFilterName}</label>
                        </div>
                        : null
                ) )}
            </li>
        ))}

        </ul>
        <button type="submit">Submit</button>
      </form>
      <div style={{backgroundColor: "#878483"}} >
          {parse(htmlDisplay)}
      </div>
      {itemNameSet.length > 0 ? (
        <div style={{ width: "100%", height: "100vh" }}>
            <AutoSizer>
                { ({ width, height }) => (
                    <List
                        width={width}
                        height={height}
                        rowHeight={ cache.current.rowHeight }
                        deferredMeasurementCache={ cache.current }
                        rowCount={itemNameSet.length}
                        rowRenderer={({ key, index, style, parent }) => {
                            const itemName = itemNameSet[index].itemName;
                            const itemReqLvl = itemNameSet[index].itemReqLvl;
                    
                            return(
                                <CellMeasurer 
                                    key={key} 
                                    cache={cache.current}
                                    parent={parent}
                                    columnIndex={0}
                                    rowIndex={index}
                                > 
                                    <div style={style}>
                                        <button onClick={ () => setHtmlDisplay( itemNameSet[index].itemHtml ) }>{`${itemName} ` + `(${itemReqLvl})` }</button>
                                    </div>
                                </CellMeasurer>
                            );
                        }}
                    /> 
                ) }
            </AutoSizer>
        </div>
      ) : (null) }
    </div>
    
  );
}

export default StashViewer;


