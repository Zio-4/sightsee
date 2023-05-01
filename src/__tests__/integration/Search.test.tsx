import {render, screen, waitFor} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Search from '../../components/Search/Search'

const initialItineraries = [
    {
        "id": 13,
        "name": "Whatever",
        "startDate": "1970-01-01T00:00:00.000Z",
        "endDate": "1970-01-02T00:00:00.000Z",
        "profileId": 4,
        "likes": 0,
        "public": true,
        "destinations": "Whever",
        "coverPhoto": "https://upload.wikimedia.org/wikipedia/commons/4/4d/BlankMap-World.svg",
        "ipAddress": null,
        "creator": 'UncleSam'
    },
    {
        "id": 18,
        "name": "Past trip",
        "startDate": "1970-01-01T00:00:00.000Z",
        "endDate": "1970-02-20T00:00:00.000Z",
        "profileId": 4,
        "likes": 0,
        "public": true,
        "destinations": "Paris, Brussels",
        "coverPhoto": 'https://upload.wikimedia.org/wikipedia/commons/4/4d/BlankMap-World.svg',
        "ipAddress": null,
        "creator": 'UncleWam'
    }
]

describe('Search tests', () => {
    test('Can search', async () => {
        render(<Search initialItineraries={initialItineraries}/>)

        const searchInput = screen.getByRole('textbox')
        await userEvent.type(searchInput, 'Mex')

        waitFor(() => expect(screen.getByText('whatever')).toBeDefined())
    })

    test('Goes back to initial results after clearing search query', async () => {
        render(<Search initialItineraries={initialItineraries}/>)

        const searchInput = screen.getByRole('textbox')
        await userEvent.type(searchInput, 'Mex')

        waitFor(() => expect(screen.getByText('whatever')).toBeDefined())

        await userEvent.clear(searchInput)

        waitFor(() => expect(screen.getByText('Necromancer')).toBeDefined())
    })

    test('Displays "No results found" if search does not return anything', async () => {
        render(<Search initialItineraries={initialItineraries}/>)

        const searchInput = screen.getByRole('textbox')
        await userEvent.type(searchInput, 'ffagsg')

        waitFor(() => expect(screen.getByText('No results found for')).toBeDefined())
    })
})