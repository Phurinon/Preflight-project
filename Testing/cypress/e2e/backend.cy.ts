before(() => {
    const url = Cypress.env("BACKEND_URL");
    cy.request({
      method: "POST",
      url: `${url}/todo/all`,
    });
  });
  
  describe("Backend", () => {
    it("checks env", () => {
      cy.log(JSON.stringify(Cypress.env()));
    });
  
    it("checks CORS disabled", () => {
      const url = Cypress.env("BACKEND_URL");
      cy.request({
        method: "GET",
        url: `${url}/todo`,
      }).then((res) => {
        // cy.log(JSON.stringify(res));
        expect(res.headers).to.not.have.property("access-control-allow-origin");
      });
    });
  
    it("checks get response", () => {
      const url = Cypress.env("BACKEND_URL");
      cy.request({
        method: "GET",
        url: `${url}/todo`,
      }).then((res) => {
        expect(res.body).to.be.a("array");
      });
    });
  
    it("creates todo", () => {
      const url = Cypress.env("BACKEND_URL");
      cy.request({
        method: "PUT",
        url: `${url}/todo`,
        body: {
          todoText: "New Todo",
        },
      }).then((res) => {
        cy.log(JSON.stringify(res.body));
        expect(res.body).to.have.all.keys("msg", "data");
        expect(res.body.data).to.all.keys("id", "todoText");
      });
    });
  
    it("deletes todo", () => {
      const url = Cypress.env("BACKEND_URL");
  
      cy.request({
        method: "PUT",
        url: `${url}/todo`,
        body: {
          todoText: "New Todo",
        },
      }).then((res) => {
        const todo = res.body.data;
        cy.request({
          method: "DELETE",
          url: `${url}/todo`,
          body: {
            id: todo.id,
          },
        }).then((res) => {
          cy.log(JSON.stringify(res.body));
          expect(res.body).to.have.all.keys("msg", "data");
          expect(res.body.data).to.all.keys("id");
        });
      });
    });
  
    it("updates todo", () => {
      const url = Cypress.env("BACKEND_URL");
  
      cy.request({
        method: "PUT",
        url: `${url}/todo`,
        body: {
          todoText: "New Todo",
        },
      }).then((res) => {
        const todo = res.body.data;
        cy.wrap(todo.id).as("currentId"); // Storing id for using later in the chain
        cy.request({
          method: "PATCH",
          url: `${url}/todo`,
          body: {
            id: todo.id,
            todoText: "Updated Text",
          },
        }).then((res) => {
          cy.request({
            method: "GET",
            url: `${url}/todo`,
          }).then(function (res) {
            // Notice that arrow function is not used here due to "this" issue
            const currentId = this.currentId; // Get value from context
            const todos = res.body;
            const todo = todos.find((el) => el.id === currentId);
            expect(todo.todoText).to.equal("Updated Text");
          });
        });
      });
    });
  });

//   it("updates todo completion status", () => {
//     const url = Cypress.env("BACKEND_URL");
  
//     // Create a new todo item
//     cy.request({
//       method: "PUT",
//       url: `${url}/todo`,
//       body: {
//         todoText: "New Todo for Completion Test",
//       },
//     }).then((res) => {
//       const todo = res.body.data;
//       const initialId = todo.id;
      
//       // Update the completion status of the todo item
//       cy.request({
//         method: "PATCH",
//         url: `${url}/todo/completed`,
//         body: {
//           id: initialId,
//           completed: true,
//         },
//       }).then((res) => {
//         // Log the response to check its structure
//         cy.log("PATCH Response:", JSON.stringify(res.body));
        
//         // Handle response if it is an array
//         if (Array.isArray(res.body)) {
//           // Access the first element of the array
//           const responseData = res.body[0];
//           expect(responseData).to.have.all.keys("id", "isDone");
//           expect(responseData.isDone).to.be.true;
//         } else {
//           // Handle response if it is an object
//           expect(res.body).to.have.all.keys("msg", "data");
//           expect(res.body.data).to.have.all.keys("id", "isDone");
//           expect(res.body.data.isDone).to.be.true; // Check that the status was updated
//         }
  
//         // Verify the update by fetching the todos again
//         cy.request({
//           method: "GET",
//           url: `${url}/todo`,
//         }).then((res) => {
//           // Log the todos to verify the completion status
//           cy.log("GET Todos Response:", JSON.stringify(res.body));
          
//           const todos = res.body;
//           const updatedTodo = todos.find((el) => el.id === initialId);
//           expect(updatedTodo.isDone).to.be.true; // Verify completion status
//         });
//       });
//     });
//   });
  