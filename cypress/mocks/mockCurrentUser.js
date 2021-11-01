import data from "../fixtures/mock_current_user.json"

export const getCurrentUser = () => {
    let url = "/users/current_user_info";
    let method = "GET"
    cy.intercept({
        method: method,
        url: url,
        staticResponse: {
            statusCode: 200,
            body: {
                data
            }
        }
    }).as("mockUserInfo")
}