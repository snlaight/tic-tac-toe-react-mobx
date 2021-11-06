describe('Test game', ()=> {
    it('visits the game page', ()=>{
    cy.exec('yarn start')
       cy.visit('http://localhost:3000/')
       cy.get('div[id="cell-0-0"]').click()
       cy.get('div[id="cell-0-1"]').click()
       cy.get('div[id="cell-0-2"]').click()
       cy.get('div[id="cell-1-0"]').click()
       cy.get('div[id="cell-1-1"]').click()
       cy.get('div[id="cell-1-2"]').click()
       cy.get('div[id="cell-2-0"]').click()
       cy.get('button').contains('Reset').click()
    })
})