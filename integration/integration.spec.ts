import { ClientFunction, Role, Selector } from "testcafe";

fixture("Login Page (/)").page`https://localhost:3000`;

const PageTitle = Selector("title").nth(0);
const LoginTitle = Selector("#login-title").nth(0);
const LoginButton = Selector("Button").nth(0);
const BuildLabel = Selector("p").nth(0);
const getLocation = ClientFunction(() => document.location.href);

test("Login page is rendered correctly", async (t) => {
  await t.expect(PageTitle.textContent).eql("Flex Jr");
  await t.expect(LoginTitle.textContent).eql("Welcome back to Flex!");
  await t.expect(LoginButton.textContent).eql("Login");
  await t.expect(BuildLabel.textContent).contains("Build v1.0.0-");
});

test("Login button should redirect to Auth0", async (t) => {
  await t.expect(PageTitle.textContent).eql("Flex Jr");
  await t.expect(LoginTitle.textContent).eql("Welcome back to Flex!");
  await t.expect(LoginButton.textContent).eql("Login");
  await t.expect(BuildLabel.textContent).contains("Build v1.0.0-");
  await t.click(LoginButton);
  await t.expect(getLocation()).contains("https://flexjr.us.auth0.com/u/login?state=");
});

const Auth0EmailInput = Selector("input").withAttribute("id", "username");
const Auth0PasswordInput = Selector("input").withAttribute("id", "password");
const Auth0ContinueButton = Selector("button").withAttribute("type", "submit");

test("User should NOT be able to login with invalid credentials", async (t) => {
  // We have a valid user in the database with the following credentials
  const username = "invalid_user@example.com";
  const password = "invalid_password@example.com2021";

  await t.click(LoginButton);
  await t.expect(getLocation()).contains("https://flexjr.us.auth0.com/u/login?state=");
  await t.typeText(Auth0EmailInput, username);
  await t.typeText(Auth0PasswordInput, password);
  await t.click(Auth0ContinueButton);

  // Should expect to stay on same Auth0 login page and see an error message
  const Auth0WrongCredentialsError = Selector("#error-element-password").nth(0);
  await t.expect(getLocation()).contains("https://flexjr.us.auth0.com/u/login?state=");
  await t.expect(Auth0WrongCredentialsError.textContent).eql("Wrong email or password");
});

const exampleUserRole: Role = Role(
  "https://localhost:3000/",
  async (t) => {
    // We have a valid user in the database with the following credentials
    const username = "user@example.com";
    const password = "user@example.com2021";

    await t.click(LoginButton);
    await t
      .wait(5000)
      .click(Auth0EmailInput)
      .typeText(Auth0EmailInput, username)
      .click(Auth0PasswordInput)
      .typeText(Auth0PasswordInput, password)
      .click(Auth0ContinueButton)
      .wait(10000);
  },
  { preserveUrl: true }
);

// test("User should be able to login with valid credentials", async (t) => {
//   t.useRole(exampleUserRole);

//   // Should be redirected back to app
//   await t.expect(getLocation()).contains("/flex/dashboard");
// });
