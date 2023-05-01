import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TripDay from '../../components/Itinerary/TripDay'

describe('Activity operations', () => {
    test('Able to create an activity', async () => {
        render(<TripDay date={new Date()} activities={[]} tripDayId={10}/>)

        // Get input field and enter text
        const activityNameInput = screen.getByLabelText('activity-name-input')
        await userEvent.type(activityNameInput, 'River')

        // Get add acitivty button and click it
        const addActivityButton = screen.getByRole('button', {name: 'add-activity-button'})
        await userEvent.click(addActivityButton)

        waitFor(() => expect(screen.getByText('River')).toBeDefined(), { timeout: 2000} )
    })

    test('Activity cannot be created without a name', async () => {
        render(<TripDay date={new Date()} activities={[]} tripDayId={10}/>)

        // Get add activity button and click it
        const addActivityButton = screen.getByRole('button', {name: 'add-activity-button'})
        await userEvent.click(addActivityButton)

        waitFor(() => expect(screen.getByText('Add time')).toBeUndefined(), { timeout: 2000} )
    })

    test('Able to delete an activity', async () => {
        // Create an itinerary
        render(<TripDay date={new Date()} activities={[]} tripDayId={10}/>)

        // Get input field and enter text
        const activityNameInput = screen.getByLabelText('activity-name-input')
        await userEvent.type(activityNameInput, 'River')

        // Get add acitivty button and click it
        const addActivityButton = screen.getByRole('button', {name: 'add-activity-button'})
        await userEvent.click(addActivityButton)

        waitFor(async () => await userEvent.click(screen.getByRole('button', {name: 'delete-button'})), { timeout: 2000} )
        
        // Expect new activity to be deleted
        waitFor(() => expect(screen.getByText('Add time')).toBeUndefined(), { timeout: 2000} )
    })
})
