// Navbar
export interface IGuestSignInButton {
    isHidden: boolean
}

// Modal
export interface IModal {
    isOpen: boolean
    toggleModal: () => void
    path: string
}