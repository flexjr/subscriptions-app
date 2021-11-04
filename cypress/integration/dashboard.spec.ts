export {};

describe("Dashboard", () => {
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
  });
});
