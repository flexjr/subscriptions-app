import { Selector } from "testcafe";

fixture("Login Page (/)").page`https://localhost:3000`;

const PageTitle = Selector("title").nth(0);
const LoginButton = Selector("Button").nth(0);
const BuildLabel = Selector("p").nth(0);

test("Login page is rendered correctly", async (t) => {
  await t.expect(PageTitle.textContent).eql("Flex Jr");
  await t.expect(LoginButton.textContent).eql("Login");
  await t.expect(BuildLabel.textContent).contains("Build v1.0.0-");
  // await t.click(LoginButton);
});
