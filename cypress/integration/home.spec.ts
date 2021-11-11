export {};

describe("Home", () => {
  it("should expect to see dashboard items", () => {
    cy.visit("/");
    cy.login().then(({ body: { access_token, expires_in, id_token, token_type } }) => {
      cy.window().then((win) => {
        win.localStorage.setItem(
          `@@auth0spajs@@::${Cypress.env("auth_client_id")}::${Cypress.env("auth_audience")}::${Cypress.env(
            "auth_scope"
          )} offline_access`, // Could also be ::default:: instead of ::${audience}::
          JSON.stringify({
            body: {
              client_id: Cypress.env("auth_client_id"),
              access_token,
              id_token,
              scope: Cypress.env("auth_scope"),
              expires_in,
              token_type,
              decodedToken: { user: JSON.parse(Buffer.from(id_token.split(".")[1], "base64").toString("ascii")) },
              audience: Cypress.env("auth_audience"),
            },
            expiresAt: Math.floor(Date.now() / 1000) + expires_in,
          })
        );
      });
    });
    cy.visit("/flex/dashboard");
    // Continue from here, expect to see "Company Cards Overview", "Total Available Funds", "Flex Plus Credit Business Account", "Increase Credit Line", "Deposit Funds"
    cy.get("#home-title").should("exist").contains("Home");
    cy.get("#total-available-funds-div").should("exist").contains("Total Available Funds");
    cy.get("#flex-plus-credit-div").should("exist").contains("Flex Plus Credit");
    cy.get("#business-account-div").should("exist").contains("Business Account");
    cy.get("#deposit-funds-div").should("exist").contains("Deposit Funds");
    cy.get("#increase-credit-line-div").should("exist").contains("Increase Credit Line");
    cy.get("#company-cards-overview-title").should("exist").contains("Company Cards Overview");
    cy.get("#quick-actions-title").should("exist").contains("Quick Actions");
    cy.get("#company-expenses-title").should("exist").contains("Company Expenses");
    cy.get("#explore-flex-title").should("exist").contains("Explore Flex");
    cy.get("#blog-div").should("exist").contains("Blog");
    cy.get("#visa-commercial-offers-div").should("exist").contains("Visa Commercial Offers");
    cy.get("#help-and-support-title").should("exist").contains("Help and Support");
    cy.get("#faq-div").should("exist").contains("Frequently Asked Questions");
    cy.get("#contact-us-div").should("exist").contains("Contact Us");
  });

  it("should expect to see side navigation bar items", () => {
    cy.visit("/");
    cy.login().then(({ body: { access_token, expires_in, id_token, token_type } }) => {
      cy.window().then((win) => {
        win.localStorage.setItem(
          `@@auth0spajs@@::${Cypress.env("auth_client_id")}::${Cypress.env("auth_audience")}::${Cypress.env(
            "auth_scope"
          )} offline_access`, // Could also be ::default:: instead of ::${audience}::
          JSON.stringify({
            body: {
              client_id: Cypress.env("auth_client_id"),
              access_token,
              id_token,
              scope: Cypress.env("auth_scope"),
              expires_in,
              token_type,
              decodedToken: { user: JSON.parse(Buffer.from(id_token.split(".")[1], "base64").toString("ascii")) },
              audience: Cypress.env("auth_audience"),
            },
            expiresAt: Math.floor(Date.now() / 1000) + expires_in,
          })
        );
      });
    });
    cy.visit("/flex/dashboard");
    cy.get("#navbar-home").should("exist");
    cy.get("#navbar-home").should("exist").contains("Home");
    cy.get("#navbar-physical-card").should("exist").contains("Physical Card");
    cy.get("#navbar-virtual-card").should("exist").contains("Virtual Card");
    cy.get("#navbar-transactions").should("exist").contains("Transactions");
    cy.get("#navbar-flex-plus-credit").should("exist").contains("Flex Plus Credit");
    cy.get("#navbar-subscriptions").should("exist").contains("Subscriptions");
    cy.get("#navbar-company-settings").should("exist").contains("Company Settings");
  });
});
