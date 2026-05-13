describe('Adding todo item', () => {
  // define variables that we need on multiple occasions
    let uid
  let name
  let email
  let task

  beforeEach(function () {    
    // create a fabricated user from a fixture

    cy.fixture('task.json').then((taskData) => {
      task = taskData
    })

    cy.fixture('user.json')
      .then((user) => {
        cy.request({
          method: 'POST',
          url: 'http://localhost:5000/users/create',
          form: true,
          body: user
        }).then((response) => {
          uid = response.body._id.$oid
          name = user.firstName + ' ' + user.lastName
          email = user.email

          // enter the main main page
          cy.visit('http://localhost:3000')

          // detect a div which contains "Email Address", find the input and type (in a declarative way)
          cy.contains('div', 'Email Address')
            .find('input[type=text]')
            .type(email)

          // submit the form on this page
          cy.get('form')
            .submit()

          cy.intercept('POST', '/tasks/create').as('createTask');
          cy.intercept('GET', '/tasks/byid/*').as('tasksById');
          
          cy.get('#title').type(task.title)
          cy.get('#url').type(task.url)
          cy.get('form.submit-form').submit()
          cy.wait('@createTask')
        
          cy.get('.container-element > a').first().should('be.visible').click()
          cy.wait('@tasksById')
        })
      })
  })

  it('user writes no text in todo description box', () => {
    cy.get('form.inline-form').submit();

    cy.wait('@tasksById')
    
    cy.get('ul.todo-list > li.todo-item')
      .should('have.length', 1);
  })

  it('user writes text in todo description box', () => {    
    cy.get('.inline-form > [type="text"]').type(task.todos)
    cy.get('form.inline-form').submit();

    cy.wait('@tasksById')

    cy.get('ul.todo-list > li.todo-item')
      .should('have.length', 2);
  })

  afterEach(function () {
    // clean up by deleting the user from the database
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    }).then((response) => {
      cy.log(response.body)
    })
  })
})