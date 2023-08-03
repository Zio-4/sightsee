export interface IProfileData {
    profile: Profile
}

type Profile = {
    clerkId: number
    bio: string
    distanceUnits: string
    dateFormat: string
    timeFormat: string
    commentsNotification: boolean
    remindersNotification: boolean
    collaboratorJoinedNotification: boolean
}