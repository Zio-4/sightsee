import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Plan from '../../pages/trips/plan'

describe('Itinerary creation', () => {
    test('Cannot create itinerary without a title', async () => {
        render(<Plan />)

        // Check that title input is empty
        const destinationInputElement = screen.getByLabelText('destination-input')
        expect((destinationInputElement.textContent!.length)).toBe(0)

        // get submit button
        const submitButton = screen.getByLabelText('itinerary-form-submit-button')
        
        // fire userEvent on submit button
        userEvent.click(submitButton)
        
        // Check we are still on the same page
        const headerText = screen.getAllByText('Plan a new trip!')
        expect(headerText).toBeDefined()
    })
})