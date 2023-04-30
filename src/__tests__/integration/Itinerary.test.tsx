import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TripDay from '../../components/TripDay'

describe('Activity operations', () => {
    test('Able to create an activity', async () => {
        render(<TripDay date={new Date()} activities={[]} tripDayId={10}/>)

        // Get input field and enter text
        const activityNameInput = screen.getByLabelText('activity-name-input')
        await userEvent.type(activityNameInput, 'River')

        // Get add acitivty button and click it
        const addActivityButton = screen.getByRole('button', {name: 'add-activity-button'})
        await userEvent.click(addActivityButton)

        // Expect new activity with text as title to exist
        setTimeout(() => {
            expect(screen.getByText('River')).toBeDefined()
        }, 1500)
    })

    test('Activity cannot be created without a name', async () => {
        render(<TripDay date={new Date()} activities={[]} tripDayId={10}/>)

        // Get add activity button and click it
        const addActivityButton = screen.getByRole('button', {name: 'add-activity-button'})
        await userEvent.click(addActivityButton)

        setTimeout(() => {
            expect(screen.getByText('Add time')).toBeUndefined()
        }, 1500)
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

        // Get delete icon and click it
        setTimeout(async () => {
            await userEvent.click(screen.getByRole('button', {name: 'delete-button'}))
        }, 1500)
        
        // Expect new activity to be deleted
        setTimeout(() => {
            expect(screen.getByText('Add time')).toBeUndefined()
        }, 1500)
    })
})
