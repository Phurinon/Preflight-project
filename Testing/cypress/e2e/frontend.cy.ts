describe("Frontend", () => {
    before(() => {
      const url = Cypress.env("BACKEND_URL");
      cy.request({
        method: "POST",
        url: `${url}/todo/all`,
      });
    });
    });
  
    it("connects", () => {
      const url = Cypress.env("FRONTEND_URL");
      cy.visit(url);
    });
  
    it("creates todo", () => {
      const url = Cypress.env("FRONTEND_URL");
      const text = new Date().getTime().toString();
      cy.visit(url);
      cy.get("[data-cy='input-text']").type(text + "{enter}");
      cy.contains(text);
    });
  
    it("deletes todo", () => {
      const url = Cypress.env("FRONTEND_URL");
      const text = new Date().getTime().toString();
      cy.visit(url);
      cy.get("[data-cy='input-text']").type(text + "{enter}");
      cy.get("[data-cy='todo-item-wrapper']")
        .contains(text)
        .parent()
        .within(() => {
          cy.get("[data-cy='todo-item-delete']").click();
        });
      cy.contains(text).should("not.exist");
    });
  
    it("updates todo", () => {
      const url = Cypress.env("FRONTEND_URL");
      const text = new Date().getTime().toString();
      const textUpdated = "123456";
      cy.visit(url);
      cy.get("[data-cy='input-text']").type(text + "{enter}");
      cy.get("[data-cy='todo-item-wrapper']")
        .contains(text)
        .parent()
        .within(() => {
          cy.get("[data-cy='todo-item-update']").click();
        });
      cy.get("[data-cy='input-text']").clear().type(textUpdated).type("{enter}");
      cy.log('Typed text:', textUpdated);
      cy.contains(textUpdated);
      cy.contains(text).should("not.exist");
    });
  

    it("ALL Todo", () => {
      const url = Cypress.env("FRONTEND_URL");
      cy.visit(url);
      cy.get("[data-cy='filter-clear-all']").click();
      cy.get("[data-cy='input-text']").type("Test Todo 1{enter}");
      cy.get("[data-cy='input-text']").type("Test Todo 2{enter}");
      cy.get("[data-cy='filter-all']").click();
      cy.contains("Test Todo 1");
      cy.contains("Test Todo 2");
    });

    it("Pending Todo", () => {
      const url = Cypress.env("FRONTEND_URL");
      cy.visit(url);
      const Text1 = "1234";
      const Text2 = "5678";
      cy.get("[data-cy='filter-clear-all']").click();
      cy.get("[data-cy='input-text']").type(Text1 + "{enter}");
      cy.get("[data-cy='input-text']").type(Text2 + "{enter}");
      cy.get(`[data-cy='todo-item-wrapper']`)
        .contains(Text2)
        .parent()
        .find("[data-cy^='todo-item-checkbox-']")
        .check();
      cy.get("[data-cy='filter-pending']").click();
      cy.contains(Text2).should("not.exist");
      cy.contains(Text1).should("be.visible");
    });

    it("Completed Todo", () => {
      const url = Cypress.env("FRONTEND_URL");
      cy.visit(url);
      const Text1 = "1234";
      const Text2 = "5678";
      cy.get("[data-cy='filter-clear-all']").click();
      cy.get("[data-cy='input-text']").type(Text1 + "{enter}");
      cy.get("[data-cy='input-text']").type(Text2 + "{enter}");
      // Mark it as completed
      cy.get(`[data-cy='todo-item-wrapper']`)
        .contains(Text2)
        .parent()
        .find("[data-cy^='todo-item-checkbox-']")
        .check();
      cy.get("[data-cy='filter-completed']").click();
      cy.contains(Text2).should("be.visible");
      cy.contains(Text1).should("not.exist");
    });

    
      it("Clear All", () => {
        const url = Cypress.env("FRONTEND_URL");
        const text = new Date().getTime().toString();
        cy.visit(url);
        cy.get("[data-cy='input-text']").type(text + "{enter}");
        cy.get("[data-cy='filter-clear-all']").click();
      });


    it("checks and unchecks todo", () => {
        const url = Cypress.env("FRONTEND_URL");
        const text = new Date().getTime().toString();
        cy.visit(url);
      
        // Create a todo
        cy.get("[data-cy='input-text']").type(text + "{enter}");
      
        // Ensure the todo item is created and visible
        cy.contains(text).should("be.visible");
      
        cy.get(`[data-cy='todo-item-wrapper']`)
          .contains(text)
          .parent()
          .find("[data-cy^='todo-item-checkbox-']")
          .check()
          .should("be.checked");
      
        // Uncheck the checkbox
        cy.get(`[data-cy='todo-item-wrapper']`)
          .contains(text)
          .parent()
          .find("[data-cy^='todo-item-checkbox-']")
          .uncheck()
          .should("not.be.checked");
      });