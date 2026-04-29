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

          cy.get('#title').type(title)
          cy.get('#url').type(url)
          cy.get('form.submit-form').submit()
          cy.get('.container-element').first().click()
        
          cy.intercept('POST', '/todos/create').as('createTodo');
          cy.intercept('GET', '/tasks/ofuser/*').as('getTasks');
          cy.intercept('GET', '/tasks/byid/*').as('tasksById');

          cy.get('.inline-form > [type="text"]').type("Hello world!")
          cy.get('form.inline-form').submit();

          cy.wait(['@createTodo', '@getTasks', '@tasksById'])
        })
      })
  })

  it('set todoitem to done', () => {
    cy.get('.todo-list > :nth-child(1)').find('.checker').click().should('have.class','checked');
  })

  it('set todoitem to not done', () => {
    const firstItem = cy.get('.todo-list > :nth-child(1)').find('.checker');
    
    firstItem.click()

    // wait for update
    cy.wait(['@tasksById'])
    
    firstItem.click().should('have.class','unchecked');
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