import "@cypress/code-coverage/support";

describe("Sprint 1 spec", () => {
	it("Header and Footer Component", () => {
		// Rendering UI check - root page
		cy.visit("http://localhost:5173");

		// Sample check on UI
		cy.get(".header-container").should("exist");
		cy.get(".currency-logo").should("exist");

		// Image in Header Component check
		cy.get(".lang-logo").should(
			"have.attr",
			"src",
			"/src/assets/connection.png"
		);
		cy.get(".currency-logo").should(
			"have.attr",
			"src",
			"/src/assets/dollar.png"
		);

		// Number of images Check
		cy.get(".header-name img").should("have.length", 1);
		cy.get(".preference img").should("have.length", 2);

		// Desktop View
		cy.get(".hamburger-menu").should("not.be.visible");

		// Value Selection among lang. dropdown
		cy.get(".lang-dropdown select").select("fr");
		cy.get(".lang-dropdown select").should("have.value", "fr");

		cy.get(".lang-dropdown select").select("hi");
		cy.get(".lang-dropdown select").should("have.value", "hi");

		// Currency selection
		cy.get("#currency-selection select").select("GBP");
		cy.get("#currency-selection select").should("have.value", "GBP");

		// Footer Component check
		// cy.get(".footer-container").should("exist");
		// cy.get(".footer-rights")
		// 	.contains("Kickdrum Technology Group LLC.")
		// 	.should("exist");
		// cy.get(".footer-rights").contains("All rights reserved").should("exist");
	});
});
