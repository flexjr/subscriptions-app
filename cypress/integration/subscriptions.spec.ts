export {};

describe("Subscriptions Page", () => {
  it("should expect to see subscriptions items", () => {
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
    cy.get("#navbar-subscriptions").click();
    cy.url().should("include", "flex/organization/subscriptions");
    cy.get("#subscriptions-title").should("exist").contains("Subscriptions");
    cy.get("#upgrades-tab").should("exist").contains("Upgrades");
    cy.get("#manage-tab").should("exist").contains("Manage Subscriptions");
    cy.get("#payment-methods-tab").should("exist").contains("Payment Methods");
    cy.get("#upgrade-button").should("exist").contains("Upgrade");
  });
});
