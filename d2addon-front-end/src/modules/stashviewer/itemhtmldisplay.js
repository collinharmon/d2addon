import React, { useState } from 'react';
import FilterStatesContext from "./filterstatescontext.js";

var parse = require('html-react-parser'); /* recall the issue installing this. * 1/12/2021: before releasing probably want a different html parser package */


const ItemHtmlDisplay = () => {
  const FilterStates= React.useContext( FilterStatesContext )

  return(
    <div style={{backgroundColor: "#878483"}} >
        {parse(FilterStates.htmlDisplay)}
    </div>
  )
}

export default ItemHtmlDisplay;