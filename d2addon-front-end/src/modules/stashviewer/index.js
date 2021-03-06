import React, { useState } from 'react';
import { itemFilters, defaultState, advancedStates } from "./itemfilters";
import AuthApi from "../common/authapi";
import { buildItemQuery } from "./helpers.js";
import FilterStatesContext from './filterstatescontext';
import RadioButtonFilters from './radiobuttonfilters';
import ItemDisplay from "./itemhtmldisplay.js";
import ItemList from "./itemlist.js";

const StashViewer= () => {
  const [radioButtonStates, setRadioButtonStates] = useState(defaultState);
  const [advancedFiltersStates, setAdvancedFiltersStates] = useState(advancedStates);
  const [htmlDisplay, setHtmlDisplay] = useState('');
  const [itemNameSet, setNameSet] = useState([]);
  const [emptyQueryResults, setEmptyQueryResults] = useState(false);
  const [queryError, setQueryError] = useState(false);

  const Auth = React.useContext(AuthApi);

  const handleSubmit = (e) => {
      e.preventDefault();

      let query = buildItemQuery( Auth.username, radioButtonStates, advancedFiltersStates );

      fetch(`http://localhost:5000/Getitems?sqlQuery=${query}`, {method: 'POST'})
      .then(response => response.status != 468 ? response.json() : setQueryError( true ))
      .then(data => 
      {
        if( data && data.length > 0 ){
          setEmptyQueryResults( false );
          setQueryError( false );
          let itemNameHtmlList = data.map( (item) => {
            return {
                itemName: item.itemName,
                itemHtml: item.html.substring(6, (item.html.length-8)).replace(/\\/g, ""),
                itemReqLvl:  item.requiredLevel
            };
          });

          /* sort by item level.. */
          itemNameHtmlList.sort( ( itemA, itemB ) => ( itemA.itemReqLvl > itemB.itemReqLvl ) ? 1 : (( itemB.itemReqLvl > itemA.itemReqLvl ) ? -1 : 0)); 

          /* below line is if i want to append
           * setNameSet( previousData => [...previousData, ...itemNameHtmlList]);
          */
          setNameSet( [...itemNameHtmlList]);

          /* !!!! don't forget that setState won't finish before this prints
          console.log("The first NOT REAL selection: " + itemNameSet); */

          setHtmlDisplay( itemNameHtmlList[0].itemHtml );
        }
        else if ( data ){
          setEmptyQueryResults( true );
          setQueryError( false );
          setNameSet( [] );
          setHtmlDisplay( "" );
        }
        else setEmptyQueryResults( false );
      })
      .catch(err => console.error(err))
  };

  return (
    <div>
      <FilterStatesContext.Provider value={ { radioButtonStates, setRadioButtonStates, advancedFiltersStates, setAdvancedFiltersStates, htmlDisplay, setHtmlDisplay, itemNameSet, setNameSet } } >
        <form onSubmit={handleSubmit}>
            <RadioButtonFilters />  
            <button type="submit">Submit</button>
            { queryError ? (
              <div style={{ fontSize: 12, color: "red"}}>There was a problem with your query. Did you select at least one item?</div>
            ) : ( null ) }
        </form>
        { emptyQueryResults ?  (
          <div style={{ fontSize: 12, color: "red"}}>No items present with the given item filters.</div>
        ) : ( null ) }
        { itemNameSet.length > 0 ? (
          <div>
            <ItemDisplay />
            <ItemList />
          </div>
        ) : ( null ) }
      </FilterStatesContext.Provider>
    </div>
    
  );
}

export default StashViewer;


