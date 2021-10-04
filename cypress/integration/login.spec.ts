describe("Login Page", () => {
  it("should render correctly", () => {
    cy.visit("/");
    cy.get("#login-title").should("exist");
    cy.get("#login-title").contains("Welcome back to Flex!");
    cy.get("#login-button").contains("Login");
    cy.get("#build-label").contains("Build v1.0.0-");
  });
});
