import React from 'react';
import "./css/navbar.css"
//import { Navbar, Nav, NavItem, MenuItem, NavDropdown } from 'react-bootstrap';

function Navbar(){
    return(
    <nav className="navbar navbar-expand-lg navbar-light">

    <a className="navbar-brand" href="#">
        <img src="https://www.windows10themes.net/wallpaper/cat/games/diablo-3-2013-wallpaper/thumbs/thumbs_lod34.ico" alt="logo" style={{marginRight: '12px'}} width="40" height="40" className="d-inline-block align-top" alt=""></img>Navbar
    </a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
    </button>

    <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
        <li className="nav-item active">
            <a className="nav-link" href="/">Home <span className="sr-only">(current)</span></a>
        </li>
        <li className="nav-item">
            <a className="nav-link" href="/about">Link</a>
        </li>
        <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Dropdown
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <a className="dropdown-item" href="">Action</a>
            <a className="dropdown-item" href="#">Another action</a>
            <div className="dropdown-divider"></div>
            <a className="dropdown-item" href="#">Something else here</a>
            </div>
        </li>
        </ul>
        <form className="form-inline my-2 my-lg-0">
        <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </form>
    </div>
    </nav>
    );

}

export default Navbar