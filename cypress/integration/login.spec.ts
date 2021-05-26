/// <reference types="cypress" />

import { terminalLog } from '../support/helpers';

export const testUser = {
  email: 'test.user@example.com',
  password: 'Password123!',
};

describe('Login', () => {
  beforeEach(() => {
    cy.acceptCookies();

    cy.server();
    cy.route({
      method: 'GET',
      url: '/questions',
      response: 'fixture:questions.json',
    });
    cy.route({
      method: 'POST',
      url: '/login',
      response: 'fixture:login.json',
    });
    cy.route({
      method: 'GET',
      url: `/feed?session-id=${1234}`,
      response: 'fixture:climate-feed.json',
    });
  });

  it('has login button on the hamburger bar', () => {
    cy.visit('/');
    cy.get('#AppBar');
    cy.get('#TopMenuToggle').click();
    cy.get('.material-icons').contains('login');
    cy.get('[data-cy="LoginButton"]').click();
    cy.url().should('include', '/login');
  });

  it('allows the user to navigate to the login page from homepage', () => {
    cy.visit('/');
    cy.contains(/Login here/i).click();
    cy.contains(/Sign In/i).should('be.visible');
    cy.url().should('include', '/login');
    cy.checkAccessibility(terminalLog);
    cy.percySnapshot('Login');
  });

  it('has a login button and it is initially disabled', () => {
    cy.contains(/Log In/i).should('be.disabled');
  });

  it('allows a user to login with valid account details', () => {
    cy.visit('/login');

    cy.get('input#email').type(testUser.email);
    cy.get('input#password').type(testUser.password);
    cy.contains(/log in/i).click();
    cy.get('.MuiAlert-root').contains('Welcome, Test T User');
    cy.url().should('include', '/climate-feed');
  });

  it('User can logout after logging in', () => {
    cy.get('#TopMenuToggle').click();
    cy.get('.material-icons').contains('logout');
    cy.get('[data-cy="LogoutButton"]').click();
    cy.contains(/Powering climate conversations/i);
  });

  it('shows an error if an invalid email is entered', () => {
    cy.visit('/login');
    cy.get('input#email').type('test@test@test.com');
    cy.get('input#password').click();
    cy.contains(/Please enter a valid email address/i);
  });

  it('shows an error if no password is entered', () => {
    cy.visit('/login');
    cy.get('input#password').click();
    cy.get('input#email').click();
    cy.contains(/Please enter your password/i);
  });

  it('does not let the user in with invalid credentials', () => {
    cy.route({
      method: 'POST',
      url: '/login',
      response: 'fixture:badLogin.json',
      status: 401,
    });

    cy.visit('/login');
    cy.get('input#email').type(testUser.email);
    cy.get('input#password').type(testUser.password);
    cy.contains(/log in/i).click();
    cy.url().should('include', '/login');
    cy.get('.MuiAlert-root').contains(/Wrong email or password\. Try again\./i);
  });
});
