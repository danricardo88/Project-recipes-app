import React, { useContext, useEffect } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import RecipesAppContext from '../context/RecipesAppContext';
import drinksAPI from '../services/drinksAPI';
import mealsAPI from '../services/mealsAPI';
import ShareButton from '../components/ShareButton';
import FavoriteButton from '../components/FavoriteButton';

function RecipeInProgress() {
  const {
    recipeDetails,
    setRecipeDetails,
    updateInProgress,
    checkList,
    setCurrentCheckList,
    saveDoneRecipe,
  } = useContext(RecipesAppContext);

  const { strMealThumb,
    strMeal,
    strCategory,
    strDrinkThumb,
    strDrink,
    strAlcoholic,
    strInstructions,
    strTags,
    strArea,
  } = recipeDetails;

  const history = useHistory();

  const { pathname } = useLocation();
  const { id } = useParams();
  const isMeal = pathname.includes('meals');

  const entries = Object.entries(recipeDetails);
  const details = entries
    .filter((entrie) => entrie[1] !== null && entrie[1] !== '');
  const ingredients = details.filter((ing) => ing[0].includes('strIngredient'));
  const measures = details.filter((mea) => mea[0].includes('strMeasure'));

  useEffect(() => {
    setCurrentCheckList(id, isMeal);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recipeInfo = {
    id,
    type: isMeal ? 'meal' : 'drink',
    nationality: strArea || '',
    category: strCategory || '',
    alcoholicOrNot: strAlcoholic || '',
    name: strMeal || strDrink,
    image: strMealThumb || strDrinkThumb,
    tags: (strTags && strTags.split(', ')) || [],
  };

  useEffect(() => {
    const getDetails = async () => {
      const { fetchById } = isMeal ? mealsAPI : drinksAPI;
      const data = await fetchById(id);
      setRecipeDetails(data);
    };
    getDetails();
  }, [id, pathname, isMeal, setRecipeDetails]);

  const handleChecked = ({ target }) => {
    updateInProgress(isMeal, id, target.value);
  };
  const finishRecipe = () => {
    saveDoneRecipe(recipeInfo);
    history.push('/done-recipes');
  };

  return (
    <div>
      <img data-testid="recipe-photo" src={ recipeInfo.image } alt={ recipeInfo.name } />
      <h1 data-testid="recipe-title">{ recipeInfo.name }</h1>
      <ShareButton />
      <FavoriteButton recipeInfo={ recipeInfo } />
      <h3 data-testid="recipe-category">{ strCategory }</h3>
      {
        ingredients.map((item, index) => {
          const ingredient = `${item[1]} ${(measures[index]) ? measures[index][1] : ''}`;
          return (
            <label
              key={ index }
              data-testid={ `${index}-ingredient-step` }
              htmlFor={ index }
              className={ checkList.includes(ingredient) ? 'checked' : '' }
            >
              <input
                id={ index }
                type="checkbox"
                value={ ingredient }
                checked={ checkList.includes(ingredient) }
                onChange={ handleChecked }
              />
              { ingredient }
            </label>
          );
        })
      }
      <p data-testid="instructions">{ strInstructions }</p>
      <button
        type="button"
        className="start-recipe-btn"
        data-testid="finish-recipe-btn"
        onClick={ finishRecipe }
        disabled={ checkList.length !== ingredients.length }
      >
        Finish Recipe

      </button>
    </div>
  );
}

export default RecipeInProgress;
