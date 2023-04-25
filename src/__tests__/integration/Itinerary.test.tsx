import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TripDay from '../../components/TripDay'

describe('Activity operations', () => {
    test('Able to create a new activity', async () => {
        render(<TripDay date={new Date()} activities={[]} tripDayId={10}/>)

        // Get input field and enter text
        const activityNameInput = screen.getByLabelText('activity-name-input')
        await userEvent.type(activityNameInput, 'Eiffel')

        // Get add acitivty button and click it
        const addActivityButton = screen.getByRole('button', {name: 'add-activity-button'})
        await userEvent.click(addActivityButton)

        // Expect new activity with text as title to exist
        setTimeout(() => {
            expect(screen.getByText('Eiffel')).toBeDefined()
        }, 1000)
    })
})
