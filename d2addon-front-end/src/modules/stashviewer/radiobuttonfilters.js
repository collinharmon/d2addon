import React from 'react';
import { itemFilters } from "./itemfilters";
import FilterStatesContext from './filterstatescontext.js'

const RadioButtonFilters = () => {
  const FilterStates = React.useContext( FilterStatesContext );

  return (
    <ul>
      {itemFilters.map( ( filter ) => (
          <li key={ filter.id }>
              <input
                  type="checkbox"
                  id={ filter.id }
                  onClick={ (e) => {
                      /* onClick will enable/display advanced filters for the filter checked */
                      let newStates = FilterStates.radioButtonStates;
                      newStates[e.target.id] = !newStates[e.target.id];
                      FilterStates.setRadioButtonStates([...newStates]);
                      if(newStates[e.target.id] === false){
                          console.log("in here okasokyok");
                          var newAdvState = FilterStates.advancedFiltersStates;
                          //newAdvState[e.target.id] = advancedStates[e.target.id]; the hook setter updates this extern json object, which i dont want it to do
                          //newAdvState[e.target.id].map( (state) => state = false ); 
                          for(let i = 0; i < newAdvState[e.target.id].length; i++) newAdvState[e.target.id][i] = false;
                          FilterStates.setAdvancedFiltersStates([...newAdvState]);
                      }
                      //console.log("wtf: " + radioButtonStates);
                  }}
              />
              <label for={filter.filterName}>{filter.filterName}</label>
              {filter.subFilters.map( (subFilter) => (
                      FilterStates.radioButtonStates[filter.id]?
                        <div>
                            <input
                                type="checkbox"
                                id={subFilter.id}
                                onClick={ (e) => {
                                    let newStates = FilterStates.advancedFiltersStates;
                                    newStates[filter.id][e.target.id] = !newStates[filter.id][e.target.id];
                                    FilterStates.setAdvancedFiltersStates([...newStates]);
                                    //console.log("adv: " + advancedFiltersStates);
                                }}
                            /> 
                            <label for={subFilter.subFilterName}>{subFilter.subFilterName}</label>
                        </div>
                        : null
              ) )}
          </li>
      ))}
    </ul>
  )
}

export default RadioButtonFilters;