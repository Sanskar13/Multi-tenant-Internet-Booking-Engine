import "@cypress/code-coverage/support";

describe("Room Results Page", () => {
	beforeEach(() => {
		cy.visit(
			"http://localhost:5175/search?startDate=2024-03-29T18%3A30%3A00.000Z&endDate=2024-04-08T18%3A29%3A59.999Z&selectedProperties=Property+14&numberOfRooms=1&wheelchairAccessible=true&adultsCount=1&teensCount=0&kidsCount=0"
		); 
	});

	it("should navigate to room card and find search room button", () => {

		cy.get('[data-testid="room-card"]').should("have.length.above", 0);

	
		cy.get('[data-testid="room-card"]').first().click();

		cy.get('[data-testid="search-room-button"]').should("be.visible");
	});

	it("should display room information", () => {
		cy.get('[data-testid="room-card"]').should("have.length.above", 0);

		cy.get('[data-testid="room-card"]')
			.first()
			.find(".room-name")
			.should("be.visible");

	cy.get('[data-testid="room-card"]')
			.first()
			.find(".room-location")
			.should("be.visible");

		cy.get('[data-testid="room-card"]')
			.first()
			.find(".room-capacity")
			.should("be.visible");

		cy.get('[data-testid="room-card"]')
			.first()
			.find(".room-type")
			.should("be.visible");


		cy.get('[data-testid="room-card"]')
			.first()
			.find(".room-deal")
			.should("be.visible");


		cy.get('[data-testid="room-card"]')
			.first()
			.find(".room-price")
			.should("be.visible");
	});

	it("should have images in carousel", () => {

		cy.get('[data-testid="room-card"]').should("have.length.above", 0);


		cy.get('[data-testid="room-card"]')
			.first()
			.find(".carousel")
			.should("exist");


		cy.get('[data-testid="room-card"]')
			.first()
			.find(".carousel")
			.find("img")
			.should("have.length.above", 0);
	});

	it("should have a clickable 'search room' button", () => {

		cy.get('[data-testid="room-card"]').should("have.length.above", 0);


		cy.get(".covering-element").should("not.exist");


		cy.get('[data-testid="room-card"]')
			.first()
			.find('[data-testid="search-room-button"]')
			.should("be.visible")
			.click();


		cy.get('[data-testid="room-modal"]').should("be.visible");
	});
});
