export {};

describe("Login Page", () => {
  it("should render correctly", () => {
    cy.visit("/");
    cy.get("#login-title").should("exist");
    cy.get("#login-title").contains("Welcome back to Flex!");
    cy.get("#login-button").contains("Login");
    cy.get("#build-label").contains("Build v1.0.0-");
  });

  it("should successfully log into our app with valid credentials", () => {
    cy.login()s
      .then((resp) => {
        return resp.body;
      })
      .then((body) => {
        const { access_token, expires_in, id_token } = body;
        const auth0State = {
          nonce: "",
          state: "some-random-state",
        };
        const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`;
        cy.visit(callbackUrl, {
          onBeforeLoad(win) {
            win.document.cookie = "com.auth0.auth.some-random-state=" + JSON.stringify(auth0State);
          },
        });
      });
    cy.visit("/debugger");
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
      expect(response.status).to.gt(299); // Expect HTTP status code to be greater than 299
      expect(response).to.have.property("headers");
      expect(response).to.have.property("body");
    });
  });
});
