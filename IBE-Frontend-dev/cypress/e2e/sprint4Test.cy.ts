import "@cypress/code-coverage/support";

describe("Room Modal", () => {
	beforeEach(() => {
		cy.visit(
			"http://localhost:5175/search?startDate=2024-03-29T18%3A30%3A00.000Z&endDate=2024-04-08T18%3A29%3A59.999Z&selectedProperties=Property+14&numberOfRooms=1&wheelchairAccessible=true&adultsCount=1&teensCount=0&kidsCount=0"
		);
	});

	it("should open the modal when the 'search room' button is clicked", () => {

		cy.get('[data-testid="search-room-button"]').first().click();

		cy.get('[data-testid="room-modal"]').should("be.visible");
	});

	it("should display room information in the modal", () => {

		cy.get('[data-testid="search-room-button"]').first().click();


		cy.get(".room-type-title").should("be.visible");


		cy.get(".carousal-img").should("be.visible");


		cy.get(".room-info").should("be.visible");


		cy.get(".amenities").should("be.visible");


		cy.get(".room-rates").should("be.visible");


		cy.get(".promocode").should("be.visible");
	});

	it("should allow entering and applying a promo code", () => {

		cy.get('[data-testid="search-room-button"]').first().click();


		cy.get(".promocode-input").type("EXAMPLE_PROMO_CODE");


		cy.get(".apply-promo-btn").click();


		cy.get(".MuiSnackbar-root").should("be.visible");


		cy.get(".room-rates").contains("Promo Code Discount");
	});

	it("should allow selecting a package and navigating to checkout", () => {

		cy.get('[data-testid="search-room-button"]').first().click();


		cy.contains("Select Package").click();


		cy.url().should("include", "/checkout");
	});
});
