import React from 'react'

const Footer = () => {
  return (
    <footer 
      className="fixed bottom-0 right-0 z-50 bg-background/80 text-muted-foreground text-xs p-0.5 rounded-tl-md border-l border-t border-muted text-black"
      style={{ borderTopLeftRadius: '0.5rem' }}
      aria-label="Website created by Phil Ziolkowski"
    >
      by <a href="https://x.com/Phil_Zio" target="_blank" rel="noopener noreferrer">Phil Ziolkowski</a>
    </footer>
  )
}

export default Footer
