import { render } from '@testing-library/react';
import React from 'react';
import * as reactQuery from 'react-query';
import { QueryObserverSuccessResult } from 'react-query';
import sinon from 'sinon';
import { SHARED_SOLUTIONS_RESPONSE } from '../../../mocks/responseBodies/getSharedSolutionsResponse';
import SharedSolutions from './SharedSolutions';

window.scrollTo = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useMutation: () => jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useLocation: () => ({
    location: {
      pathname: '/path-to-sharing',
    },
  }),
}));

const titles = SHARED_SOLUTIONS_RESPONSE.climateSolutions.map(
  (solution) => solution.solutionTitle
);

describe('Shared Impacts Renders', () => {
  const sandbox = sinon.createSandbox();
  sandbox.stub(reactQuery, 'useQuery').returns({
    data: SHARED_SOLUTIONS_RESPONSE,
    status: 'success',
    isLoading: false,
    error: null,
  } as QueryObserverSuccessResult<unknown, unknown>);

  it('Should have the correct numbber of cards', async () => {
    const { getAllByTestId } = render(<SharedSolutions />);
    const cards = getAllByTestId('CMCard');
    expect(cards.length).toBe(3);
  });

  it('Should contain all the titles', async () => {
    const { getByText } = render(<SharedSolutions />);
    titles.forEach((title) => {
      expect(getByText(title)).toBeInTheDocument();
    });
  });

  it('Should have Next: Sharing button', async () => {
    const { getByTestId } = render(<SharedSolutions />);
    expect(getByTestId('next-sharing-button')).toBeInTheDocument();
  });

  // it('Click on Next: Sharing button changes route/page', () => {
  //   const { getByTestId } = render(<SharedSolutions />);
  //   fireEvent.click(getByTestId('next-sharing-button'));
  //   expect(mockHistoryPush).toHaveBeenCalledWith('/shared-summary');
  // });
});
