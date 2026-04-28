describe('Adding todo item', () => {
  // define variables that we need on multiple occasions
  let uid // user id
  let name // name of the user (firstName + ' ' + lastName)
  let email // email of the user

  const title = "Testing title"
  const url = "nzDuj42HJ1o"

  before(function () {
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
        })
      })
  })

  beforeEach(function () {
    // enter the main main page
    cy.visit('http://localhost:3000')

    // detect a div which contains "Email Address", find the input and type (in a declarative way)
    cy.contains('div', 'Email Address')
      .find('input[type=text]')
      .type(email)
    // alternative, imperative way of detecting that input field
    //cy.get('.inputwrapper #email')
    //    .type(email)

    // submit the form on this page
    cy.get('form')
      .submit()

    cy.get('#title').type(title)
    cy.get('#url').type(url)
    cy.get('form.submit-form').submit()
    cy.get('.container-element').first().click()
  })

  it('user writes no text in todo description box', () => {
    cy.get('ul.todo-list > li.todo-item')
      .then($items => {
        const initialCount = $items.length;

        cy.get('form.inline-form').submit();
        cy.wait(200)

        cy.get('ul.todo-list > li.todo-item')
          .should('have.length', initialCount);
      });
  })



  after(function () {
    // clean up todo items
    cy.get('ul.todo-list > li.todo-item')
      .then($items => {
        const initialCount = $items.length;

        cy.get('form.inline-form').submit();
        cy.wait(200)

        cy.get('ul.todo-list > li.todo-item')
          .should('have.length', initialCount);
      });
    
    // clean up by deleting the user from the database
    cy.request({
      method: 'DELETE',
      url: `http://localhost:5000/users/${uid}`
    }).then((response) => {
      cy.log(response.body)
    })
  })
})