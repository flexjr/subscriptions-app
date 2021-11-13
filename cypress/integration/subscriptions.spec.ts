export {};

describe("Subscriptions Page", () => {
  it("should expect to see all org users, attempt to upgrade user on Flex Starter to Flex Pro (Yearly)", () => {
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
    cy.intercept("GET", "/users/current_user_info", []).as("getCurrentUserInfo");
    cy.wait("@getCurrentUserInfo");

    // Go to subscriptions tab
    cy.get("[data-cy=navbar-subscriptions]").click();
    cy.url().should("include", "/flex/organization/subscriptions");
    cy.intercept("GET", "/organizations/current_org", []).as("getCurrentOrgInfo");
    cy.wait("@getCurrentOrgInfo");
    cy.get("[data-cy=subscriptions-title]").should("exist").contains("Subscriptions");
    cy.get("[data-cy=company-name]").should("exist").contains("E2E Testing Co Pte Ltd");
    cy.get("[data-cy=upgrade-button]").should("exist").contains("Upgrade");

    cy.get("[data-cy=tab-navigation]").should("exist");

    cy.get("[data-cy=org-users-table]").should("exist");
    cy.get("table").contains("td", "1250");
    cy.get("table").contains("td", "E2E");
    cy.get("table").contains("td", "Test User");
    cy.get("table").contains("td", "e2e-testing@example.com");
    cy.get("table").contains("td", "Flex Starter");

    // Select the first user
    cy.get("table").contains("td", "1250").prev("td").find("input").check();
    cy.get("[data-cy=upgrade-button]").click();
    // cy.intercept("POST", "/subscriptions/chargebee_customer", []).as("postChargebeeCustomer");
    // cy.wait("@postChargebeeCustomer");

    // Plan selection step
    cy.url().should("include", "/flex/subscription/checkout/plan-selection");
    cy.get("[data-cy=flex-starter-title]").should("exist").contains("Flex Starter");
    cy.get("[data-cy=flex-pro-title]").should("exist").contains("Flex Pro");
    cy.get("[data-cy=flex-premium-title]").should("exist").contains("Flex Premium");
    cy.get("[data-cy=flex-pro-button]").should("exist").click();

    // Billing frequency step
    cy.url().should("include", "/flex/subscription/checkout/billing-frequency");
  });
});
