import "@cypress/code-coverage/support";

describe("LandingPage Component", () => {
	beforeEach(() => {
		cy.visit("http://localhost:5173");
	});

	it("should render properly", () => {
		cy.get(".landing-page-container").should("exist");
	});

	it("should display search form with all fields", () => {
		cy.get(".search-form-container").should("exist");
		cy.get(".search-input").should("exist");
		cy.get(".date-field").should("exist");
		cy.get(".guest-stay-detail").should("exist");
		cy.get(".search-btn").should("exist");
	});

	it("should select properties", () => {
		cy.get(".search-input").click();
		cy.contains("Property 1").click();
		cy.contains("Property 2").click();
		cy.contains("Property 3").click();
	});

	it("should render properly", () => {
		cy.get(".calender-with-prices").should("exist");
		cy.get(".calender-with-price").should("exist");
	});

	it("should toggle calendar visibility", () => {
		cy.get("[aria-label='toggle-calendar']").click();
		cy.get(".react-calendar").should("exist");
		cy.get("[aria-label='toggle-calendar']").click();
		cy.get(".react-calendar").should("not.exist");
	});

	it("toggles calendar visibility", () => {
		cy.get(".calender-with-price").click();
		cy.get(".react-calendar").should("be.visible");
	});
});
