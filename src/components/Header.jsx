import React, { useContext } from 'react';
import { string } from 'prop-types';
import { useHistory } from 'react-router-dom';
import profileIcon from '../images/profileIcon.svg';
import searchIcon from '../images/searchIcon.svg';
import RecipesAppContext from '../context/RecipesAppContext';
import SearchBar from './SearchBar';

function Header({ title, showSearchBtn }) {
  const { isSearching, toggleSearchBar } = useContext(RecipesAppContext);
  const history = useHistory();

  const handleProfileClick = () => {
    history.push('/profile');
  };

  return (
    <div>
      <h1 data-testid="page-title">{ title }</h1>
      <img
        role="presentation"
        data-testid="profile-top-btn"
        src={ profileIcon }
        alt="Profile button icon"
        onClick={ handleProfileClick }
      />
      {
        showSearchBtn && (
          <img
            role="presentation"
            data-testid="search-top-btn"
            src={ searchIcon }
            alt="Search button icon"
            onClick={ toggleSearchBar }
          />
        )
      }
      {isSearching && <SearchBar />}
    </div>
  );
}

Header.defaultProps = {
  showSearchBtn: false,
};

Header.propTypes = {
  title: string,
}.isRequired;

export default Header;
