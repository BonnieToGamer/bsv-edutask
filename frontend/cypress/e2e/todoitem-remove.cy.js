describe('Adding todo item', () => {
  // define variables that we need on multiple occasions
  let uid // user id
  let name // name of the user (firstName + ' ' + lastName)
  let email // email of the user

  const title = "Testing title"
  const url = "nzDuj42HJ1o"

  beforeEach(function () {
    // create a fabricated user from a fixture
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
          
          cy.get('#title').type(title)
          cy.get('#url').type(url)
          cy.get('form.submit-form').submit()
          cy.wait('@createTask')
        
          cy.get('.container-element > a').first().should('be.visible').click()
          cy.wait('@tasksById')
        })
      })
  })

  it('remove todoItem', () => {
    cy.get('.todo-list > :nth-child(1)').find('.remover').click()
    cy.wait(['@tasksById'])
    cy.get('.todo-list > li.todo-item').should('have.length', 0)
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