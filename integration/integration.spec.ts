import { Selector } from "testcafe";

fixture("Login Page (/)").page`http://localhost:3000`;

const LoginTitle = Selector("Title").nth(0);
const LoginButton = Selector("Button").nth(0);
const BuildLabel = Selector("p").nth(0);

test("Login page is rendered correctly", async (t) => {
  await t.click(LoginButton);

  await t.expect(LoginTitle.textContent).eql("Welcome back to Flex!");
  await t.expect(LoginButton.textContent).eql("Welcome back to Flex!");
  await t.expect(BuildLabel.textContent).contains("Build v1.0.0-");
});
