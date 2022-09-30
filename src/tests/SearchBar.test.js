import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import mealsMock from './helpers/mealsMock';
import oneMeal from '../../cypress/mocks/oneMeal';
import oneDrink from '../../cypress/mocks/oneDrink';

const SEARCH_TOP_BTN_ID = 'search-top-btn';
const SEARCH_INPUT_ID = 'search-input';
const EXEC_BTN_ID = 'exec-search-btn';

describe('Testa o componente SearchBar', () => {
  it('Deve ser possível escrever e filtrar', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(mealsMock),
    });

    renderWithRouter(<App />, { initialEntries: ['/meals'] });

    expect(screen.getByTestId(SEARCH_TOP_BTN_ID)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(SEARCH_TOP_BTN_ID));

    expect(screen.getByTestId(SEARCH_INPUT_ID)).toBeInTheDocument();
    expect(screen.getByTestId(EXEC_BTN_ID)).toBeInTheDocument();
    userEvent.type(screen.getByTestId(SEARCH_INPUT_ID), 'orange');
    userEvent.click(screen.getByTestId(EXEC_BTN_ID));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?i=orange');
    });

    await waitFor(() => {
      mealsMock.meals.forEach((meal, index) => {
        expect(screen.getByTestId(`${index}-recipe-card`));
      });
    });
  });
  it('Deve redirecionar ao retornar só um resultado apos busca de meal', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(oneMeal),
    });

    const { history } = renderWithRouter(<App />, { initialEntries: ['/meals'] });

    expect(screen.getByTestId(SEARCH_TOP_BTN_ID)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(SEARCH_TOP_BTN_ID));

    expect(screen.getByTestId(SEARCH_INPUT_ID)).toBeInTheDocument();
    expect(screen.getByTestId(EXEC_BTN_ID)).toBeInTheDocument();
    userEvent.type(screen.getByTestId(SEARCH_INPUT_ID), 'meat');
    userEvent.click(screen.getByTestId(EXEC_BTN_ID));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toBeCalledWith('https://www.themealdb.com/api/json/v1/1/filter.php?i=meat');
    });

    expect(history.location.pathname).toBe('/meals/52771');
  });
  it('Deve redirecionar ao retornar só um resultado apos busca de drink', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue(oneDrink),
    });

    const { history } = renderWithRouter(<App />, { initialEntries: ['/drinks'] });

    expect(screen.getByTestId(SEARCH_TOP_BTN_ID)).toBeInTheDocument();
    userEvent.click(screen.getByTestId(SEARCH_TOP_BTN_ID));

    expect(screen.getByTestId(SEARCH_INPUT_ID)).toBeInTheDocument();
    expect(screen.getByTestId(EXEC_BTN_ID)).toBeInTheDocument();
    userEvent.type(screen.getByTestId(SEARCH_INPUT_ID), 'gin');
    userEvent.click(screen.getByTestId(EXEC_BTN_ID));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
      expect(global.fetch).toBeCalledWith('https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=gin');
    });

    expect(history.location.pathname).toBe('/drinks/178319');
  });
});
