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
    cy.get("[data-cy=home-title]").should("exist").contains("Home");
    cy.get("[data-cy=total-available-funds-div]").should("exist").contains("Total Available Funds");
    cy.get("[data-cy=flex-plus-credit-div]").should("exist").contains("Flex Plus Credit");
    cy.get("[data-cy=business-account-div]").should("exist").contains("Business Account");
    cy.get("[data-cy=deposit-funds-div]").should("exist").contains("Deposit Funds");
    cy.get("[data-cy=increase-credit-line-div]").should("exist").contains("Increase Credit Line");
    cy.get("[data-cy=company-cards-overview-title]").should("exist").contains("Company Cards Overview");
    cy.get("[data-cy=quick-actions-title]").should("exist").contains("Quick Actions");
    cy.get("[data-cy=company-expenses-title]").should("exist").contains("Company Expenses");
    cy.get("[data-cy=explore-flex-title]").should("exist").contains("Explore Flex");
    cy.get("[data-cy=blog-div]").should("exist").contains("Blog");
    cy.get("[data-cy=visa-commercial-offers-div]").should("exist").contains("Visa Commercial Offers");
    cy.get("[data-cy=help-and-support-title]").should("exist").contains("Help and Support");
    cy.get("[data-cy=faq-div]").should("exist").contains("Frequently Asked Questions");
    cy.get("[data-cy=contact-us-div]").should("exist").contains("Contact Us");
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
    cy.get("[data-cy=navbar-home]").should("exist");
    cy.get("[data-cy=navbar-home]").should("exist").contains("Home");
    cy.get("[data-cy=navbar-physical-card]").should("exist").contains("Physical Card");
    cy.get("[data-cy=navbar-virtual-card]").should("exist").contains("Virtual Card");
    cy.get("[data-cy=navbar-transactions]").should("exist").contains("Transactions");
    cy.get("[data-cy=navbar-flex-plus-credit]").should("exist").contains("Flex Plus Credit");
    cy.get("[data-cy=navbar-subscriptions]").should("exist").contains("Subscriptions");
    cy.get("[data-cy=navbar-company-settings]").should("exist").contains("Company Settings");
  });
});
