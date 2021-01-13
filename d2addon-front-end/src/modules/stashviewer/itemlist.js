import React, { useState } from 'react';
import FilterStatesContext from './filterstatescontext.js'
import { List, AutoSizer, CellMeasurer, CellMeasurerCache } from "react-virtualized";

const ItemList = () => {
  const FilterStates = React.useContext( FilterStatesContext );

  const cache = React.useRef(
      new CellMeasurerCache({ 
          fixedWidth: true,
          defaultHeight: 100,
      })
  );  //google this
  
  return (
    <div style={{ width: "100%", height: "100vh" }}>
        <AutoSizer>
            { ({ width, height }) => (
                <List
                    width={width}
                    height={height}
                    rowHeight={ cache.current.rowHeight }
                    deferredMeasurementCache={ cache.current }
                    rowCount={FilterStates.itemNameSet.length}
                    rowRenderer={({ key, index, style, parent }) => {
                        const itemName = FilterStates.itemNameSet[index].itemName;
                        const itemReqLvl = FilterStates.itemNameSet[index].itemReqLvl;
                
                        return(
                            <CellMeasurer 
                                key={key} 
                                cache={cache.current}
                                parent={parent}
                                columnIndex={0}
                                rowIndex={index}
                            > 
                                <div style={style}>
                                    <button onClick={ () => FilterStates.setHtmlDisplay( FilterStates.itemNameSet[index].itemHtml ) }>{`${itemName} ` + `(${itemReqLvl})` }</button>
                                </div>
                            </CellMeasurer>
                        );
                    }}
                /> 
            ) }
        </AutoSizer>
    </div>
  )
}

export default ItemList;