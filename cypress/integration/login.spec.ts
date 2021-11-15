export {};

describe("Login Page", () => {
  it("should render correctly", () => {
    cy.visit("/");
    cy.get(
      '[style="display: flex; flex-direction: column; justify-content: center; height: 100%;"] > :nth-child(2)'
    ).contains("Grow your business with flexible business funds");
    cy.get("#login-title").should("exist").contains("Welcome back to Flex!");
    cy.get("#login-button").should("exist").contains("Login");
    cy.get("#build-label").should("exist").contains("Build v1.0.0-");
  });

  it("should NOT log into our app with invalid credentials", () => {
    const options = {
      method: "POST",
      url: Cypress.env("auth_url"),
      body: {
        grant_type: "password",
        username: Cypress.env("auth_username"),
        password: "wrong_password123",
        audience: Cypress.env("auth_audience"),
        scope: "openid profile email",
        client_id: Cypress.env("auth_client_id"),
        client_secret: Cypress.env("auth_client_secret"),
      },
      failOnStatusCode: false, // We expect to fail this
    };
    cy.request(options).then((response) => {
      expect(response.status).to.eql(403); // Expect HTTP status code to be greater than 299
      expect(response).to.have.property("headers");
      expect(response).to.have.property("body");

      expect(response.body).to.have.property("error");
      expect(response.body).to.have.property("error_description");

      // We should expect Body: { "error": "invalid_grant", "error_description": "Wrong email or password." } from Auth0
      expect(response.body.error).eql("invalid_grant");
      expect(response.body.error_description).eql("Wrong email or password.");
    });
    cy.visit("/");
  });

  it("should successfully log into our app with valid credentials", () => {
    cy.clearLocalStorage();
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
  });
});
